import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Composant pour afficher conditionnellement du contenu basé sur les permissions
 * 
 * Exemples d'utilisation :
 * <PermissionGuard permission="BOOK_DELETE">
 *   <button>Supprimer</button>
 * </PermissionGuard>
 * 
 * <PermissionGuard permissions={["BOOK_EDIT", "BOOK_DELETE"]} requireAll={false}>
 *   <button>Modifier/Supprimer</button>
 * </PermissionGuard>
 * 
 * <PermissionGuard role="admin">
 *   <AdminPanel />
 * </PermissionGuard>
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions = [], 
  role,
  requireAll = true,
  fallback = null 
}) => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (role) {
    hasAccess = hasRole(role);
  } else if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  }

  return hasAccess ? children : fallback;
};

/**
 * Hook pour utiliser dans des conditions
 */
export const usePermissionCheck = () => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  return {
    canAccess: (permission) => hasPermission(permission),
    canAccessAny: (permissions) => hasAnyPermission(permissions),
    canAccessAll: (permissions) => hasAllPermissions(permissions),
    hasRole: (role) => hasRole(role)
  };
};