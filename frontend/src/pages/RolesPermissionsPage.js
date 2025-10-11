import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { adminService } from '../services/api';
import axios from 'axios';
import API_CONFIG from '../config';

const RolesPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(false);
  
  // Données
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modals
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Formulaires
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [permissionForm, setPermissionForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRoles(),
        loadPermissions(),
        loadUsers()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.baseURL}/admin/roles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setRoles(response.data.roles || []);
    } catch (error) {
      
      toast.error('Erreur lors du chargement des rôles');
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.baseURL}/admin/permissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setPermissions(response.data.permissions || []);
    } catch (error) {
      
      toast.error('Erreur lors du chargement des permissions');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      
    }
  };

  const createRole = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/admin/roles`, roleForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Rôle créé avec succès');
      setShowCreateRoleModal(false);
      setRoleForm({ name: '', description: '' });
      loadRoles();
    } catch (error) {
      
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const createPermission = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/admin/permissions`, permissionForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Permission créée avec succès');
      setShowCreatePermissionModal(false);
      setPermissionForm({ name: '', description: '' });
      loadPermissions();
    } catch (error) {
      
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const togglePermission = async (roleId, permissionId, hasPermission) => {
    try {
      if (hasPermission) {
        // Retirer la permission
        await axios.delete(`${API_CONFIG.baseURL}/admin/roles/${roleId}/permissions/${permissionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Permission retirée');
      } else {
        // Ajouter la permission
        await axios.post(`${API_CONFIG.baseURL}/admin/roles/${roleId}/permissions`, 
          { permission_id: permissionId },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Permission attribuée');
      }
      loadRoles();
    } catch (error) {
      
      toast.error(error.response?.data?.error || 'Erreur');
    }
  };

  const deleteRole = async (roleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;
    
    try {
      await axios.delete(`${API_CONFIG.baseURL}/admin/roles/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Rôle supprimé');
      loadRoles();
    } catch (error) {
      
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header secret */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">🔐 Gestion Avancée</h1>
              <p className="text-purple-100 mt-2">Rôles et Permissions - Administration système</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-sm">⚙️ Système</span>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roles'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Rôles ({roles.length})
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'permissions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Permissions ({permissions.length})
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matrix'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎛️ Matrice des permissions
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des rôles</h2>
                <button
                  onClick={() => setShowCreateRoleModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  ➕ Créer un rôle
                </button>
              </div>
            </div>

            {/* Liste des rôles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.description || 'Aucune description'}</p>
                    </div>
                    {role.name !== 'admin' && (
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Permissions ({role.permissions.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map(perm => (
                        <span
                          key={perm}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length === 0 && (
                        <span className="text-gray-400 text-xs">Aucune permission</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowAssignModal(true);
                    }}
                    className="mt-4 w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm transition-colors"
                  >
                    ⚙️ Gérer les permissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des permissions</h2>
                <button
                  onClick={() => setShowCreatePermissionModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  ➕ Créer une permission
                </button>
              </div>
            </div>

            {/* Liste des permissions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisée par
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{permission.description || 'Aucune description'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {roles
                            .filter(role => role.permissions.includes(permission.name))
                            .map(role => (
                              <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role.name}
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Matrice des permissions</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3 border-b font-medium text-gray-700">Rôle</th>
                    {permissions.map(permission => (
                      <th key={permission.id} className="text-center p-3 border-b font-medium text-gray-700 min-w-[120px]">
                        <div className="transform -rotate-45 origin-center whitespace-nowrap text-xs">
                          {permission.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b font-medium text-gray-900">{role.name}</td>
                      {permissions.map(permission => {
                        const hasPermission = role.permissions.includes(permission.name);
                        return (
                          <td key={permission.id} className="p-3 border-b text-center">
                            <button
                              onClick={() => togglePermission(role.id, permission.id, hasPermission)}
                              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                hasPermission
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'bg-gray-200 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {hasPermission ? '✓' : ''}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal création rôle */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau rôle</h3>
              <form onSubmit={createRole}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du rôle</label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoleModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal création permission */}
      {showCreatePermissionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer une nouvelle permission</h3>
              <form onSubmit={createPermission}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la permission</label>
                    <input
                      type="text"
                      value={permissionForm.name}
                      onChange={(e) => setPermissionForm({...permissionForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="ex: BOOK_MANAGE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={permissionForm.description}
                      onChange={(e) => setPermissionForm({...permissionForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Description de ce que permet cette permission"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreatePermissionModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal assignment permissions (bonus pour plus tard) */}
      {showAssignModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gérer les permissions pour "{selectedRole.name}"
              </h3>
              <div className="space-y-3">
                {permissions.map(permission => {
                  const hasPermission = selectedRole.permissions.includes(permission.name);
                  return (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{permission.name}</div>
                        <div className="text-sm text-gray-600">{permission.description}</div>
                      </div>
                      <button
                        onClick={() => togglePermission(selectedRole.id, permission.id, hasPermission)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          hasPermission
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {hasPermission ? '❌ Retirer' : '✅ Attribuer'}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsPage;
