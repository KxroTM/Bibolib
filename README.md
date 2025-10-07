# 📚 Bibolib - Système de Gestion de Bibliothèques

Bibolib est une application complète de gestion de bibliothèques développée avec une architecture microservices utilisant React, Flask, Go et MySQL.

## 🏗️ Architecture

- **Frontend** : React.js (port 3000)
- **Backend API** : Flask/Python (port 5000)
- **Base de données** : MySQL 8.0 (port 3307)
- **Logs d'activité** : Go/Gin (port 8080)
- **Base de données logs** : MongoDB (cloud)

## 📋 Prérequis

- [Docker](https://www.docker.com/get-started) et Docker Compose installés
- Git pour cloner le projet

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/KxroTM/Bibolib.git
cd Bibolib
```

### 2. Démarrer tous les services
```bash
# Première fois : construire et démarrer
docker-compose up --build -d

# Ou simplement démarrer (si déjà construit)
docker-compose up -d
```

### 3. Vérifier que tous les services sont actifs
```bash
docker-compose ps
```

Vous devriez voir 4 conteneurs en cours d'exécution :
- `bibolib-mysql` (healthy)
- `bibolib-backend-1` (up)
- `bibolib-frontend-1` (up)
- `bibolib-activity_logs-1` (up)

## 🌐 Accès aux Services

- **Application Web** : http://localhost:3000
- **API Backend** : http://localhost:5000
- **Service de Logs** : http://localhost:8080
- **Base de données MySQL** : localhost:3307

### Test de l'API
```bash
# Vérifier que l'API répond
curl http://localhost:5000/
# Réponse attendue : {"message": "API Bibolib OK"}
```

## 🛠️ Commandes de Gestion

### Démarrage/Arrêt
```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
```

### Monitoring et Logs
```bash
# Voir le statut des conteneurs
docker-compose ps

# Voir tous les logs
docker-compose logs

# Voir les logs d'un service spécifique
docker-compose logs backend

# Suivre les logs en temps réel
docker-compose logs -f backend
```

### Reconstruction
```bash
# Reconstruire et redémarrer tous les services
docker-compose up --build -d

# Reconstruire un service spécifique
docker-compose build backend
```

## 🗄️ Base de Données

La base de données MySQL est automatiquement initialisée avec le fichier `bibolib.sql` au premier démarrage.

### Connexion à la base de données
```bash
# Se connecter à MySQL depuis le conteneur
docker exec -it bibolib-mysql mysql -u bibolib_user -p bibolib

# Ou depuis votre machine (si vous avez un client MySQL)
mysql -h 127.0.0.1 -P 3307 -u bibolib_user -p bibolib
```

**Identifiants de connexion :**
- Host: `localhost` (ou `mysql` depuis les conteneurs)
- Port: `3307`
- Database: `bibolib`
- Username: `bibolib_user`
- Password: `bibolib_password`

## 🔧 Développement

### Structure du projet
```
Bibolib/
├── frontend/          # Application React
├── backend/           # API Flask/Python
├── activity_logs/     # Service Go pour les logs
├── bibolib.sql       # Script d'initialisation de la BDD
├── docker-compose.yml # Configuration Docker
└── .env              # Variables d'environnement
```

### Variables d'environnement
Le fichier `.env` contient toutes les configurations nécessaires :
- Configuration MySQL
- Configuration JWT
- Configuration MongoDB pour les logs

### Développement local (sans Docker)
Si vous souhaitez développer sans Docker :

#### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Activity Logs
```bash
cd activity_logs
go mod tidy
go run main.go
```

## 🧹 Nettoyage

```bash
# Arrêter et supprimer tous les conteneurs
docker-compose down

# Supprimer également les volumes (⚠️ efface les données)
docker-compose down -v

# Supprimer les images Docker créées
docker-compose down --rmi all
```

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé** : Modifiez les ports dans `docker-compose.yml`
2. **Erreur de connexion à la base de données** : Attendez que MySQL soit "healthy"
3. **Backend ne démarre pas** : Vérifiez les logs avec `docker-compose logs backend`

### Commandes de diagnostic
```bash
# Vérifier les ports utilisés
netstat -an | grep 3000
netstat -an | grep 5000
netstat -an | grep 3307
netstat -an | grep 8080

# Vérifier l'état des conteneurs
docker ps -a

# Supprimer tous les conteneurs arrêtés
docker container prune
```

## 📄 Licence

Ce projet est développé dans le cadre des études à Ynov.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Créer une Pull Request
