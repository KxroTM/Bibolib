import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';

const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  // Filters
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Modal pour les détails
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Helpers to safely extract and display a username from logs that may contain numbers/objects
  const coerceToString = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'number') return String(v);
    if (typeof v === 'object') {
      // Try common fields if user is an object
      if (v.username) return String(v.username);
      if (v.name) return String(v.name);
      if (v.email) return String(v.email);
      if (v.id) return String(v.id);
      return '';
    }
    try { return String(v); } catch { return ''; }
  };

  const getDisplayUser = (l) => {
    const val =
      coerceToString(l?.username) ||
      coerceToString(l?.user) ||
      coerceToString(l?.user_id) ||
      coerceToString(l?.AdminName) ||
      coerceToString(l?.admin_name) ||
      coerceToString(l?.AdminID) ||
      coerceToString(l?.admin_id);
    return val || 'Anonyme';
  };

  const getUserInitial = (l) => {
    const name = getDisplayUser(l);
    return name && name.length ? name.charAt(0).toUpperCase() : '?';
  };

  const ACTION_OPTIONS = [
    'CREATE_ACCOUNT','USER_DELETE_ACCOUNT','USER_UPDATE','USER_ROLES_CHANGE','PASSWORD_CHANGE',
    'USER_DELETE','ADD_BOOK','UPDATE_BOOK','DELETE_BOOK','BOOK_STATUS_CHANGE','BOOK_RESERVED',
    'BOOK_RESERVED_CANCEL','BOOK_RETURNED','ROLE_CREATE','ROLE_UPDATE','ROLE_DELETE','ROLE_ASSIGNED','ROLE_REMOVED',
    'RESERVATION_VALIDATED','RESERVATION_REJECTED','EXTENSION_REQUESTED','EXTENSION_GRANTED','EXTENSION_DENIED',
    'CLEANUP_EXPIRED'
  ];

  // Filtres rapides prédéfinis
  const QUICK_FILTERS = [
    { label: 'Aujourd\'hui', action: () => setTodayFilter() },
    { label: 'Erreurs', action: () => setQuickFilter({ status: 'failure' }) },
    { label: 'Connexions', action: () => setQuickFilter({ module: 'auth' }) },
    { label: 'Livres', action: () => setQuickFilter({ module: 'books' }) },
    { label: 'Prêts', action: () => setQuickFilter({ module: 'loans' }) },
    { label: 'Admin', action: () => setQuickFilter({ module: 'admin' }) }
  ];

  useEffect(() => {
    loadLogs();
  }, [page]);

  // Fonctions helper pour les filtres rapides
  const setTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setModuleFilter('');
    setActionFilter('');
    setStatusFilter('');
    setPage(1);
    loadLogs({ start_date: today, end_date: today, page: 1 });
  };

  const setQuickFilter = (filters) => {
    setModuleFilter(filters.module || '');
    setActionFilter(filters.action || '');
    setStatusFilter(filters.status || '');
    setStartDate('');
    setEndDate('');
    setPage(1);
    loadLogs({ ...filters, page: 1 });
  };

  // Fonction pour ouvrir les détails
  const openDetails = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failure':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Fonction pour obtenir le badge de module
  const getModuleBadge = (module) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (module) {
      case 'auth':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'books':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'admin':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'loans':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const loadLogs = async (opts = {}) => {
    setLoading(true);
    try {
      const pageParam = opts.page !== undefined ? opts.page : page;
      const params = {
        page: pageParam,
        limit,
        ...(opts.query ? { q: opts.query } : {}),
        ...(opts.module ? { module: opts.module } : {}),
        ...(opts.action ? { action: opts.action } : {}),
        ...(opts.status ? { status: opts.status } : {}),
        ...(opts.start_date ? { start_date: opts.start_date } : {}),
        ...(opts.end_date ? { end_date: opts.end_date } : {}),
      };

      const res = await adminService.getLogs(params);
      if (res.error) throw res.error;
      const data = res.data || {};
      setLogs(data.logs || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      
      toast.error('Impossible de récupérer les logs (vérifier que le service activity_logs tourne sur :8080)');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await loadLogs({ query });
  };

  const handleApplyFilters = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setPage(1);
    const params = {
      page: 1,
      module: moduleFilter,
      action: actionFilter,
      status: statusFilter,
      start_date: startDate,
      end_date: endDate,
    };
    await loadLogs(params);
  };

  const handleResetFilters = async () => {
    setModuleFilter('');
    setActionFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setQuery('');
    setPage(1);
    await loadLogs();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Logs d'activité</h1>
        <p className="text-sm text-gray-600 mt-1">Consultez les logs remontés par le service activity_logs</p>
        
        {/* Filtres rapides */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">Filtres rapides:</span>
            {QUICK_FILTERS.map((filter, index) => (
              <button
                key={index}
                onClick={filter.action}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {filter.label}
              </button>
            ))}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input 
              value={query} 
              onChange={(e)=>setQuery(e.target.value)} 
              placeholder="Rechercher (username/action/module/ip)" 
              className="flex-1 border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
            <button 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium" 
              type="submit"
            >
              🔍 Rechercher
            </button>
          </div>

          {/* Filtres avancés */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                <select 
                  value={moduleFilter} 
                  onChange={(e)=>setModuleFilter(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les modules</option>
                  <option value="auth">🔐 auth</option>
                  <option value="books">📚 books</option>
                  <option value="admin">⚙️ admin</option>
                  <option value="loans">📖 loans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select 
                  value={actionFilter} 
                  onChange={(e)=>setActionFilter(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les actions</option>
                  {ACTION_OPTIONS.map(a => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select 
                  value={statusFilter} 
                  onChange={(e)=>setStatusFilter(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="success">✅ Succès</option>
                  <option value="failure">❌ Échec</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e)=>setStartDate(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e)=>setEndDate(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={handleApplyFilters} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  ✨ Appliquer
                </button>
                <button 
                  type="button" 
                  onClick={handleResetFilters} 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  🗑️ Effacer
                </button>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-blue-600">{logs.length}</span> résultat{logs.length > 1 ? 's' : ''} trouvé{logs.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-16">
            <Loader size="large" />
            <p className="text-gray-500 mt-4">Chargement des logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun log trouvé</h3>
            <p className="text-gray-500">Aucun log ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((l, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {l.timestamp ? new Date(l.timestamp).toLocaleString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                              {getUserInitial(l)}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {getDisplayUser(l)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {l.module ? (
                          <span className={getModuleBadge(l.module)}>
                            {l.module}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {l.action || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {l.ip || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {l.status ? (
                          <span className={getStatusBadge(l.status)}>
                            {l.status === 'success' ? '✅ Succès' : l.status === 'failure' ? '❌ Échec' : l.status}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => openDetails(l)}
                          className="text-blue-600 hover:text-blue-900 font-medium hover:underline focus:outline-none focus:underline transition-colors"
                        >
                          🔍 Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal des détails */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détails du log</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString('fr-FR') : 'Non spécifié'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                        {getUserInitial(selectedLog)}
                      </div>
                      {getDisplayUser(selectedLog)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {selectedLog.module ? (
                        <span className={getModuleBadge(selectedLog.module)}>
                          {selectedLog.module}
                        </span>
                      ) : (
                        'Non spécifié'
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {selectedLog.status ? (
                        <span className={getStatusBadge(selectedLog.status)}>
                          {selectedLog.status === 'success' ? '✅ Succès' : selectedLog.status === 'failure' ? '❌ Échec' : selectedLog.status}
                        </span>
                      ) : (
                        'Non spécifié'
                      )}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm font-mono">
                    {selectedLog.action || 'Non spécifiée'}
                  </div>
                </div>

                {/* Adresse IP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm font-mono">
                    {selectedLog.ip || 'Non spécifiée'}
                  </div>
                </div>

                {/* Données complètes (JSON) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Données complètes</label>
                  <div className="p-4 bg-gray-900 rounded-md text-xs text-green-400 font-mono overflow-x-auto">
                    <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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

export default AdminLogsPage;
