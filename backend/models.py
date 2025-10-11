from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Utility: convert SQLAlchemy 2.0 Row to plain dict (so calling code can use ["col"]).
def _row_to_dict(row):
    if row is None:
        return None
    # Row exposes _mapping for a dict-like view
    mapping = getattr(row, "_mapping", None)
    if mapping is not None:
        return dict(mapping)
    try:
        return dict(row)
    except Exception:
        return None

# ==========================
# Users
# ==========================
def create_user(username, email, password_plain, role_name="user"):
    """Create a user with hashed password and (optionally) attach a role.

    Returns a dict without the password hash.
    """
    # If user already exists (by email or username) return existing user (idempotent behavior for seeding)
    existing = get_user_by_email(email)
    if existing:
        existing["roles"] = get_roles_for_user(existing["id"])  # enrich
        return existing
    existing_username = get_user_by_username(username)
    if existing_username:
        existing_username["roles"] = get_roles_for_user(existing_username["id"])
        return existing_username

    password_hash = generate_password_hash(password_plain)
    user_params = {
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow()
    }
    db.session.execute(
        text("INSERT INTO users (username, email, password_hash, created_at) VALUES (:username, :email, :password_hash, :created_at)"),
        user_params
    )
    db.session.commit()

    new_user = get_user_by_email(email)

    # Ensure role exists and assign
    if role_name:
        role = get_role_by_name(role_name)
        if not role:
            create_role(role_name)
            role = get_role_by_name(role_name)
        assign_role_to_user(new_user["id"], role["id"])

    return {
        "id": new_user["id"],
        "username": username,
        "email": email,
        "roles": get_roles_for_user(new_user["id"]) or [role_name]
    }

def get_user_by_username(username):
    row = db.session.execute(
        text("SELECT * FROM users WHERE username = :username"),
        {"username": username}
    ).fetchone()
    return _row_to_dict(row)

def get_user_by_id(user_id):
    row = db.session.execute(
        text("SELECT * FROM users WHERE id = :id"),
        {"id": user_id}
    ).fetchone()
    return _row_to_dict(row)

def get_all_users():
    return db.session.execute(text("SELECT * FROM users")).fetchall()

def get_user_by_email(email):
    row = db.session.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": email}
    ).fetchone()
    return _row_to_dict(row)

def delete_user(user_id):
    db.session.execute(
            text("DELETE FROM users WHERE id = :id"),
            {"id": user_id}
        )
    db.session.commit()

def update_user(user_id, username=None, email=None, password_plain=None):
    fields = {}
    params = {"id": user_id}
    if username:
        fields['username'] = username
    if email:
        fields['email'] = email
    if password_plain:
        fields['password_hash'] = generate_password_hash(password_plain)
    if not fields:
        return
    set_clause = ", ".join([f"{k} = :{k}" for k in fields.keys()])
    params.update(fields)
    db.session.execute(text(f"UPDATE users SET {set_clause} WHERE id = :id"), params)
    db.session.commit()

def remove_roles_for_user(user_id):
    db.session.execute(text("DELETE FROM role_user WHERE user_id = :uid"), {"uid": user_id})
    db.session.commit()

# ==========================
# Roles & Permissions
# ==========================
def create_role(name, description=None):
    db.session.execute(
            text("INSERT INTO roles (name, description) VALUES (:name, :description)"),
            {"name": name, "description": description}
        )
    db.session.commit()

def assign_role_to_user(user_id, role_id):
    db.session.execute(
            text("INSERT INTO role_user (user_id, role_id) VALUES (:user_id, :role_id)"),
            {"user_id": user_id, "role_id": role_id}
        )
    db.session.commit()

def get_role_by_name(name):
    row = db.session.execute(
        text("SELECT * FROM roles WHERE name = :name"),
        {"name": name}
    ).fetchone()
    return _row_to_dict(row)

def get_roles_for_user(user_id):
    rows = db.session.execute(
        text("SELECT r.name FROM roles r JOIN role_user ru ON r.id = ru.role_id WHERE ru.user_id = :uid"),
        {"uid": user_id}
    ).fetchall()
    # Each row is a SQLAlchemy Row; since we selected only r.name, position 0 holds the value
    return [r[0] for r in rows]

