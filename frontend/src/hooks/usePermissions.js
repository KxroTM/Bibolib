import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionName) => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(perm => perm.name === permissionName);
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name === roleName);
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