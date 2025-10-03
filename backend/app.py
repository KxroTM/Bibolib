from flask import Flask, request, jsonify
from models import db, create_user, get_all_users, create_bibliotheque, get_bibliotheque_by_id, create_all_tables

app = Flask(__name__)

# Config MySQL
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost:3306/bibolib"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def home():
    return {"message": "connexion reussie"}

# Users Endpoints
@app.route("/users", methods=["POST"])
def add_user():
    data = request.json
    user = create_user(
        username=data["username"],
        email=data["email"],
        password_hash=data["password_hash"]
    )
    return jsonify({"message": "Utilisateur créé", "user": user}), 201

@app.route("/users", methods=["GET"])
def list_users():
    users = get_all_users()
    users_list = [dict(u) for u in users]
    return jsonify(users_list)

# Bibliothèques Endpoints
@app.route("/bibliotheques", methods=["POST"])
def add_bibliotheque():
    data = request.json
    create_bibliotheque(
        name=data["name"],
        adresse=data["adresse"],
        telephone=data.get("telephone"),
        email=data.get("email")
    )
    return jsonify({"message": "Bibliothèque créée"}), 201

@app.route("/bibliotheques/<int:biblio_id>", methods=["GET"])
def get_bibliotheque(biblio_id):
    biblio = get_bibliotheque_by_id(biblio_id)
    if biblio:
        return jsonify(dict(biblio))
    return jsonify({"message": "Bibliothèque non trouvée"}), 404


if __name__ == "__main__":
    with app.app_context():
        create_all_tables()
    app.run(debug=True)