def create_permission(name, description=None):
    db.session.execute(
        text("INSERT INTO permissions (name, description) VALUES (:name, :description)"),
        {"name": name, "description": description}
    )
    db.session.commit()

def assign_permission_to_role(role_id, permission_id):
    db.session.execute(
        text("INSERT INTO permission_role (role_id, permission_id) VALUES (:role_id, :permission_id)"),
        {"role_id": role_id, "permission_id": permission_id}
    )
    db.session.commit()

# ==========================
# Permissions lookup helpers
# ==========================
def get_permission_by_name(name):
    row = db.session.execute(
        text("SELECT * FROM permissions WHERE name = :name"),
        {"name": name}
    ).fetchone()
    return _row_to_dict(row)

def get_permissions_for_role(role_id):
    rows = db.session.execute(
        text("""SELECT p.name FROM permissions p\n                JOIN permission_role pr ON p.id = pr.permission_id\n                WHERE pr.role_id = :rid"""),
        {"rid": role_id}
    ).fetchall()
    return [r[0] for r in rows]

def get_permissions_for_user(user_id):
    rows = db.session.execute(
        text("""SELECT DISTINCT p.name FROM permissions p\n                JOIN permission_role pr ON p.id = pr.permission_id\n                JOIN role_user ru ON ru.role_id = pr.role_id\n                WHERE ru.user_id = :uid"""),
        {"uid": user_id}
    ).fetchall()
    return [r[0] for r in rows]

def user_has_permission(user_id, permission_name):
    row = db.session.execute(
        text("""SELECT 1 FROM permissions p\n                JOIN permission_role pr ON p.id = pr.permission_id\n                JOIN role_user ru ON ru.role_id = pr.role_id\n                WHERE ru.user_id = :uid AND p.name = :pname LIMIT 1"""),
        {"uid": user_id, "pname": permission_name}
    ).fetchone()
    return row is not None

# ==========================
# Bibliothèques
# ==========================
def create_bibliotheque(name, adresse, telephone=None, email=None, arrondissement=None):
    db.session.execute(
        text("INSERT INTO bibliotheques (name, adresse, telephone, email, arrondissement) VALUES (:name, :adresse, :telephone, :email, :arrondissement)"),
        {"name": name, "adresse": adresse, "telephone": telephone, "email": email, "arrondissement": arrondissement}
    )
    db.session.commit()

def get_bibliotheque_by_id(biblio_id):
    row = db.session.execute(
        text("SELECT * FROM bibliotheques WHERE id = :id"),
        {"id": biblio_id}
    ).fetchone()
    return _row_to_dict(row)

def get_all_bibliotheques():
    return db.session.execute(text("SELECT * FROM bibliotheques")).fetchall()

def update_bibliotheque(biblio_id, **fields):
    if not fields:
        return
    allowed = {"name", "adresse", "telephone", "email", "arrondissement"}
    set_parts = []
    params = {"id": biblio_id}
    for k, v in fields.items():
        if k in allowed:
            set_parts.append(f"{k} = :{k}")
            params[k] = v
    if not set_parts:
        return
    sql = f"UPDATE bibliotheques SET {', '.join(set_parts)} WHERE id = :id"
    db.session.execute(text(sql), params)
    db.session.commit()

def delete_bibliotheque(biblio_id):
    db.session.execute(text("DELETE FROM bibliotheques WHERE id = :id"), {"id": biblio_id})
    db.session.commit()

# ==========================
# Livres (table `book`)
# ==========================

# Helper: conversion des données book (DB fr) vers format API (en)
def _book_row_to_api_dict(row):
    """Convertit une ligne de la table book vers le format attendu par l'API frontend"""
    if not row:
        return None
    r = _row_to_dict(row)
    if not r:
        return None
    return {
        "id": r.get("livre_id"),
        "title": r.get("titre"),
        "author": r.get("auteur"),
        "publisher": r.get("editeur"),
        "description": r.get("resume"),
        "genre": r.get("categorie"),
        "year": r.get("annee"),
        "isbn": r.get("isbn"),
        "language": r.get("langue"),
        "status": _db_statut_to_api_status(r.get("statut")),
        "bibliotheque_id": r.get("bibliotheque_id"),
        "pages": r.get("pages"),
        "coverImage": r.get("image_url")
    }

