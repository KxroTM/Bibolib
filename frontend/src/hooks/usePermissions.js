import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionName) => {
    if (!user || !user.permissions) return false;
    // Les permissions sont un array de strings, pas d'objets
    return user.permissions.includes(permissionName);
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    // Les rôles sont un array de strings, pas d'objets
    return user.roles.includes(roleName);
  };

  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some(perm => hasPermission(perm));
  };

  const hasAllPermissions = (permissionNames) => {
    return permissionNames.every(perm => hasPermission(perm));
  };

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    permissions: user?.permissions || [],
    roles: user?.roles || []
  };
};