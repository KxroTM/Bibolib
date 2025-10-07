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

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Créer une Pull Request