# Helper: conversion statut DB (fr) vers status API (en)
def _db_statut_to_api_status(statut):
    """Convertit le statut français de la DB vers le status anglais de l'API"""
    if not statut:
        return 'available'
    s = statut.lower().strip()
    if s == 'disponible':
        return 'available'
    elif s == 'réservé':
        return 'reserved'
    elif s == 'emprunté':
        return 'borrowed'
    return 'available'

# Helper: conversion status API (en) vers statut DB (fr)
def _api_status_to_db_statut(status):
    """Convertit le status anglais de l'API vers le statut français de la DB"""
    if not status:
        return 'Disponible'
    s = status.lower().strip()
    if s == 'available':
        return 'Disponible'
    elif s == 'reserved':
        return 'Réservé'
    elif s == 'borrowed':
        return 'Emprunté'
    return 'Disponible'

def create_book(**kwargs):
    """Crée un livre avec les paramètres fournis (format API ou DB)"""
    # Mapping des clés API vers DB
    api_to_db = {
        'title': 'titre',
        'author': 'auteur',
        'publisher': 'editeur',
        'description': 'resume',
        'genre': 'categorie',
        'year': 'annee',
        'isbn': 'isbn',
        'language': 'langue',
        'status': 'statut',
        'bibliotheque_id': 'bibliotheque_id',
        'pages': 'pages',
        'coverImage': 'image_url'
    }
    
    # Préparer les paramètres pour la DB
    db_params = {}
    for api_key, db_key in api_to_db.items():
        if api_key in kwargs and kwargs[api_key] is not None:
            if api_key == 'status':
                db_params[db_key] = _api_status_to_db_statut(kwargs[api_key])
            else:
                db_params[db_key] = kwargs[api_key]
        elif db_key in kwargs and kwargs[db_key] is not None:
            db_params[db_key] = kwargs[db_key]
    
    # Construire la requête dynamiquement
    if db_params:
        columns = list(db_params.keys())
        placeholders = [f":{col}" for col in columns]
        sql = f"INSERT INTO book ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
        db.session.execute(text(sql), db_params)
    else:
        # Insertion minimale
        db.session.execute(text("INSERT INTO book () VALUES ()"))
    
    db.session.commit()
    
    # Retourner le dernier livre inséré
    row = db.session.execute(text("SELECT * FROM book ORDER BY livre_id DESC LIMIT 1")).fetchone()
    return _book_row_to_api_dict(row)

def update_book(book_id, **fields):
    """Met à jour un livre"""
    if not fields:
        return
    
    # Mapping des clés API vers DB
    api_to_db = {
        'title': 'titre',
        'author': 'auteur',
        'publisher': 'editeur',
        'description': 'resume',
        'genre': 'categorie',
        'year': 'annee',
        'isbn': 'isbn',
        'language': 'langue',
        'status': 'statut',
        'bibliotheque_id': 'bibliotheque_id',
        'pages': 'pages',
        'coverImage': 'image_url'
    }
    
    db_updates = {}
    for api_key, db_key in api_to_db.items():
        if api_key in fields and fields[api_key] is not None:
            if api_key == 'status':
                db_updates[db_key] = _api_status_to_db_statut(fields[api_key])
            else:
                db_updates[db_key] = fields[api_key]
        elif db_key in fields and fields[db_key] is not None:
            db_updates[db_key] = fields[db_key]
    
    if not db_updates:
        return
        
    set_parts = [f"{k} = :{k}" for k in db_updates.keys()]
    db_updates["id"] = book_id
    sql = f"UPDATE book SET {', '.join(set_parts)} WHERE livre_id = :id"
    db.session.execute(text(sql), db_updates)
    db.session.commit()

def delete_book(book_id):
    """Supprime un livre"""
    db.session.execute(text("DELETE FROM book WHERE livre_id = :id"), {"id": book_id})
    db.session.commit()

