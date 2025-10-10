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
    return_book,
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
        "sub": user_id,
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
            user = get_user_by_id(data["sub"])
            if not user:
                return jsonify({"message": "Utilisateur introuvable"}), 401
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expiré"}), 401
        except Exception:
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
    arrondissement = request.args.get('arrondissement', '').strip()

    base_sql = "SELECT * FROM bibliotheques"
    count_sql = "SELECT COUNT(*) as c FROM bibliotheques"
    params = {}
    if arrondissement:
        base_sql += " WHERE arrondissement = :arr"
        count_sql += " WHERE arrondissement = :arr"
        params['arr'] = arrondissement
    base_sql += " ORDER BY id LIMIT :limit OFFSET :offset"
    params['limit'] = limit
    params['offset'] = offset

    rows = db.session.execute(text(base_sql), params).fetchall()
    total = db.session.execute(text(count_sql), params if arrondissement else {}).fetchone()[0]
    data = rows_to_dicts(rows)
    return jsonify({
        "libraries": data,
        "currentPage": page,
        "totalPages": (total // limit + (1 if total % limit else 0)) or 1,
        "total": total
    })

# Alias admin (même data, chemin différent demandé côté dashboard)
@app.route('/admin/bibliotheques', methods=['GET'])
def admin_alias_bibliotheques():
    return list_bibliotheques()


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

# =============== Reservation / Borrow / Return simplistic logic ===============
@app.route('/books/<int:book_id>/reserve', methods=['POST'])
@auth_required
def reserve(book_id):
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({'message': 'Livre non trouvé'}), 404
    # Check availability (API status 'available')
    if book.get('status') != 'available':
        return jsonify({'message': 'Livre non disponible pour réservation'}), 400
    due_date = datetime.now(timezone.utc) + timedelta(days=3)
    reserve_book(request.current_user['id'], book_id, due_date)
    updated = get_book_by_id(book_id)
    send_activity_log("/books/book-reserved", {
        "user_id": request.current_user['id'],
        "username": request.current_user['username'],
        "title": book['title'],
        "book_id": book_id,
        "ip": request.remote_addr or 'backend'
    })
    return jsonify({'message': 'Livre réservé', 'book': updated})

@app.route('/books/<int:book_id>/borrow', methods=['POST'])
@auth_required
def borrow(book_id):
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({'message': 'Livre non trouvé'}), 404
    # Allow borrow if disponible or already reserved by user
    reservation = get_reservation_for_book(book_id)
    if book.get('status') == 'borrowed':
        return jsonify({'message': 'Déjà emprunté'}), 400
    # If reserved by another user, block (status not available and reservation exists for someone else)
    if book.get('status') != 'available' and reservation and reservation['user_id'] != request.current_user['id']:
        return jsonify({'message': 'Réservé par un autre utilisateur'}), 403
    # Borrow: mark directly via statut mapping
    set_book_status(book_id, 'borrowed')
    updated = get_book_by_id(book_id)
    return jsonify({'message': 'Livre emprunté', 'book': updated})

@app.route('/books/<int:book_id>/return', methods=['POST'])
@auth_required
def return_book_endpoint(book_id):
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({'message': 'Livre non trouvé'}), 404
    if book.get('status') != 'borrowed':
        return jsonify({'message': 'Livre non emprunté'}), 400
    # Simplistic: find reservation row and mark returned now if exists
    res = get_reservation_for_book(book_id)
    if res:
        return_book(res['id'])
    else:
        # Just set status available
        set_book_status(book_id, 'available')
    updated = get_book_by_id(book_id)
    send_activity_log("/books/book-returned", {
        "user_id": request.current_user['id'],
        "username": request.current_user['username'],
        "book_id": book_id,
        "ip": request.remote_addr or 'backend'
    })
    return jsonify({'message': 'Livre retourné', 'book': updated})

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
    app.run(debug=True, host='0.0.0.0', port=5000)
