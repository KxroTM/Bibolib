# 🔐 Guide des Permissions - Bibolib

## Permissions Standards Recommandées

### 📚 **Gestion des Livres**

- `BOOK_VIEW` - Voir les livres (lecture seule)
- `BOOK_CREATE` - Créer de nouveaux livres
- `BOOK_EDIT` - Modifier les livres existants
- `BOOK_DELETE` - Supprimer des livres
- `BOOK_MANAGE_STATUS` - Changer le statut des livres (disponible/emprunté)

### 🏛️ **Gestion des Bibliothèques**

- `LIBRARY_VIEW` - Voir les bibliothèques
- `LIBRARY_CREATE` - Créer de nouvelles bibliothèques
- `LIBRARY_EDIT` - Modifier les bibliothèques
- `LIBRARY_DELETE` - Supprimer des bibliothèques

### 👥 **Gestion des Utilisateurs**

- `USER_VIEW` - Voir la liste des utilisateurs
- `USER_CREATE` - Créer de nouveaux utilisateurs
- `USER_EDIT` - Modifier les utilisateurs
- `USER_DELETE` - Supprimer des utilisateurs
- `USER_MANAGE_ROLES` - Gérer les rôles des utilisateurs

### 📋 **Gestion des Réservations/Emprunts**

- `RESERVATION_VIEW` - Voir les réservations
- `RESERVATION_CREATE` - Créer des réservations
- `RESERVATION_MANAGE` - Gérer toutes les réservations
- `LOAN_VIEW` - Voir les emprunts
- `LOAN_MANAGE` - Gérer les emprunts (validation, retour)

### 📊 **Administration**

- `ADMIN_DASHBOARD` - Accès au tableau de bord admin
- `ADMIN_LOGS` - Voir les logs d'audit
- `ADMIN_REPORTS` - Génération de rapports
- `SYSTEM_MAINTENANCE` - Accès aux outils de maintenance système

### 🔧 **Système**

- `ROLE_MANAGE` - Gérer les rôles (création, modification, suppression)
- `PERMISSION_MANAGE` - Gérer les permissions
- `SYSTEM_CONFIG` - Configuration système

## Rôles Recommandés

### 👤 **Utilisateur Standard**

- `BOOK_VIEW`
- `LIBRARY_VIEW`
- `RESERVATION_CREATE`

### 📚 **Bibliothécaire**

- Toutes les permissions Utilisateur +
- `BOOK_CREATE`, `BOOK_EDIT`, `BOOK_MANAGE_STATUS`
- `RESERVATION_VIEW`, `RESERVATION_MANAGE`
- `LOAN_VIEW`, `LOAN_MANAGE`

### 🏛️ **Gestionnaire de Bibliothèque**

- Toutes les permissions Bibliothécaire +
- `LIBRARY_EDIT` (pour sa bibliothèque)
- `USER_VIEW`
- `ADMIN_REPORTS`

### 👨‍💼 **Administrateur**

- Toutes les permissions +
- `ADMIN_DASHBOARD`, `ADMIN_LOGS`
- `USER_MANAGE_ROLES`
- `LIBRARY_DELETE`, `BOOK_DELETE`, `USER_DELETE`

### ⚙️ **Super Admin**

- Toutes les permissions +
- `ROLE_MANAGE`, `PERMISSION_MANAGE`
- `SYSTEM_MAINTENANCE`, `SYSTEM_CONFIG`

## Comment Intégrer une Nouvelle Permission

### 1. **Créer la Permission**

```javascript
// Via l'interface /system/maintenance
Permission: BOOK_ADVANCED_SEARCH;
Description: "Effectuer des recherches avancées dans les livres";
```

### 2. **L'Utiliser dans le Code**

```javascript
// Dans un composant React
import { PermissionGuard } from "../components/PermissionGuard";

<PermissionGuard permission="BOOK_ADVANCED_SEARCH">
  <AdvancedSearchForm />
</PermissionGuard>;

// Ou conditionnellement
const { hasPermission } = usePermissions();

{
  hasPermission("BOOK_ADVANCED_SEARCH") && (
    <button onClick={openAdvancedSearch}>Recherche Avancée</button>
  );
}
```

### 3. **Protéger les Endpoints Backend**

```python
# Dans app.py
@app.route('/api/books/advanced-search', methods=['POST'])
@auth_required
@permission_required('BOOK_ADVANCED_SEARCH')
def advanced_book_search():
    # Logique de recherche avancée
    pass
```

## Stratégie de Déploiement

### Phase 1: Permissions de Base

1. Créer les permissions essentielles via `/system/maintenance`
2. Assigner aux rôles existants
3. Tester sur quelques composants

### Phase 2: Protection Granulaire

1. Identifier les fonctionnalités critiques
2. Ajouter `PermissionGuard` progressivement
3. Tester avec différents rôles

### Phase 3: Permissions Avancées

1. Permissions contextuelles (ex: éditer uniquement ses propres réservations)
2. Permissions temporaires
3. Permissions géographiques (par bibliothèque)

## Exemple d'Utilisation Avancée

```javascript
// Permissions multiples avec fallback
<PermissionGuard
  permissions={["BOOK_EDIT", "BOOK_ADMIN"]}
  requireAll={false}
  fallback={<div>Accès restreint</div>}
>
  <BookEditForm />
</PermissionGuard>;

// Hook conditionnel
const { canAccess, canAccessAny } = usePermissionCheck();

const showAdvancedOptions = canAccessAny([
  "ADMIN_DASHBOARD",
  "BOOK_ADVANCED_EDIT",
]);
```

Ce système te permet d'avoir un contrôle granulaire sur toutes les fonctionnalités ! 🚀
