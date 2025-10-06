# BiboLib Frontend 📚

Une application React moderne pour explorer les bibliothèques de Paris et leurs collections.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le repository** (si ce n'est pas déjà fait)
```bash
git clone https://github.com/KxroTM/Bibolib.git
cd Bibolib/fronted
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application en mode développement**
```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📋 Scripts disponibles

- `npm start` - Lance l'application en mode développement
- `npm run build` - Compile l'application pour la production
- `npm test` - Lance les tests
- `npm run eject` - ⚠️ Opération irréversible pour configurer webpack

## 🎯 Fonctionnalités

### Interface Utilisateur
- 🏠 **Page d'accueil** : Liste paginée des bibliothèques parisiennes
- 🔍 **Recherche globale** : Recherche de livres dans toutes les bibliothèques
- 🏛️ **Pages bibliothèques** : Collections détaillées par bibliothèque
- 📖 **Fiches livres** : Informations complètes sur chaque livre
- 🎨 **Design responsive** : Interface adaptée à tous les écrans

### Panel Administrateur
- 🔐 **Authentification sécurisée** avec JWT
- 📚 **Gestion des livres** : CRUD complet (Créer, Lire, Modifier, Supprimer)
- 👥 **Gestion des administrateurs** : Ajout/suppression d'admins
- 📊 **Statistiques en temps réel**
- 🎯 **Interface intuitive** avec modales et notifications

### Fonctionnalités avancées
- 🔍 **Recherche en temps réel** avec debounce
- 📄 **Pagination intelligente**
- 🏷️ **Filtrage par arrondissement et genre**
- 📱 **Design mobile-first**
- 🎨 **Animations fluides** avec Tailwind CSS
- 🍞 **Notifications toast** pour le feedback utilisateur

## 🎨 Stack Technique

- **React 18** - Framework principal
- **React Router** - Navigation
- **Tailwind CSS** - Styling moderne
- **Axios** - Requêtes HTTP
- **React Toastify** - Notifications
- **Context API** - Gestion d'état

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── BookCard.js     # Carte d'affichage livre
│   ├── LibraryCard.js  # Carte d'affichage bibliothèque
│   ├── Loader.js       # Composant de chargement
│   ├── Navbar.js       # Barre de navigation
│   ├── Pagination.js   # Pagination
│   ├── ProtectedRoute.js # Route protégée admin
│   └── SearchBar.js    # Barre de recherche
├── pages/              # Pages de l'application
│   ├── HomePage.js     # Page d'accueil
│   ├── LibraryPage.js  # Page détail bibliothèque
│   ├── BookDetailPage.js # Page détail livre
│   ├── LoginPage.js    # Page de connexion admin
│   └── AdminDashboard.js # Panel administrateur
├── context/            # Contextes React
│   └── AuthContext.js  # Gestion authentification
├── services/           # Services API
│   └── api.js         # Configuration Axios
├── utils/              # Utilitaires
│   ├── constants.js    # Constantes
│   ├── formatters.js   # Formatage
│   └── validators.js   # Validation
├── config/            # Configuration
│   └── index.js       # Config API
└── index.css          # Styles Tailwind
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API backend (optionnel - l'app fonctionne avec des données de demo)
REACT_APP_API_URL=http://localhost:5000

# Autres configurations
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=BiboLib
```

## 🎭 Données de démonstration

L'application inclut des données de démonstration pour :
- **Bibliothèques** : 4 bibliothèques parisiennes avec informations complètes
- **Livres** : Collection variée avec métadonnées (auteur, année, genre, etc.)
- **Authentification** : Compte admin de test

### Compte administrateur de test
- **Email** : `admin@bibolib.fr`
- **Mot de passe** : `admin123`

## 🎨 Personnalisation

### Couleurs (Tailwind)
Les couleurs principales sont définies dans `tailwind.config.js` :
- **Primary** : Bleu (#3b82f6)
- **Secondary** : Gris (#6b7280)

### Styles personnalisés
Les composants Tailwind personnalisés sont dans `src/index.css` :
- `.btn-primary` - Bouton principal
- `.btn-secondary` - Bouton secondaire
- `.card` - Carte avec ombre
- `.input-field` - Champ de saisie

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 **Mobile** (< 768px)
- 💻 **Tablet** (768px - 1024px)  
- 🖥️ **Desktop** (> 1024px)

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

Le dossier `build/` contiendra l'application optimisée.

### Déploiement statique
L'application peut être déployée sur :
- **Netlify** - `npm run build` puis glisser-déposer le dossier build
- **Vercel** - Connexion directe au repository GitHub
- **GitHub Pages** - Avec GitHub Actions
- **Firebase Hosting** - `firebase deploy`

## 🔮 Évolutions futures

- 🔔 **Notifications push** pour les nouveaux livres
- 🌙 **Mode sombre**
- 🌍 **Internationalisation** (i18n)
- 📊 **Analytics** et métriques
- 🔍 **Recherche avancée** avec filtres multiples
- 📝 **Système de reviews** pour les livres
- 🎯 **Recommandations personnalisées**

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Fait avec ❤️ pour les bibliothèques de Paris**