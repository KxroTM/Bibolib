from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import jwt
import requests
from datetime import datetime, timedelta, timezone
from functools import wraps
from sqlalchemy import text

from models import (
    db,
    create_user,
    get_all_users,
    create_bibliotheque,
    get_bibliotheque_by_id,
    create_all_tables,
    get_all_bibliotheques,
    get_all_books,
    delete_book,
    get_book_by_id,
    create_book,
    update_book,
    set_book_status,
    update_bibliotheque,
    delete_bibliotheque,
    update_user,
    delete_user,
    remove_roles_for_user,
    get_user_by_email,
    get_user_by_id,
    verify_password,
    get_roles_for_user,
    get_role_by_name,
    create_role,
    assign_role_to_user,
    get_books_by_bibliotheque,
    search_books,
    get_arrondissements,
    get_genres_for_bibliotheque,
    reserve_book,
    get_reservation_for_book,
    get_permissions_for_user,
    get_permission_by_name,
    create_permission,
    get_permissions_for_role,
    user_has_permission,
    assign_permission_to_role,
    search_books_by_library,
    get_books_by_bibliotheque_filtered
)
from models import get_user_by_username

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/bibolib")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "dev-secret-change-me")
app.config["JWT_EXPIRE_MIN"] = int(os.getenv("JWT_EXPIRE_MIN", "120"))

db.init_app(app)

# ==================
# Logging service integration (service Go)
# ==================
LOGS_SERVICE_URL = os.getenv("LOGS_SERVICE_URL", "http://activity_logs:8080")

def send_activity_log(endpoint: str, payload: dict):
    url = f"{LOGS_SERVICE_URL}{endpoint}"
    try:
        r = requests.post(url, json=payload, timeout=2)
        if r.status_code >= 400:
            print(f"[logs] Echec envoi {endpoint} status={r.status_code} body={r.text}")
    except Exception as e:
        print(f"[logs] Erreur envoi {endpoint}: {e}")

# Helper conversion pour Row SQLAlchemy 2.0 -> dict
def row_to_dict(row):
    if row is None:
        return None
    mapping = getattr(row, "_mapping", None)
    if mapping is not None:
        return dict(mapping)
    try:
        return dict(row)
    except Exception:
        return None

def rows_to_dicts(rows):
    return [row_to_dict(r) for r in rows]

@app.route("/")
def home():
    return {"message": "API Bibolib OK"}

# ==================
# Auth helpers
# ==================
def create_token(user_id):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),  # Convertir en string pour PyJWT
        "exp": now + timedelta(minutes=app.config["JWT_EXPIRE_MIN"]),
        "iat": now
    }
    return jwt.encode(payload, app.config["JWT_SECRET"], algorithm="HS256")

def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token manquant"}), 401
            
        token = auth_header.split(" ", 1)[1]
        
        try:
            data = jwt.decode(token, app.config["JWT_SECRET"], algorithms=["HS256"])
            user_id = int(data["sub"])  # Convertir le sub string en entier
            user = get_user_by_id(user_id)
            if not user:
                return jsonify({"message": "Utilisateur introuvable"}), 401
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expiré"}), 401
        except Exception as e:
            return jsonify({"message": "Token invalide"}), 401
        return f(*args, **kwargs)
    return wrapper

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = getattr(request, 'current_user', None)
        if not user:
            return jsonify({"message": "Non autorisé"}), 401
        roles = get_roles_for_user(user['id'])
        if 'admin' not in roles:
            return jsonify({"message": "Accès administrateur requis"}), 403
        return f(*args, **kwargs)
    return wrapper

