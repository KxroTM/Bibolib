from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
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
# Livres
# ==========================
def create_book(title, author, bibliotheque_id, published_at=None, status='disponible', cover_image=None, download_link=None, description=None, summary=None, genre=None, isbn=None, pages=None, language=None, publisher=None):
    db.session.execute(
        text("""
            INSERT INTO books (title, author, bibliotheque_id, published_at, status, cover_image, download_link, description, summary, genre, isbn, pages, language, publisher)
            VALUES (:title, :author, :bibliotheque_id, :published_at, :status, :cover_image, :download_link, :description, :summary, :genre, :isbn, :pages, :language, :publisher)
        """),
        {"title": title, "author": author, "bibliotheque_id": bibliotheque_id, "published_at": published_at, "status": status or 'disponible',
         "cover_image": cover_image, "download_link": download_link, "description": description, "summary": summary, "genre": genre,
         "isbn": isbn, "pages": pages, "language": language, "publisher": publisher}
    )
    db.session.commit()
    # Retourner le dernier livre inséré (simpliste)
    row = db.session.execute(text("SELECT * FROM books ORDER BY id DESC LIMIT 1")).fetchone()
    return _row_to_dict(row)

def update_book(book_id, **fields):
    if not fields:
        return
    allowed = {"title", "author", "published_at", "status", "bibliotheque_id"}
    set_parts = []
    params = {"id": book_id}
    for k, v in fields.items():
        if k in allowed:
            set_parts.append(f"{k} = :{k}")
            params[k] = v
    if not set_parts:
        return
    sql = f"UPDATE books SET {', '.join(set_parts)} WHERE id = :id"
    db.session.execute(text(sql), params)
    db.session.commit()

def delete_book(book_id):
    db.session.execute(
            text("DELETE FROM books WHERE id = :id"),
            {"id": book_id}
        )
    db.session.commit()

def get_book_by_id(book_id):
    row = db.session.execute(
        text("SELECT * FROM books WHERE id = :id"),
        {"id": book_id}
    ).fetchone()
    return _row_to_dict(row)

def get_all_books():
    return db.session.execute(text("SELECT * FROM books")).fetchall()

def get_books_by_bibliotheque(biblio_id):
    return db.session.execute(
            text("SELECT * FROM books WHERE bibliotheque_id = :biblio_id"),
            {"biblio_id": biblio_id}
        ).fetchall()

def get_book_by_bibliotheque_and_id(biblio_id, book_id):
    row = db.session.execute(
        text("SELECT * FROM books WHERE bibliotheque_id = :biblio_id AND id = :book_id"),
        {"biblio_id": biblio_id, "book_id": book_id}
    ).fetchone()
    return _row_to_dict(row)

def get_book_by_bibliotheque_and_title(biblio_id, title):
    row = db.session.execute(
        text("SELECT * FROM books WHERE bibliotheque_id = :biblio_id AND title = :title"),
        {"biblio_id": biblio_id, "title": title}
    ).fetchone()
    return _row_to_dict(row)

def search_books(term):
    like = f"%{term}%"
    return db.session.execute(
            text("SELECT * FROM books WHERE title LIKE :q OR author LIKE :q"),
            {"q": like}
        ).fetchall()

def get_arrondissements():
    # Retourne la vraie colonne arrondissement (distinct, tri numérique si possible)
    return db.session.execute(
        text("SELECT DISTINCT arrondissement FROM bibliotheques WHERE arrondissement IS NOT NULL AND arrondissement <> '' ORDER BY CAST(arrondissement AS UNSIGNED)")
    ).fetchall()

def get_genres_for_bibliotheque(biblio_id):
    # Assuming a 'genre' column could exist in future; placeholder returns unique authors as pseudo-genres
    return db.session.execute(
            text("SELECT DISTINCT author as genre FROM books WHERE bibliotheque_id = :bid"),
            {"bid": biblio_id}
        ).fetchall()

def get_reservation_for_book(book_id):
    row = db.session.execute(
        text("SELECT * FROM reservations WHERE book_id = :bid AND returned_at IS NULL ORDER BY reserved_at DESC LIMIT 1"),
        {"bid": book_id}
    ).fetchone()
    return _row_to_dict(row)


# ==========================
# Reservations
# ==========================
def reserve_book(user_id, book_id, due_date):
    db.session.execute(
        text("INSERT INTO reservations (user_id, book_id, reserved_at, due_date) VALUES (:user_id, :book_id, :reserved_at, :due_date)"),
        {"user_id": user_id, "book_id": book_id, "reserved_at": datetime.utcnow(), "due_date": due_date}
    )
    db.session.execute(
        text("UPDATE books SET status = 'emprunte' WHERE id = :id"),
        {"id": book_id}
    )
    db.session.commit()

def return_book(reservation_id):
    db.session.execute(
            text("UPDATE reservations SET returned_at = :returned_at WHERE id = :id"),
            {"returned_at": datetime.utcnow(), "id": reservation_id}
        )
    # Update book status
    book_id = db.session.execute(
        text("SELECT book_id FROM reservations WHERE id = :id"),
        {"id": reservation_id}
    ).fetchone()["book_id"]
    db.session.execute(
        text("UPDATE books SET status = 'disponible' WHERE id = :id"),
        {"id": book_id}
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
    # Livres
    # ==========================
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_at DATE,
        status ENUM('disponible','emprunte') DEFAULT 'disponible',
        bibliotheque_id INT,
        cover_image VARCHAR(500),
        download_link VARCHAR(500),
        description TEXT,
        summary TEXT,
        genre VARCHAR(100),
        isbn VARCHAR(50),
        pages INT,
        language VARCHAR(100),
        publisher VARCHAR(255),
        FOREIGN KEY(bibliotheque_id) REFERENCES bibliotheques(id) ON DELETE SET NULL
    )
    """))

    # ==========================
    # Reservations
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
        FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
    )
    """))

    conn.commit()

###############################
# Utility auth helpers (no DB DDL changes)
###############################
def verify_password(stored_hash, candidate_password):
    return check_password_hash(stored_hash, candidate_password)