def get_book_by_id(book_id):
    """Récupère un livre par son ID avec le statut de réservation"""
    # Récupérer les données du livre
    row = db.session.execute(
        text("SELECT * FROM book WHERE livre_id = :id"),
        {"id": book_id}
    ).fetchone()
    
    if not row:
        return None
    
    book_dict = _book_row_to_api_dict(row)
    
    # Vérifier s'il y a une réservation active pour ce livre
    reservation_row = db.session.execute(
        text("""SELECT status, user_id, reserved_at, due_date, id
                FROM reservations 
                WHERE book_id = :book_id 
                AND status IN ('pre_reserved', 'borrowed') 
                ORDER BY reserved_at DESC 
                LIMIT 1"""),
        {"book_id": book_id}
    ).fetchone()
    
    if reservation_row:
        reservation_status = reservation_row[0]  # status
        reserved_by_user_id = reservation_row[1]  # user_id
        reservation_id = reservation_row[4]  # id
        
        if reservation_status == 'pre_reserved':
            book_dict['status'] = 'pre_reserved'
        elif reservation_status == 'borrowed':
            book_dict['status'] = 'borrowed'
            
        # Ajouter les informations de réservation
        book_dict['reserved_by_user_id'] = reserved_by_user_id
        book_dict['reservation_id'] = reservation_id
    
    return book_dict

def get_all_books():
    """Récupère tous les livres"""
    rows = db.session.execute(text("SELECT * FROM book")).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def get_recent_books(limit=8):
    """Récupère les livres récents (basé sur l'année de publication)"""
    rows = db.session.execute(
        text("SELECT * FROM book WHERE annee IS NOT NULL ORDER BY annee DESC LIMIT :limit"),
        {"limit": limit}
    ).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def get_random_books(limit=8):
    """Récupère des livres aléatoirement (pour simuler les mieux notés en attendant le système de rating)"""
    rows = db.session.execute(
        text("SELECT * FROM book ORDER BY RAND() LIMIT :limit"),
        {"limit": limit}
    ).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

# TODO: Fonction future pour les livres les mieux notés
# def get_top_rated_books(limit=8):
#     """Récupère les livres les mieux notés (à implémenter quand le système de rating sera prêt)"""
#     rows = db.session.execute(
#         text("SELECT * FROM book WHERE rating IS NOT NULL ORDER BY rating DESC LIMIT :limit"),
#         {"limit": limit}
#     ).fetchall()
#     return [_book_row_to_api_dict(row) for row in rows]

def get_books_by_bibliotheque(biblio_id):
    """Récupère tous les livres d'une bibliothèque"""
    rows = db.session.execute(
        text("SELECT * FROM book WHERE bibliotheque_id = :biblio_id"),
        {"biblio_id": biblio_id}
    ).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def get_book_by_bibliotheque_and_id(biblio_id, book_id):
    """Récupère un livre spécifique d'une bibliothèque"""
    row = db.session.execute(
        text("SELECT * FROM book WHERE bibliotheque_id = :biblio_id AND livre_id = :book_id"),
        {"biblio_id": biblio_id, "book_id": book_id}
    ).fetchone()
    return _book_row_to_api_dict(row)

def get_book_by_bibliotheque_and_title(biblio_id, title):
    """Récupère un livre par titre dans une bibliothèque"""
    row = db.session.execute(
        text("SELECT * FROM book WHERE bibliotheque_id = :biblio_id AND titre = :title"),
        {"biblio_id": biblio_id, "title": title}
    ).fetchone()
    return _book_row_to_api_dict(row)

def search_books(term):
    """Recherche globale de livres"""
    like = f"%{term}%"
    rows = db.session.execute(
        text("SELECT * FROM book WHERE titre LIKE :q OR auteur LIKE :q"),
        {"q": like}
    ).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def search_books_by_library(biblio_id, term):
    """Recherche de livres dans une bibliothèque spécifique"""
    like = f"%{term}%"
    rows = db.session.execute(
        text("SELECT * FROM book WHERE bibliotheque_id = :bid AND (titre LIKE :q OR auteur LIKE :q)"),
        {"bid": biblio_id, "q": like}
    ).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def get_books_by_bibliotheque_filtered(biblio_id, genre=None, availability=None, page=None, limit=None):
    """Récupère les livres d'une bibliothèque avec filtres"""
    where_clauses = ["bibliotheque_id = :bid"]
    params = {"bid": biblio_id}
    
    if genre:
        where_clauses.append("categorie = :genre")
        params["genre"] = genre
        
    if availability:
        statut_db = _api_status_to_db_statut(availability)
        where_clauses.append("statut = :statut")
        params["statut"] = statut_db
    
    where_sql = " AND ".join(where_clauses)
    sql = f"SELECT * FROM book WHERE {where_sql} ORDER BY titre"
    
    if page and limit:
        try:
            p = int(page)
            l = int(limit)
            if p > 0 and l > 0:
                sql += " LIMIT :limit OFFSET :offset"
                params["limit"] = l
                params["offset"] = (p - 1) * l
        except Exception:
            pass
    
    rows = db.session.execute(text(sql), params).fetchall()
    return [_book_row_to_api_dict(row) for row in rows]