def permission_required(permission_name):
    """Decorator to enforce a specific permission for the current user."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = getattr(request, 'current_user', None)
            if not user:
                return jsonify({"message": "Non autorisé"}), 401
            if not user_has_permission(user['id'], permission_name):
                return jsonify({"message": f"Permission requise: {permission_name}"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# ==================
# Auth endpoints
# ==================
@app.route('/auth/register', methods=['POST'])
@app.route('/api/auth/register', methods=['POST'])  # alias pour cohérence
def register():
    data = request.json or {}
    required = ["username", "email", "password"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"message": "Champs manquants"}), 400
    existing = get_user_by_email(data['email'])
    if existing:
        return jsonify({"message": "Email déjà utilisé"}), 409
    user = create_user(data['username'], data['email'], data['password'])
    token = create_token(user['id'])
    # Envoi du log création de compte (best effort)
    send_activity_log("/auth/create-account", {
        "user_id": user['id'],
        "username": user['username'],
        "ip": request.remote_addr or 'backend'
    })
    return jsonify({"token": token, "user": user}), 201

@app.route('/auth/login', methods=['POST'])
@app.route('/api/auth/login', methods=['POST'])  # alias pour cohérence
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Email et mot de passe requis"}), 400
    user = get_user_by_email(email)
    if not user or not verify_password(user['password_hash'], password):
        return jsonify({"message": "Identifiants invalides"}), 401
    roles = get_roles_for_user(user['id'])
    permissions = get_permissions_for_user(user['id'])
    safe_user = {
        "id": user['id'],
        "username": user['username'],
        "email": user['email'],
        "roles": roles,
        "permissions": permissions
    }
    token = create_token(user['id'])
    return jsonify({"token": token, "user": safe_user})

@app.route('/api/auth/me', methods=['GET'])
@app.route('/auth/me', methods=['GET'])  # alias sans /api pour compatibilité
@auth_required
def me():
    user = request.current_user
    roles = get_roles_for_user(user['id'])
    permissions = get_permissions_for_user(user['id'])
    return jsonify({
        "id": user['id'],
        "username": user['username'],
        "email": user['email'],
        "roles": roles,
        "permissions": permissions
    })


@app.route("/users", methods=["POST"])
def add_user_legacy():
    # Legacy support, expect username,email,password
    data = request.json or {}
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"message": "Paramètres manquants"}), 400
    existing = get_user_by_email(data['email'])
    if existing:
        return jsonify({"message": "Email déjà utilisé"}), 409
    user = create_user(data['username'], data['email'], data['password'])
    return jsonify({"message": "Utilisateur créé", "user": user}), 201

@app.route("/users", methods=["GET"])
def list_users():
    rows = get_all_users()
    base = rows_to_dicts(rows)
    enriched = []
    for u in base:
        uid = u.get('id')
        # retire le hash si présent
        u.pop('password_hash', None)
        u['roles'] = get_roles_for_user(uid) if uid else []
        enriched.append(u)
    return jsonify(enriched)

@app.route('/admin/users', methods=['GET'])
def admin_list_users():
    """Endpoint admin pour lister les utilisateurs avec support de recherche"""
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    
    q = request.args.get('q', '').strip()  # Recherche par nom ou email
    role_filter = request.args.get('role', '').strip()  # Filtrage par rôle

    base_sql = "SELECT id, username, email, created_at FROM users"
    count_sql = "SELECT COUNT(*) as c FROM users"
    params = {}
    conditions = []
    
    if q:
        conditions.append("(username LIKE :search OR email LIKE :search)")
        params['search'] = f'%{q}%'
    
    # Filtrage par rôle - nécessite une jointure avec role_user et roles
    if role_filter:
        base_sql = """
            SELECT DISTINCT u.id, u.username, u.email, u.created_at 
            FROM users u 
            INNER JOIN role_user ru ON u.id = ru.user_id 
            INNER JOIN roles r ON ru.role_id = r.id
        """
        count_sql = """
            SELECT COUNT(DISTINCT u.id) as c 
            FROM users u 
            INNER JOIN role_user ru ON u.id = ru.user_id 
            INNER JOIN roles r ON ru.role_id = r.id
        """
        conditions.append("r.name = :role")
        params['role'] = role_filter
    
    if conditions:
        where_clause = " WHERE " + " AND ".join(conditions)
        base_sql += where_clause
        count_sql += where_clause
    
    base_sql += " ORDER BY id LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    users_raw = rows_to_dicts(rows)

    # Enrichir avec les rôles
    users = []
    for u in users_raw:
        uid = u.get('id')
        u['roles'] = get_roles_for_user(uid) if uid else []
        users.append(u)

    total = db.session.execute(text(count_sql), {k: v for k, v in params.items() if k not in ['limit', 'offset']}).fetchone()[0]
    
    total_pages = (total + limit - 1) // limit

    return jsonify({
        'users': users,
        'total': total,
        'totalPages': total_pages,
        'currentPage': page
    })

@app.route('/users/<int:user_id>', methods=['PUT'])
@auth_required
@permission_required('USER_MANAGE')
def edit_user(user_id):
    u = get_user_by_id(user_id)
    if not u:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404
    data = request.json or {}
    update_user(user_id, username=data.get('username'), email=data.get('email'), password_plain=data.get('password'))
    # Optionnel: mise à jour des rôles
    if 'roles' in data and isinstance(data['roles'], list):
        remove_roles_for_user(user_id)
        for rname in data['roles']:
            role = get_role_by_name(rname)
            if not role:
                create_role(rname)
                role = get_role_by_name(rname)
            assign_role_to_user(user_id, role['id'])
    refreshed = get_user_by_id(user_id)
    refreshed_roles = get_roles_for_user(user_id)
    send_activity_log("/auth/user-roles-change", {
        "user_id": user_id,
        "username": refreshed['username'],
        "ip": request.remote_addr or 'backend',
        "oldroles": get_roles_for_user(user_id),
        "newroles": refreshed_roles
    })
    return jsonify({**refreshed, 'roles': refreshed_roles})

@app.route('/users/<int:user_id>', methods=['DELETE'])
@auth_required
@permission_required('USER_MANAGE')
def remove_user(user_id):
    u = get_user_by_id(user_id)
    if not u:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404
    delete_user(user_id)
    send_activity_log("/auth/delete-account", {
        "user_id": user_id,
        "username": u['username'],
        "ip": request.remote_addr or 'backend'
    })
    send_activity_log("/auth/delete-account", {
        "user_id": user_id,
        "username": u['username'],
        "ip": request.remote_addr or 'backend'
    })
    return jsonify({'message': 'Utilisateur supprimé'})

# ==================
# Admin aliases (lecture protégée)
# ==================

@app.route("/bibliotheques", methods=["POST"])
@auth_required
@permission_required("LIBRARY_MANAGE")
def add_bibliotheque():
    data = request.json or {}
    required = ["name", "adresse"]
    if not all(data.get(k) for k in required):
        return jsonify({"message": "Champs manquants"}), 400
    create_bibliotheque(
        name=data["name"],
        adresse=data["adresse"],
        telephone=data.get("telephone"),
        email=data.get("email"),
        arrondissement=data.get("arrondissement")
    )
    return jsonify({"message": "Bibliothèque créée"}), 201

@app.route("/bibliotheques/<int:biblio_id>", methods=["PUT"])
@auth_required
@permission_required("LIBRARY_MANAGE")
def edit_bibliotheque(biblio_id):
    b = get_bibliotheque_by_id(biblio_id)
    if not b:
        return jsonify({"message": "Bibliothèque non trouvée"}), 404
    payload = request.json or {}
    update_fields = {k: v for k, v in payload.items() if v is not None}
    update_bibliotheque(biblio_id, **update_fields)
    updated = get_bibliotheque_by_id(biblio_id)
    return jsonify(updated)

@app.route("/bibliotheques/<int:biblio_id>", methods=["DELETE"])
@auth_required
@permission_required("LIBRARY_MANAGE")
def remove_bibliotheque(biblio_id):
    b = get_bibliotheque_by_id(biblio_id)
    if not b:
        return jsonify({"message": "Bibliothèque non trouvée"}), 404
    delete_bibliotheque(biblio_id)
    return jsonify({"message": "Bibliothèque supprimée"})

@app.route("/bibliotheques/<int:biblio_id>", methods=["GET"])
def get_bibliotheque(biblio_id):
    biblio = get_bibliotheque_by_id(biblio_id)
    if biblio:
        return jsonify(dict(biblio))
    return jsonify({"message": "Bibliothèque non trouvée"}), 404

@app.route("/bibliotheques", methods=["GET"])
def list_bibliotheques():
    # Params pagination / filtre
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    
    q = request.args.get('q', '').strip()  # Recherche par nom
    arrondissement = request.args.get('arrondissement', '').strip()

    base_sql = "SELECT * FROM bibliotheques"
    count_sql = "SELECT COUNT(*) as c FROM bibliotheques"
    params = {}
    conditions = []
    
    if q:
        conditions.append("(name LIKE :search OR adresse LIKE :search)")
        params['search'] = f'%{q}%'
    
    if arrondissement:
        conditions.append("arrondissement = :arr")
        params['arr'] = arrondissement
    
    if conditions:
        where_clause = " WHERE " + " AND ".join(conditions)
        base_sql += where_clause
        count_sql += where_clause
    base_sql += " ORDER BY id LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), {k: v for k, v in params.items() if k not in ['limit', 'offset']}).fetchone()[0]
    data = rows_to_dicts(rows)
    
    # Ajouter le nombre de livres disponibles pour chaque bibliothèque
    for library in data:
        book_count_sql = """
            SELECT COUNT(*) as book_count 
            FROM book 
            WHERE bibliotheque_id = :library_id 
            AND statut = 'Disponible'
        """
        book_count = db.session.execute(
            text(book_count_sql), 
            {'library_id': library['id']}
        ).fetchone()[0]
        library['bookCount'] = book_count
    
    return jsonify({
        "libraries": data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

# Alias admin (même data, chemin différent demandé côté dashboard)
@app.route('/admin/bibliotheques', methods=['GET'])
def admin_list_bibliotheques():
    """Endpoint admin pour lister les bibliothèques avec support de recherche"""
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    
    q = request.args.get('q', '').strip()  # Recherche par nom
    arrondissement = request.args.get('arrondissement', '').strip()

    base_sql = "SELECT * FROM bibliotheques"
    count_sql = "SELECT COUNT(*) as c FROM bibliotheques"
    params = {}
    conditions = []
    
    if q:
        conditions.append("name LIKE :search")
        params['search'] = f'%{q}%'
    
    if arrondissement:
        conditions.append("arrondissement = :arr")
        params['arr'] = arrondissement
    
    if conditions:
        where_clause = " WHERE " + " AND ".join(conditions)
        base_sql += where_clause
        count_sql += where_clause
    
    base_sql += " ORDER BY id LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    libraries = rows_to_dicts(rows)

    total = db.session.execute(text(count_sql), {k: v for k, v in params.items() if k not in ['limit', 'offset']}).fetchone()[0]
    
    total_pages = (total + limit - 1) // limit

    return jsonify({
        'libraries': libraries,
        'total': total,
        'totalPages': total_pages,
        'currentPage': page
    })

@app.route('/admin/books', methods=['GET'])
@auth_required
def admin_list_books():
    """Endpoint admin pour lister les livres avec informations enrichies (nom bibliothèque)"""
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    genre = request.args.get('genre', '').strip()
    availability = request.args.get('availability', '').strip()
    q = request.args.get('q', '').strip()  # Recherche par titre/auteur

    # Requête avec JOIN pour récupérer le nom de la bibliothèque
    base_sql = """
    SELECT b.*, bib.name as bibliotheque_nom 
    FROM book b 
    LEFT JOIN bibliotheques bib ON b.bibliotheque_id = bib.id
    """
    count_sql = "SELECT COUNT(*) as c FROM book b"
    params = {}
    where_clauses = []
    
    if genre:
        where_clauses.append("b.categorie = :genre")
        params['genre'] = genre
    if availability:
        from models import _api_status_to_db_statut
        statut_db = _api_status_to_db_statut(availability)
        where_clauses.append("b.statut = :statut")
        params['statut'] = statut_db
    if q:
        where_clauses.append("(b.titre LIKE :q OR b.auteur LIKE :q)")
        params['q'] = f'%{q}%'
    
    if where_clauses:
        where_sql = " WHERE " + " AND ".join(where_clauses)
        base_sql += where_sql
        count_sql += where_sql.replace("b.", "")  # Pour le count, pas de alias nécessaire
        
    base_sql += " ORDER BY b.titre LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), params).fetchone()[0]
    
    # Convertir les lignes vers format API enrichi
    books_data = []
    for row in rows:
        from models import _book_row_to_api_dict
        book_dict = _book_row_to_api_dict(row)
        if book_dict:
            # Ajouter le nom de la bibliothèque
            book_dict['bibliotheque_nom'] = row.bibliotheque_nom if hasattr(row, 'bibliotheque_nom') else None
            books_data.append(book_dict)
    
    return jsonify({
        "books": books_data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })


@app.route("/books", methods=["GET"])
def list_books():
    # Params pagination / filtre (même pattern que bibliotheques)
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    genre = request.args.get('genre', '').strip()
    availability = request.args.get('availability', '').strip()

    # Construire la requête avec filtres (même logique que bibliotheques)
    base_sql = "SELECT * FROM book"
    count_sql = "SELECT COUNT(*) as c FROM book"
    params = {}
    where_clauses = []
    
    if genre:
        where_clauses.append("categorie = :genre")
        params['genre'] = genre
    if availability:
        from models import _api_status_to_db_statut
        statut_db = _api_status_to_db_statut(availability)
        where_clauses.append("statut = :statut")
        params['statut'] = statut_db
    
    if where_clauses:
        where_sql = " WHERE " + " AND ".join(where_clauses)
        base_sql += where_sql
        count_sql += where_sql
        
    base_sql += " ORDER BY titre LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), params).fetchone()[0]
    
    # Convertir les lignes vers format API
    from models import _book_row_to_api_dict
    books_data = [_book_row_to_api_dict(row) for row in rows]
    
    return jsonify({
        "books": books_data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

@app.route("/books/recent", methods=["GET"])
def get_recent_books():
    """Endpoint pour récupérer les livres récents"""
    try:
        limit = int(request.args.get('limit', '8'))
        from models import get_recent_books
        books = get_recent_books(limit)
        return jsonify(books)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/books/featured", methods=["GET"])
def get_featured_books():
    """Endpoint pour récupérer les livres mis en avant (aléatoire pour l'instant)"""
    try:
        limit = int(request.args.get('limit', '8'))
        from models import get_random_books
        books = get_random_books(limit)
        return jsonify(books)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/books", methods=["POST"])
@auth_required
@permission_required("BOOK_MANAGE")
def add_book():
    data = request.json or {}
    required = ["title", "author", "bibliotheque_id"]
    if not all(data.get(k) for k in required):
        return jsonify({"message": "Champs manquants"}), 400
    # create_book accepte maintenant les clés API
    new_book = create_book(**data)
    send_activity_log("/books/add-book", {
        "user_id": request.current_user['id'],
        "username": request.current_user['username'],
        "book_id": new_book['id'],
        "title": new_book['title'],
        "ip": request.remote_addr or 'backend'
    })
    return jsonify(new_book), 201

@app.route("/books/<int:book_id>", methods=["PUT"])
@auth_required
@permission_required("BOOK_MANAGE")
def edit_book(book_id):
    b = get_book_by_id(book_id)
    if not b:
        return jsonify({"message": "Livre non trouvé"}), 404
    payload = request.json or {}
    update_fields = {k: v for k, v in payload.items() if v is not None}
    update_book(book_id, **update_fields)
    updated = get_book_by_id(book_id)
    return jsonify(updated)


@app.route("/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = get_book_by_id(book_id)
    if book:
        return jsonify(book)
    return jsonify({"message": "Livre non trouvé"}), 404

@app.route("/books/<int:book_id>", methods=["DELETE"])
@auth_required
@permission_required("BOOK_MANAGE")
def remove_book(book_id):
    book = get_book_by_id(book_id)
    if book:
        delete_book(book_id)
        return jsonify({"message": "Livre supprimé"})
    send_activity_log("/books/delete-book", {
        "user_id": request.current_user['id'],
        "username": request.current_user['username'],
        "book_id": book_id,
        "ip": request.remote_addr or 'backend'
    })
    return jsonify({"message": "Livre non trouvé"}), 404

# =============== Extended library/book endpoints expected by frontend ===============
@app.route('/bibliotheques/<int:biblio_id>/books', methods=['GET'])
def books_for_library(biblio_id):
    # Params pagination / filtre (même pattern que bibliotheques)
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    genre = request.args.get('genre', '').strip()
    availability = request.args.get('availability', '').strip()

    # Construire la requête avec filtres
    base_sql = "SELECT * FROM book WHERE bibliotheque_id = :bid"
    count_sql = "SELECT COUNT(*) as c FROM book WHERE bibliotheque_id = :bid"
    params = {"bid": biblio_id}
    
    if genre:
        base_sql += " AND categorie = :genre"
        count_sql += " AND categorie = :genre"
        params['genre'] = genre
    if availability:
        from models import _api_status_to_db_statut
        statut_db = _api_status_to_db_statut(availability)
        base_sql += " AND statut = :statut"
        count_sql += " AND statut = :statut"
        params['statut'] = statut_db
        
    base_sql += " ORDER BY titre LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), {k: v for k, v in params.items() if k != 'limit' and k != 'offset'}).fetchone()[0]
    
    # Convertir les lignes vers format API
    from models import _book_row_to_api_dict
    books_data = [_book_row_to_api_dict(row) for row in rows]
    
    return jsonify({
        "books": books_data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

@app.route('/bibliotheques/<int:biblio_id>/books/search', methods=['GET'])
def books_for_library_search(biblio_id):
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({
            "books": [],
            "currentPage": 1,
            "totalPages": 1,
            "total": 0
        })
    
    # Pagination pour la recherche dans une bibliothèque
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    
    # Recherche avec pagination dans une bibliothèque
    like = f"%{q}%"
    base_sql = "SELECT * FROM book WHERE bibliotheque_id = :bid AND (titre LIKE :q OR auteur LIKE :q)"
    count_sql = "SELECT COUNT(*) as c FROM book WHERE bibliotheque_id = :bid AND (titre LIKE :q OR auteur LIKE :q)"
    params = {"bid": biblio_id, "q": like}
    
    base_sql += " ORDER BY titre LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset
    
    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), {"bid": biblio_id, "q": like}).fetchone()[0]
    
    # Convertir les lignes vers format API
    from models import _book_row_to_api_dict
    books_data = [_book_row_to_api_dict(row) for row in rows]
    
    return jsonify({
        "books": books_data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

@app.route('/books/search', methods=['GET'])
def search_books_endpoint():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({
            "books": [],
            "currentPage": 1,
            "totalPages": 1,
            "total": 0
        })
    
    # Pagination pour la recherche
    try:
        page = int(request.args.get('page', '1'))
        limit = int(request.args.get('limit', '50'))
    except ValueError:
        page, limit = 1, 50
    if limit <= 0:
        limit = 50
    if page <= 0:
        page = 1
    offset = (page - 1) * limit
    
    # Recherche avec pagination
    like = f"%{q}%"
    base_sql = "SELECT * FROM book WHERE titre LIKE :q OR auteur LIKE :q"
    count_sql = "SELECT COUNT(*) as c FROM book WHERE titre LIKE :q OR auteur LIKE :q"
    params = {"q": like}
    
    base_sql += " ORDER BY titre LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset
    
    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), {"q": like}).fetchone()[0]
    
    # Convertir les lignes vers format API
    from models import _book_row_to_api_dict
    books_data = [_book_row_to_api_dict(row) for row in rows]
    
    return jsonify({
        "books": books_data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

@app.route('/bibliotheques/arrondissements', methods=['GET'])
def list_arrondissements():
    arrs = get_arrondissements()
    # Extract arr value; fallback if None
    cleaned = [a[0] for a in arrs if a and a[0]]
    return jsonify(cleaned)

@app.route('/bibliotheques/<int:biblio_id>/genres', methods=['GET'])
def list_genres(biblio_id):
    genres = get_genres_for_bibliotheque(biblio_id)
    return jsonify([g[0] for g in genres if g and g[0]])

@app.route('/books/<int:book_id>/reserve', methods=['POST'])
@auth_required
def reserve(book_id):
    """Crée une pré-réservation (3 jours pour récupérer)"""
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({'message': 'Livre non trouvé'}), 404
    
    # Créer pré-réservation
    success, message = reserve_book(request.current_user['id'], book_id)
    
    if success:
        updated = get_book_by_id(book_id)
        send_activity_log("/books/book-reserved", {
            "user_id": request.current_user['id'],
            "username": request.current_user.get('username', request.current_user.get('name', 'Utilisateur')),
            "title": book['title'],
            "book_id": book_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({
            'message': message, 
            'book': updated,
            'pickup_deadline': None  # Sera ajouté plus tard si nécessaire
        })
    else:
        return jsonify({'message': message}), 400

@app.route('/books/<int:book_id>/reserve', methods=['DELETE'])
@auth_required
def cancel_reservation(book_id):
    """Annule une pré-réservation"""
    reservation = get_reservation_for_book(book_id)
    if not reservation or reservation['user_id'] != request.current_user['id']:
        return jsonify({'message': 'Aucune réservation active trouvée'}), 404
    
    from models import cancel_reservation
    cancelled = cancel_reservation(reservation['id'])
    
    if cancelled:
        send_activity_log("/books/book-reservation-cancelled", {
            "user_id": request.current_user['id'],
            "username": request.current_user['username'],
            "book_id": book_id,
            "ip": request.remote_addr or 'backend'
        })
        
        updated = get_book_by_id(book_id)
        return jsonify({'message': 'Réservation annulée', 'book': updated})
    
    return jsonify({'message': 'Erreur lors de l\'annulation'}), 500

# =============== Endpoints Admin pour validation ===============
@app.route('/admin/reservations/pending', methods=['GET'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def get_pending_pickups_endpoint():
    """Récupère les pré-réservations en attente de validation avec recherche"""
    from models import get_pending_pickups
    
    # Récupérer les paramètres de recherche
    username_search = request.args.get('username', None)
    book_search = request.args.get('book', None)
    
    # Si les paramètres sont vides, les passer comme None
    if username_search and username_search.strip() == '':
        username_search = None
    if book_search and book_search.strip() == '':
        book_search = None
    
    pending = get_pending_pickups(username_search, book_search)
    return jsonify(pending)

@app.route('/admin/reservations/<int:reservation_id>/validate', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def validate_pickup_endpoint(reservation_id):
    """Valide la récupération d'un livre en bibliothèque"""
    from models import validate_pickup, get_reservation_by_id
    
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Réservation non trouvée'}), 404
    
    if reservation['status'] != 'pre_reserved':
        return jsonify({'message': 'Cette réservation ne peut pas être validée'}), 400
    
    # Valider la récupération
    validate_pickup(reservation_id, request.current_user['id'])
    
    send_activity_log("/admin/reservation-validated", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "user_id": reservation['user_id'],
        "book_id": reservation['book_id'],
        "reservation_id": reservation_id,
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': 'Emprunt validé. Le livre est maintenant emprunté pour 1 mois.'})

@app.route('/admin/reservations/<int:reservation_id>/reject', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def reject_pickup_endpoint(reservation_id):
    """Rejette une pré-réservation"""
    from models import reject_pickup, get_reservation_by_id
    
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Réservation non trouvée'}), 404
    
    if reservation['status'] != 'pre_reserved':
        return jsonify({'message': 'Cette réservation ne peut pas être rejetée'}), 400
    
    # Récupérer la raison du rejet (optionnelle)
    data = request.get_json() or {}
    reason = data.get('reason', 'Rejetée par l\'administrateur')
    
    # Rejeter la pré-réservation
    reject_pickup(reservation_id, request.current_user['id'], reason)
    
    send_activity_log("/admin/reservation-rejected", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "user_id": reservation['user_id'],
        "book_id": reservation['book_id'],
        "reservation_id": reservation_id,
        "reason": reason,
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': 'Pré-réservation rejetée.'})

@app.route('/admin/loans/active', methods=['GET'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def get_active_loans_endpoint():
    """Récupère les emprunts actifs avec recherche"""
    from models import get_active_loans
    
    # Récupérer les paramètres de recherche
    username_search = request.args.get('username', None)
    book_search = request.args.get('book', None)
    
    # Si les paramètres sont vides, les passer comme None
    if username_search and username_search.strip() == '':
        username_search = None
    if book_search and book_search.strip() == '':
        book_search = None
    
    active_loans = get_active_loans(username_search, book_search)
    return jsonify(active_loans)

@app.route('/admin/loans/<int:reservation_id>/return', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def return_book_endpoint(reservation_id):
    """Marque un livre comme rendu"""
    from models import return_book_final, get_reservation_by_id
    
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Emprunt non trouvé'}), 404
    
    if reservation['status'] != 'borrowed':
        return jsonify({'message': 'Ce livre n\'est pas actuellement emprunté'}), 400
    
    # Marquer comme rendu
    return_book_final(reservation_id)
    
    send_activity_log("/admin/book-returned", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "user_id": reservation['user_id'],
        "book_id": reservation['book_id'],
        "reservation_id": reservation_id,
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': 'Livre marqué comme rendu avec succès.'})

# =============== Endpoints utilisateur ===============
@app.route('/my-loans', methods=['GET'])
@auth_required
def get_my_loans():
    """Récupère les emprunts de l'utilisateur connecté"""
    from models import get_user_reservations
    loans = get_user_reservations(request.current_user['id'], 'borrowed')
    return jsonify(loans)

@app.route('/my-reservations', methods=['GET'])
@auth_required 
def get_my_reservations():
    """Récupère toutes les réservations de l'utilisateur connecté"""
    from models import get_user_reservations
    reservations = get_user_reservations(request.current_user['id'])
    return jsonify(reservations)

@app.route('/loans/<int:reservation_id>/request-extension', methods=['POST'])
@auth_required
def request_loan_extension(reservation_id):
    """Demande une prolongation d'emprunt"""
    from models import get_reservation_by_id, request_extension
    
    reservation = get_reservation_by_id(reservation_id)
    if not reservation or reservation['user_id'] != request.current_user['id']:
        return jsonify({'message': 'Emprunt non trouvé'}), 404
    
    if reservation['status'] != 'borrowed':
        return jsonify({'message': 'Cet emprunt ne peut pas être prolongé'}), 400
    
    if reservation['extension_requested']:
        return jsonify({'message': 'Prolongation déjà demandée'}), 400
    
    # Vérifier qu'on est dans les 7 derniers jours
    from datetime import datetime, timezone
    return_due = reservation['return_due_date']
    
    # Si c'est déjà un objet datetime, l'utiliser directement
    if isinstance(return_due, datetime):
        # Assurer que c'est en UTC si pas de timezone
        if return_due.tzinfo is None:
            return_due = return_due.replace(tzinfo=timezone.utc)
    else:
        # Si c'est une chaîne, la parser
        return_due = datetime.fromisoformat(str(return_due).replace('Z', '+00:00'))
    
    days_left = (return_due - datetime.now(timezone.utc)).days
    
    if days_left > 7:
        return jsonify({'message': 'Vous ne pouvez demander une prolongation que dans les 7 derniers jours'}), 400
    
    request_extension(reservation_id)
    
    send_activity_log("/loans/extension-requested", {
        "user_id": request.current_user['id'],
        "username": request.current_user['username'], 
        "reservation_id": reservation_id,
        "book_id": reservation['book_id'],
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': 'Demande de prolongation envoyée'})

@app.route('/books/<int:book_id>/borrow', methods=['POST'])
@auth_required
def borrow(book_id):
    """Endpoint conservé pour compatibilité - redirige vers reserve"""
    return reserve(book_id)

@app.route('/books/<int:book_id>/return', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def return_book_by_book_id_endpoint(book_id):
    """Marque un livre comme rendu (admin seulement)"""
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({'message': 'Livre non trouvé'}), 404
    
    # Trouver la réservation active
    reservation = get_reservation_for_book(book_id)
    if not reservation or reservation['status'] != 'borrowed':
        return jsonify({'message': 'Aucun emprunt actif trouvé'}), 400
    
    # Marquer comme rendu
    from models import return_book_final
    returned = return_book_final(reservation['id'])
    
    if returned:
        send_activity_log("/books/book-returned", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "user_id": reservation['user_id'],
            "book_id": book_id,
            "reservation_id": reservation['id'],
            "ip": request.remote_addr or 'backend'
        })
        
        updated = get_book_by_id(book_id)
        return jsonify({'message': 'Livre rendu', 'book': updated})
    
    return jsonify({'message': 'Erreur lors du retour'}), 500

# =============== Cron job pour nettoyage automatique ===============
@app.route('/admin/cleanup-expired', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def cleanup_expired_endpoint():
    """Nettoie les pré-réservations expirées (à appeler périodiquement)"""
    from models import cleanup_expired_prereservations
    count = cleanup_expired_prereservations()
    
    send_activity_log("/admin/cleanup-expired", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "expired_count": count,
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': f'{count} pré-réservations expirées nettoyées'})

# =============== Extension management pour admin ===============
@app.route('/admin/extensions/pending', methods=['GET'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def get_pending_extensions():
    """Récupère les demandes de prolongation en attente"""
    from models import get_user_reservations
    # Récupérer toutes les réservations avec extension demandée
    sql = """
        SELECT r.*, b.titre as book_title, b.auteur as book_author, u.username 
        FROM reservations r 
        JOIN book b ON r.book_id = b.livre_id 
        JOIN users u ON r.user_id = u.id
        WHERE r.status = 'borrowed' AND r.extension_requested = TRUE
        ORDER BY r.return_due_date ASC
    """
    from models import db, text, _row_to_dict
    rows = db.session.execute(text(sql)).fetchall()
    pending_extensions = [_row_to_dict(row) for row in rows]
    
    return jsonify(pending_extensions)

@app.route('/admin/extensions/<int:reservation_id>/grant', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE") 
def grant_extension_endpoint(reservation_id):
    """Accorde une prolongation"""
    data = request.get_json() or {}
    days_extension = data.get('days', 30)  # Par défaut 30 jours
    
    from models import get_reservation_by_id, grant_extension
    
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Réservation non trouvée'}), 404
    
    if not reservation['extension_requested']:
        return jsonify({'message': 'Aucune prolongation demandée'}), 400
    
    # Calculer nouvelle date
    from datetime import datetime, timedelta, timezone
    current_due = reservation['return_due_date']
    
    # Si c'est déjà un objet datetime, l'utiliser directement
    if isinstance(current_due, datetime):
        # Assurer que c'est en UTC si pas de timezone
        if current_due.tzinfo is None:
            current_due = current_due.replace(tzinfo=timezone.utc)
    else:
        # Si c'est une chaîne, la parser
        current_due = datetime.fromisoformat(str(current_due).replace('Z', '+00:00'))
    
    new_due_date = current_due + timedelta(days=days_extension)
    
    grant_extension(reservation_id, request.current_user['id'], new_due_date)
    
    send_activity_log("/admin/extension-granted", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "user_id": reservation['user_id'],
        "reservation_id": reservation_id,
        "days_extension": days_extension,
        "new_due_date": new_due_date.isoformat(),
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': f'Prolongation de {days_extension} jours accordée'})

@app.route('/admin/extensions/<int:reservation_id>/deny', methods=['POST'])
@auth_required
@permission_required("RESERVATION_MANAGE")
def deny_extension_endpoint(reservation_id):
    """Refuse une prolongation"""
    from models import db, text
    
    # Réinitialiser la demande
    db.session.execute(
        text("UPDATE reservations SET extension_requested = FALSE WHERE id = :id"),
        {"id": reservation_id}
    )
    db.session.commit()
    
    send_activity_log("/admin/extension-denied", {
        "admin_id": request.current_user['id'],
        "admin_username": request.current_user['username'],
        "reservation_id": reservation_id,
        "ip": request.remote_addr or 'backend'
    })
    
    return jsonify({'message': 'Demande de prolongation refusée'})

# ==========================
# ROLES & PERMISSIONS MANAGEMENT (Page secrète)
# ==========================

@app.route('/admin/roles', methods=['GET'])
@auth_required
def get_all_roles():
    """Récupérer tous les rôles"""
    try:
        from models import db, text
        rows = db.session.execute(text("SELECT * FROM roles ORDER BY name")).fetchall()
        roles = []
        for row in rows:
            role_dict = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "permissions": get_permissions_for_role(row.id)
            }
            roles.append(role_dict)
        return jsonify({"roles": roles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/roles', methods=['POST'])
@auth_required
def create_role_endpoint():
    """Créer un nouveau rôle"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        
        if not name:
            return jsonify({"error": "Le nom du rôle est requis"}), 400
            
        # Vérifier si le rôle existe déjà
        existing = get_role_by_name(name)
        if existing:
            return jsonify({"error": "Un rôle avec ce nom existe déjà"}), 400
            
        create_role(name, description)
        
        send_activity_log("/admin/role-created", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "role_name": name,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Rôle créé avec succès"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/roles/<int:role_id>', methods=['PUT'])
@auth_required
def update_role_endpoint(role_id):
    """Modifier un rôle"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        
        if not name:
            return jsonify({"error": "Le nom du rôle est requis"}), 400
            
        from models import db, text
        db.session.execute(
            text("UPDATE roles SET name = :name, description = :description WHERE id = :id"),
            {"name": name, "description": description, "id": role_id}
        )
        db.session.commit()
        
        send_activity_log("/admin/role-updated", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "role_id": role_id,
            "role_name": name,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Rôle modifié avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/roles/<int:role_id>', methods=['DELETE'])
@auth_required
def delete_role_endpoint(role_id):
    """Supprimer un rôle"""
    try:
        from models import db, text
        
        # Vérifier que ce n'est pas le rôle admin
        role = db.session.execute(text("SELECT name FROM roles WHERE id = :id"), {"id": role_id}).fetchone()
        if role and role.name == 'admin':
            return jsonify({"error": "Impossible de supprimer le rôle admin"}), 400
            
        # Supprimer les associations
        db.session.execute(text("DELETE FROM role_user WHERE role_id = :id"), {"id": role_id})
        db.session.execute(text("DELETE FROM permission_role WHERE role_id = :id"), {"id": role_id})
        # Supprimer le rôle
        db.session.execute(text("DELETE FROM roles WHERE id = :id"), {"id": role_id})
        db.session.commit()
        
        send_activity_log("/admin/role-deleted", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "role_id": role_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Rôle supprimé avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/permissions', methods=['GET'])
@auth_required
def get_all_permissions():
    """Récupérer toutes les permissions"""
    try:
        from models import db, text
        rows = db.session.execute(text("SELECT * FROM permissions ORDER BY name")).fetchall()
        permissions = [{"id": row.id, "name": row.name, "description": row.description} for row in rows]
        return jsonify({"permissions": permissions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/permissions', methods=['POST'])
@auth_required
def create_permission_endpoint():
    """Créer une nouvelle permission"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        
        if not name:
            return jsonify({"error": "Le nom de la permission est requis"}), 400
            
        # Vérifier si la permission existe déjà
        existing = get_permission_by_name(name)
        if existing:
            return jsonify({"error": "Une permission avec ce nom existe déjà"}), 400
            
        create_permission(name, description)
        
        send_activity_log("/admin/permission-created", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "permission_name": name,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Permission créée avec succès"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/roles/<int:role_id>/permissions', methods=['POST'])
@auth_required
def assign_permission_to_role_endpoint(role_id):
    """Attribuer une permission à un rôle"""
    try:
        data = request.get_json()
        permission_id = data.get('permission_id')
        
        if not permission_id:
            return jsonify({"error": "ID de permission requis"}), 400
            
        # Vérifier si l'association existe déjà
        from models import db, text
        existing = db.session.execute(
            text("SELECT 1 FROM permission_role WHERE role_id = :rid AND permission_id = :pid"),
            {"rid": role_id, "pid": permission_id}
        ).fetchone()
        
        if existing:
            return jsonify({"error": "Cette permission est déjà attribuée à ce rôle"}), 400
            
        assign_permission_to_role(role_id, permission_id)
        
        send_activity_log("/admin/permission-assigned", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "role_id": role_id,
            "permission_id": permission_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Permission attribuée avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/roles/<int:role_id>/permissions/<int:permission_id>', methods=['DELETE'])
@auth_required
def remove_permission_from_role_endpoint(role_id, permission_id):
    """Retirer une permission d'un rôle"""
    try:
        from models import db, text
        db.session.execute(
            text("DELETE FROM permission_role WHERE role_id = :rid AND permission_id = :pid"),
            {"rid": role_id, "pid": permission_id}
        )
        db.session.commit()
        
        send_activity_log("/admin/permission-removed", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "role_id": role_id,
            "permission_id": permission_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Permission retirée avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/users/<int:user_id>/roles', methods=['POST'])
@auth_required
def assign_role_to_user_endpoint(user_id):
    """Attribuer un rôle à un utilisateur"""
    try:
        data = request.get_json()
        role_id = data.get('role_id')
        
        if not role_id:
            return jsonify({"error": "ID de rôle requis"}), 400
            
        # Vérifier si l'association existe déjà
        from models import db, text
        existing = db.session.execute(
            text("SELECT 1 FROM role_user WHERE user_id = :uid AND role_id = :rid"),
            {"uid": user_id, "rid": role_id}
        ).fetchone()
        
        if existing:
            return jsonify({"error": "Ce rôle est déjà attribué à cet utilisateur"}), 400
            
        assign_role_to_user(user_id, role_id)
        
        send_activity_log("/admin/role-assigned-to-user", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "user_id": user_id,
            "role_id": role_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Rôle attribué avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/users/<int:user_id>/roles/<int:role_id>', methods=['DELETE'])
@auth_required
def remove_role_from_user_endpoint(user_id, role_id):
    """Retirer un rôle d'un utilisateur"""
    try:
        from models import db, text
        
        # Vérifier que ce n'est pas le dernier admin
        role = db.session.execute(text("SELECT name FROM roles WHERE id = :id"), {"id": role_id}).fetchone()
        if role and role.name == 'admin':
            admin_count = db.session.execute(
                text("SELECT COUNT(*) as c FROM role_user ru JOIN roles r ON ru.role_id = r.id WHERE r.name = 'admin'")
            ).fetchone().c
            if admin_count <= 1:
                return jsonify({"error": "Impossible de retirer le dernier administrateur"}), 400
        
        db.session.execute(
            text("DELETE FROM role_user WHERE user_id = :uid AND role_id = :rid"),
            {"uid": user_id, "rid": role_id}
        )
        db.session.commit()
        
        send_activity_log("/admin/role-removed-from-user", {
            "admin_id": request.current_user['id'],
            "admin_username": request.current_user['username'],
            "user_id": user_id,
            "role_id": role_id,
            "ip": request.remote_addr or 'backend'
        })
        
        return jsonify({"message": "Rôle retiré avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================
# Seeding
# ==================

def seed_admin():
    """Idempotent admin seeding: ensures admin user, role, and permission mapping exist."""
    admin_email = os.getenv("ADMIN_EMAIL", "admin@bibolib.local")
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    admin_username = os.getenv("ADMIN_USERNAME", "admin")

    existing = get_user_by_email(admin_email) or get_user_by_username(admin_username)

    # Ensure permissions exist
    needed_perms = [
        ('ADMIN_DASHBOARD', 'Accès au tableau de bord administrateur'),
        ('BOOK_MANAGE', 'Gestion des livres'),
        ('LIBRARY_MANAGE', 'Gestion des bibliothèques'),
        ('USER_MANAGE', 'Gestion des utilisateurs')
    ]
    for code, desc in needed_perms:
        if not get_permission_by_name(code):
            create_permission(code, desc)

    # Ensure admin role exists
    admin_role = get_role_by_name('admin')
    if not admin_role:
        create_role('admin', 'Administrateur')
        admin_role = get_role_by_name('admin')

    if not existing:
        user = create_user(admin_username, admin_email, admin_pass, role_name='admin')
        print("[seed] Admin créé:", user['email'])
        existing = user
    else:
        # Ensure user has admin role
        roles = get_roles_for_user(existing['id'])
        if 'admin' not in roles:
            assign_role_to_user(existing['id'], admin_role['id'])
            print("[seed] Rôle admin ajouté à", existing['email'])

    # Ensure role has permission
    role_perms = set(get_permissions_for_role(admin_role['id']))
    for code, _ in needed_perms:
        if code not in role_perms:
            perm = get_permission_by_name(code)
            assign_permission_to_role(admin_role['id'], perm['id'])
            print(f'[seed] Permission {code} associée au rôle admin')

if __name__ == "__main__":
    with app.app_context():
        create_all_tables()
        seed_admin()
    app.run(host='0.0.0.0', port=5000)
