from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import text

db = SQLAlchemy()

# ==========================
# Users
# ==========================
def create_user(username, email, password_hash):
    user = {
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.now(datetime.timezone.utc)
    }
    db.session.execute(
        "INSERT INTO users (username, email, password_hash, created_at) VALUES (:username, :email, :password_hash, :created_at)",
        user
    )
    db.session.commit()
    return user

def get_user_by_id(user_id):
    return db.session.execute(
        "SELECT * FROM users WHERE id = :id",
        {"id": user_id}
    ).fetchone()

def get_all_users():
    return db.session.execute("SELECT * FROM users").fetchall()

def delete_user(user_id):
    db.session.execute(
        "DELETE FROM users WHERE id = :id",
        {"id": user_id}
    )
    db.session.commit()

# ==========================
# Roles & Permissions
# ==========================
def create_role(name, description=None):
    db.session.execute(
        "INSERT INTO roles (name, description) VALUES (:name, :description)",
        {"name": name, "description": description}
    )
    db.session.commit()

def assign_role_to_user(user_id, role_id):
    db.session.execute(
        "INSERT INTO role_user (user_id, role_id) VALUES (:user_id, :role_id)",
        {"user_id": user_id, "role_id": role_id}
    )
    db.session.commit()

def create_permission(name, description=None):
    db.session.execute(
        "INSERT INTO permissions (name, description) VALUES (:name, :description)",
        {"name": name, "description": description}
    )
    db.session.commit()

def assign_permission_to_role(role_id, permission_id):
    db.session.execute(
        "INSERT INTO permission_role (role_id, permission_id) VALUES (:role_id, :permission_id)",
        {"role_id": role_id, "permission_id": permission_id}
    )
    db.session.commit()

# ==========================
# Bibliothèques
# ==========================
def create_bibliotheque(name, adresse, telephone=None, email=None):
    db.session.execute(
        "INSERT INTO bibliotheques (name, adresse, telephone, email) VALUES (:name, :adresse, :telephone, :email)",
        {"name": name, "adresse": adresse, "telephone": telephone, "email": email}
    )
    db.session.commit()

def get_bibliotheque_by_id(biblio_id):
    return db.session.execute(
        "SELECT * FROM bibliotheques WHERE id = :id",
        {"id": biblio_id}
    ).fetchone()

# ==========================
# Livres
# ==========================
def create_book(title, author, bibliotheque_id, published_at=None):
    db.session.execute(
        "INSERT INTO books (title, author, bibliotheque_id, published_at, status) "
        "VALUES (:title, :author, :bibliotheque_id, :published_at, 'disponible')",
        {"title": title, "author": author, "bibliotheque_id": bibliotheque_id, "published_at": published_at}
    )
    db.session.commit()

def get_book_by_id(book_id):
    return db.session.execute(
        "SELECT * FROM books WHERE id = :id",
        {"id": book_id}
    ).fetchone()

# ==========================
# Reservations
# ==========================
def reserve_book(user_id, book_id, due_date):
    db.session.execute(
        "INSERT INTO reservations (user_id, book_id, reserved_at, due_date) "
        "VALUES (:user_id, :book_id, :reserved_at, :due_date)",
        {"user_id": user_id, "book_id": book_id, "reserved_at": datetime.utcnow(), "due_date": due_date}
    )
    db.session.execute(
        "UPDATE books SET status = 'emprunte' WHERE id = :id",
        {"id": book_id}
    )
    db.session.commit()

def return_book(reservation_id):
    db.session.execute(
        "UPDATE reservations SET returned_at = :returned_at WHERE id = :id",
        {"returned_at": datetime.utcnow(), "id": reservation_id}
    )
    # Update book status
    book_id = db.session.execute(
        "SELECT book_id FROM reservations WHERE id = :id",
        {"id": reservation_id}
    ).fetchone()["book_id"]
    db.session.execute(
        "UPDATE books SET status = 'disponible' WHERE id = :id",
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
        email VARCHAR(255)
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