def get_arrondissements():
    # Retourne la vraie colonne arrondissement (distinct, tri numérique si possible)
    return db.session.execute(
        text("SELECT DISTINCT arrondissement FROM bibliotheques WHERE arrondissement IS NOT NULL AND arrondissement <> '' ORDER BY CAST(arrondissement AS UNSIGNED)")
    ).fetchall()

def get_genres_for_bibliotheque(biblio_id):
    """Récupère les genres disponibles dans une bibliothèque"""
    return db.session.execute(
        text("SELECT DISTINCT categorie FROM book WHERE bibliotheque_id = :bid AND categorie IS NOT NULL AND categorie <> ''"),
        {"bid": biblio_id}
    ).fetchall()

def get_reservation_for_book(book_id):
    """Récupère la réservation active d'un livre"""
    row = db.session.execute(
        text("SELECT * FROM reservations WHERE book_id = :bid AND status IN ('pre_reserved', 'borrowed') ORDER BY reserved_at DESC LIMIT 1"),
        {"bid": book_id}
    ).fetchone()
    return _row_to_dict(row)

def get_reservation_by_id(reservation_id):
    """Récupère une réservation par son ID"""
    row = db.session.execute(
        text("SELECT * FROM reservations WHERE id = :id"),
        {"id": reservation_id}
    ).fetchone()
    return _row_to_dict(row)

def get_user_reservations(user_id, status=None):
    """Récupère toutes les réservations d'un utilisateur avec les infos de bibliothèque"""
    if status:
        sql = """SELECT r.*, b.titre as book_title, b.auteur as book_author, 
                        bib.name as library_name, bib.adresse as library_address, bib.arrondissement as library_arrondissement
                 FROM reservations r 
                 JOIN book b ON r.book_id = b.livre_id 
                 LEFT JOIN bibliotheques bib ON b.bibliotheque_id = bib.id
                 WHERE r.user_id = :uid AND r.status = :status 
                 ORDER BY r.reserved_at DESC"""
        params = {"uid": user_id, "status": status}
    else:
        sql = """SELECT r.*, b.titre as book_title, b.auteur as book_author,
                        bib.name as library_name, bib.adresse as library_address, bib.arrondissement as library_arrondissement
                 FROM reservations r 
                 JOIN book b ON r.book_id = b.livre_id 
                 LEFT JOIN bibliotheques bib ON b.bibliotheque_id = bib.id
                 WHERE r.user_id = :uid 
                 ORDER BY r.reserved_at DESC"""
        params = {"uid": user_id}
    
    rows = db.session.execute(text(sql), params).fetchall()
    return [_row_to_dict(row) for row in rows]

def get_pending_pickups(username_search=None, book_search=None):
    """Récupère toutes les pré-réservations en attente de validation admin avec recherche optionnelle"""
    base_sql = """
        SELECT r.*, b.titre as book_title, b.auteur as book_author, u.username, u.email as user_email,
               bib.name as library_name, bib.adresse as library_address
        FROM reservations r 
        JOIN book b ON r.book_id = b.livre_id 
        JOIN users u ON r.user_id = u.id
        LEFT JOIN bibliotheques bib ON b.bibliotheque_id = bib.id
        WHERE r.status = 'pre_reserved' AND r.due_date > NOW()
    """
    
    params = {}
    
    # Ajouter filtres de recherche
    if username_search:
        base_sql += " AND u.username LIKE :username_search"
        params['username_search'] = f"%{username_search}%"
    
    if book_search:
        base_sql += " AND (b.titre LIKE :book_search OR b.auteur LIKE :book_search)"
        params['book_search'] = f"%{book_search}%"
    
    base_sql += " ORDER BY r.due_date ASC"
    
    rows = db.session.execute(text(base_sql), params).fetchall()
    return [_row_to_dict(row) for row in rows]

