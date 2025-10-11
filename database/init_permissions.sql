-- Script pour créer les permissions de base
-- À exécuter dans MySQL après la création des tables
-- Permissions Livres
INSERT INTO permissions (name, description)
VALUES ('BOOK_VIEW', 'Voir les livres'),
    ('BOOK_CREATE', 'Créer de nouveaux livres'),
    ('BOOK_EDIT', 'Modifier les livres existants'),
    ('BOOK_DELETE', 'Supprimer des livres'),
    (
        'BOOK_MANAGE_STATUS',
        'Changer le statut des livres'
    );
-- Permissions Bibliothèques
INSERT INTO permissions (name, description)
VALUES ('LIBRARY_VIEW', 'Voir les bibliothèques'),
    (
        'LIBRARY_CREATE',
        'Créer de nouvelles bibliothèques'
    ),
    ('LIBRARY_EDIT', 'Modifier les bibliothèques'),
    ('LIBRARY_DELETE', 'Supprimer des bibliothèques');
-- Permissions Utilisateurs
INSERT INTO permissions (name, description)
VALUES ('USER_VIEW', 'Voir la liste des utilisateurs'),
    ('USER_CREATE', 'Créer de nouveaux utilisateurs'),
    ('USER_EDIT', 'Modifier les utilisateurs'),
    ('USER_DELETE', 'Supprimer des utilisateurs'),
    (
        'USER_MANAGE_ROLES',
        'Gérer les rôles des utilisateurs'
    );
-- Permissions Réservations
INSERT INTO permissions (name, description)
VALUES ('RESERVATION_VIEW', 'Voir les réservations'),
    ('RESERVATION_CREATE', 'Créer des réservations'),
    (
        'RESERVATION_MANAGE',
        'Gérer toutes les réservations'
    ),
    ('LOAN_VIEW', 'Voir les emprunts'),
    ('LOAN_MANAGE', 'Gérer les emprunts');
-- Permissions Administration
INSERT INTO permissions (name, description)
VALUES (
        'ADMIN_DASHBOARD',
        'Accès au tableau de bord admin'
    ),
    (
        'ADMIN_LOGS',
        'Voir les logs d' audit '),
(' ADMIN_REPORTS ', ' Génération de rapports '),
(' SYSTEM_MAINTENANCE ', ' Accès aux outils de maintenance système ');

-- Permissions Système
INSERT INTO permissions (name, description) VALUES 
(' ROLE_MANAGE ', ' Gérer les rôles '),
(' PERMISSION_MANAGE ', ' Gérer les permissions '),
(' SYSTEM_CONFIG ', ' Configuration système ');

-- Créer des rôles de base
INSERT INTO roles (name, description) VALUES 
(' user ', ' Utilisateur standard '),
(' librarian ', ' Bibliothécaire '),
(' manager ', ' Gestionnaire de bibliothèque '),
(' admin ', ' Administrateur '),
(' superadmin ', ' Super Administrateur ');

-- Assigner permissions au rôle user
INSERT INTO permission_role (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = ' user ' AND p.name IN (' BOOK_VIEW ', ' LIBRARY_VIEW ', ' RESERVATION_CREATE ');

-- Assigner permissions au rôle librarian
INSERT INTO permission_role (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = ' librarian ' AND p.name IN (
    ' BOOK_VIEW ', ' BOOK_CREATE ', ' BOOK_EDIT ', ' BOOK_MANAGE_STATUS ',
    ' LIBRARY_VIEW ',
    ' RESERVATION_VIEW ', ' RESERVATION_CREATE ', ' RESERVATION_MANAGE ',
    ' LOAN_VIEW ', ' LOAN_MANAGE '
);

-- Assigner permissions au rôle manager
INSERT INTO permission_role (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = ' manager ' AND p.name IN (
    ' BOOK_VIEW ', ' BOOK_CREATE ', ' BOOK_EDIT ', ' BOOK_MANAGE_STATUS ',
    ' LIBRARY_VIEW ', ' LIBRARY_EDIT ',
    ' USER_VIEW ',
    ' RESERVATION_VIEW ', ' RESERVATION_CREATE ', ' RESERVATION_MANAGE ',
    ' LOAN_VIEW ', ' LOAN_MANAGE ',
    ' ADMIN_REPORTS '
);

-- Assigner permissions au rôle admin
INSERT INTO permission_role (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = ' admin ' AND p.name IN (
    ' BOOK_VIEW ', ' BOOK_CREATE ', ' BOOK_EDIT ', ' BOOK_DELETE ', ' BOOK_MANAGE_STATUS ',
    ' LIBRARY_VIEW ', ' LIBRARY_CREATE ', ' LIBRARY_EDIT ', ' LIBRARY_DELETE ',
    ' USER_VIEW ', ' USER_CREATE ', ' USER_EDIT ', ' USER_DELETE ', ' USER_MANAGE_ROLES ',
    ' RESERVATION_VIEW ', ' RESERVATION_CREATE ', ' RESERVATION_MANAGE ',
    ' LOAN_VIEW ', ' LOAN_MANAGE ',
    ' ADMIN_DASHBOARD ', ' ADMIN_LOGS ', ' ADMIN_REPORTS '
);

-- Assigner toutes les permissions au superadmin
INSERT INTO permission_role (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = ' superadmin ';

-- Vérification
SELECT 
    r.name as role_name,
    COUNT(pr.permission_id) as permission_count
FROM roles r
LEFT JOIN permission_role pr ON r.id = pr.role_id
GROUP BY r.id, r.name
ORDER BY permission_count DESC;