def get_active_loans(username_search=None, book_search=None):
    """Récupère tous les emprunts actifs avec recherche optionnelle"""
    base_sql = """
        SELECT r.*, b.titre as book_title, b.auteur as book_author, u.username, u.email as user_email,
               bib.name as library_name, bib.adresse as library_address
        FROM reservations r 
        JOIN book b ON r.book_id = b.livre_id 
        JOIN users u ON r.user_id = u.id
        LEFT JOIN bibliotheques bib ON b.bibliotheque_id = bib.id
        WHERE r.status = 'borrowed'
    """
    
    params = {}
    
    # Ajouter filtres de recherche
    if username_search:
        base_sql += " AND u.username LIKE :username_search"
        params['username_search'] = f"%{username_search}%"
    
    if book_search:
        base_sql += " AND (b.titre LIKE :book_search OR b.auteur LIKE :book_search)"
        params['book_search'] = f"%{book_search}%"
    
    base_sql += " ORDER BY r.return_due_date ASC"
    
    rows = db.session.execute(text(base_sql), params).fetchall()
    return [_row_to_dict(row) for row in rows]


# ==========================
# Reservations - Nouvelles fonctions
# ==========================
def reserve_book(user_id, book_id):
    """Crée une pré-réservation"""
    try:
        # Vérifier que le livre existe et est disponible
        book = db.session.execute(
            text("SELECT * FROM book WHERE livre_id = :id"),
            {"id": book_id}
        ).fetchone()
        
        if not book:
            return False, "Livre non trouvé"
        
        if book.statut != 'Disponible':
            return False, "Livre non disponible pour réservation"
        
        # Vérifier que l'utilisateur n'a pas déjà une réservation pour ce livre
        existing = db.session.execute(
            text("SELECT * FROM reservations WHERE user_id = :user_id AND book_id = :book_id AND status IN ('pre_reserved', 'borrowed')"),
            {"user_id": user_id, "book_id": book_id}
        ).fetchone()
        
        if existing:
            return False, "Vous avez déjà une réservation active pour ce livre"
        
        # Créer la pré-réservation (expire dans 3 jours)
        due_date = datetime.utcnow() + timedelta(days=3)
        
        db.session.execute(
            text("""
                INSERT INTO reservations (user_id, book_id, reserved_at, due_date, status) 
                VALUES (:user_id, :book_id, :reserved_at, :due_date, 'pre_reserved')
            """),
            {
                "user_id": user_id, 
                "book_id": book_id, 
                "reserved_at": datetime.utcnow(), 
                "due_date": due_date
            }
        )
        
        # Met à jour le statut du livre
        db.session.execute(
            text("UPDATE book SET statut = 'Pré-réservé' WHERE livre_id = :id"),
            {"id": book_id}
        )
        
        db.session.commit()
        return True, "Livre pré-réservé avec succès"
        
    except Exception as e:
        db.session.rollback()
        return False, f"Erreur lors de la réservation: {str(e)}"

def validate_pickup(reservation_id, admin_id):
    """Valide la récupération d'un livre par l'admin"""
    from datetime import timedelta
    
    pickup_date = datetime.utcnow()
    return_due_date = pickup_date + timedelta(days=30)  # 1 mois
    
    db.session.execute(
        text("""
            UPDATE reservations 
            SET status = 'borrowed', 
                picked_up_at = :pickup_date, 
                return_due_date = :return_due_date,
                validated_by_admin_id = :admin_id
            WHERE id = :reservation_id AND status = 'pre_reserved'
        """),
        {
            "reservation_id": reservation_id,
            "pickup_date": pickup_date,
            "return_due_date": return_due_date,
            "admin_id": admin_id
        }
    )
    
    # Récupérer le book_id pour mettre à jour le statut
    reservation = get_reservation_by_id(reservation_id)
    if reservation:
        db.session.execute(
            text("UPDATE book SET statut = 'Emprunté' WHERE livre_id = :id"),
            {"id": reservation['book_id']}
        )
    
    db.session.commit()
    return reservation

def cancel_reservation(reservation_id):
    """Annule une réservation (par l'utilisateur)"""
    # Récupérer les infos avant suppression
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return None
    
    # Marquer comme cancelled (annulée par l'utilisateur)
    db.session.execute(
        text("UPDATE reservations SET status = 'cancelled', returned_at = NOW() WHERE id = :id"),
        {"id": reservation_id}
    )
    
    # Libérer le livre
    db.session.execute(
        text("UPDATE book SET statut = 'Disponible' WHERE livre_id = :id"),
        {"id": reservation['book_id']}
    )
    
    db.session.commit()
    return reservation

def expire_reservation(reservation_id):
    """Marque une réservation comme expirée (automatiquement)"""
    # Récupérer les infos avant suppression
    reservation = get_reservation_by_id(reservation_id)
    if not reservation:
        return None
    
    # Marquer comme expired (expirée automatiquement)
    db.session.execute(
        text("UPDATE reservations SET status = 'expired', returned_at = NOW() WHERE id = :id"),
        {"id": reservation_id}
    )
    
    # Libérer le livre
    db.session.execute(
        text("UPDATE book SET statut = 'Disponible' WHERE livre_id = :id"),
        {"id": reservation['book_id']}
    )
    
    db.session.commit()
    return reservation

def validate_pickup(reservation_id, admin_user_id):
    """Valide une pré-réservation (passage de pre_reserved à borrowed)"""
    try:
        # Vérifier que la réservation existe et est en statut pre_reserved
        reservation = get_reservation_by_id(reservation_id)
        if not reservation or reservation['status'] != 'pre_reserved':
            return None
        
        # Calculer la date de retour (1 mois après)
        pickup_date = datetime.utcnow()
        return_due_date = pickup_date + timedelta(days=30)
        
        # Mettre à jour la réservation
        db.session.execute(
            text("""
                UPDATE reservations 
                SET status = 'borrowed', 
                    picked_up_at = :picked_up_at,
                    return_due_date = :return_due_date,
                    validated_by_admin_id = :admin_id
                WHERE id = :id
            """),
            {
                "id": reservation_id,
                "picked_up_at": pickup_date,
                "return_due_date": return_due_date,
                "admin_id": admin_user_id
            }
        )
        
        # Mettre à jour le statut du livre
        db.session.execute(
            text("UPDATE book SET statut = 'Emprunté' WHERE livre_id = :book_id"),
            {"book_id": reservation['book_id']}
        )
        
        db.session.commit()
        return get_reservation_by_id(reservation_id)
        
    except Exception as e:
        db.session.rollback()
        raise e

def reject_pickup(reservation_id, admin_user_id, reason=None):
    """Rejette une pré-réservation"""
    try:
        # Vérifier que la réservation existe et est en statut pre_reserved
        reservation = get_reservation_by_id(reservation_id)
        if not reservation or reservation['status'] != 'pre_reserved':
            return None
        
        # Annuler la réservation
        db.session.execute(
            text("""
                UPDATE reservations 
                SET status = 'cancelled',
                    cancelled_at = :cancelled_at,
                    validated_by_admin_id = :admin_id,
                    cancellation_reason = :reason
                WHERE id = :id
            """),
            {
                "id": reservation_id,
                "cancelled_at": datetime.utcnow(),
                "admin_id": admin_user_id,
                "reason": reason or "Rejetée par l'administrateur"
            }
        )
        
        # Remettre le livre disponible
        db.session.execute(
            text("UPDATE book SET statut = 'Disponible' WHERE livre_id = :book_id"),
            {"book_id": reservation['book_id']}
        )
        
        db.session.commit()
        return get_reservation_by_id(reservation_id)
        
    except Exception as e:
        db.session.rollback()
        raise e

def return_book_final(reservation_id):
    """Marque un livre comme rendu"""
    db.session.execute(
        text("""
            UPDATE reservations 
            SET status = 'returned', returned_at = :returned_at 
            WHERE id = :id AND status = 'borrowed'
        """),
        {"id": reservation_id, "returned_at": datetime.utcnow()}
    )
    
    # Récupérer le book_id pour libérer le livre
    reservation = get_reservation_by_id(reservation_id)
    if reservation:
        db.session.execute(
            text("UPDATE book SET statut = 'Disponible' WHERE livre_id = :id"),
            {"id": reservation['book_id']}
        )
    
    db.session.commit()
    return reservation

def request_extension(reservation_id):
    """Demande une prolongation pour un emprunt"""
    db.session.execute(
        text("UPDATE reservations SET extension_requested = TRUE WHERE id = :id AND status = 'borrowed'"),
        {"id": reservation_id}
    )
    db.session.commit()

def grant_extension(reservation_id, admin_id, new_due_date):
    """Accorde une prolongation"""
    db.session.execute(
        text("""
            UPDATE reservations 
            SET extension_granted_until = :new_due_date,
                extension_requested = FALSE,
                return_due_date = :new_due_date
            WHERE id = :id AND status = 'borrowed'
        """),
        {"id": reservation_id, "new_due_date": new_due_date}
    )
    db.session.commit()

def cleanup_expired_prereservations():
    """Nettoie les pré-réservations expirées automatiquement"""
    # Marquer comme expirées
    expired_reservations = db.session.execute(
        text("""
            SELECT id, book_id FROM reservations 
            WHERE status = 'pre_reserved' AND due_date < NOW()
        """)
    ).fetchall()
    
    count = 0
    for reservation in expired_reservations:
        expire_reservation(reservation['id'])
        count += 1
    
    return count

def set_book_status(book_id, status):
    """Met à jour le statut d'un livre (utilise le format API)"""
    statut_db = _api_status_to_db_statut(status)
    db.session.execute(
        text("UPDATE book SET statut = :statut WHERE livre_id = :id"),
        {"statut": statut_db, "id": book_id}
    )
    db.session.commit()

def create_all_tables():
    conn = db.session
    
    # ==========================
    # Users
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(191) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """))

    # ==========================
    # Roles & Permissions
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
    )
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
    )
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS role_user (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY(user_id, role_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
    )
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS permission_role (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY(role_id, permission_id),
        FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    )
    """))

    # ==========================
    # Bibliothèques
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS bibliotheques (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        adresse VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        email VARCHAR(255),
        arrondissement VARCHAR(10)
    )
    """))

    # ==========================
    # Livres (table book)
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS book (
        livre_id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255),
        titre TEXT,
        auteur VARCHAR(255),
        editeur VARCHAR(255),
        resume TEXT,
        categorie VARCHAR(255),
        annee TEXT,
        isbn VARCHAR(50),
        langue VARCHAR(50),
        statut VARCHAR(50) DEFAULT 'Disponible',
        bibliotheque_id INT,
        pages INT DEFAULT NULL,
        CONSTRAINT fk_book_bibliotheque FOREIGN KEY (bibliotheque_id) REFERENCES bibliotheques(id) ON DELETE SET NULL
    )
    """))

    # ==========================
    # Reservations (mise à jour FK vers book)
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        reserved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        due_date DATETIME NOT NULL,
        returned_at DATETIME,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(book_id) REFERENCES book(livre_id) ON DELETE CASCADE
    )
    """))
    
    # ==========================
    # Migration: copier books existants vers book (une seule fois)
    # ==========================
    try:
        # Vérifier si l'ancienne table books existe et si book est vide
        books_exists = conn.execute(
            text("SELECT COUNT(*) as c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'books'")
        ).fetchone()["c"] > 0
        
        book_count = conn.execute(text("SELECT COUNT(*) as c FROM book")).fetchone()["c"]
        
        if books_exists and book_count == 0:
            # Migration des données
            conn.execute(text("""
                INSERT INTO book (titre, auteur, statut, bibliotheque_id)
                SELECT 
                    title as titre,
                    author as auteur,
                    CASE status 
                        WHEN 'disponible' THEN 'Disponible'
                        WHEN 'emprunte' THEN 'Emprunté'
                        ELSE 'Disponible'
                    END as statut,
                    bibliotheque_id
                FROM books
            """))
            print("[Migration] Données copiées de books vers book")
    except Exception as e:
        # Migration best-effort, ignore les erreurs
        print(f"[Migration] Erreur ignorée: {e}")

    conn.commit()

###############################
# Utility auth helpers (no DB DDL changes)
###############################
def verify_password(stored_hash, candidate_password):
    return check_password_hash(stored_hash, candidate_password)
