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

  const ACTION_OPTIONS = [
    'CREATE_ACCOUNT','USER_DELETE_ACCOUNT','USER_UPDATE','USER_ROLES_CHANGE','PASSWORD_CHANGE',
    'USER_DELETE','ADD_BOOK','UPDATE_BOOK','DELETE_BOOK','BOOK_STATUS_CHANGE','BOOK_RESERVED',
    'BOOK_RESERVED_CANCEL','BOOK_RETURNED','ROLE_CREATE','ROLE_UPDATE','ROLE_DELETE','ROLE_ASSIGNED','ROLE_REMOVED',
    'RESERVATION_VALIDATED','RESERVATION_REJECTED','EXTENSION_REQUESTED','EXTENSION_GRANTED','EXTENSION_DENIED',
    'CLEANUP_EXPIRED'
  ];

  useEffect(() => {
    loadLogs();
  }, [page]);

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
      console.error('Erreur fetch logs', err);
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
        <h1 className="text-2xl font-bold">Logs d'activité</h1>
        <p className="text-sm text-gray-600">Consultez les logs remontés par le service `activity_logs`.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Rechercher (username/action/module/ip)" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" type="submit">Rechercher</button>
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Module</label>
                    <select value={moduleFilter} onChange={(e)=>setModuleFilter(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tous</option>
                      <option value="auth">auth</option>
                      <option value="books">books</option>
                      <option value="admin">admin</option>
                      <option value="loans">loans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Action</label>
                    <select value={actionFilter} onChange={(e)=>setActionFilter(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Toutes</option>
                      {ACTION_OPTIONS.map(a => (<option key={a} value={a}>{a}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tous</option>
                      <option value="success">success</option>
                      <option value="failure">failure</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start date</label>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End date</label>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button type="button" onClick={handleApplyFilters} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Appliquer</button>
                  <button type="button" onClick={handleResetFilters} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Réinitialiser</button>
                  <div className="ml-auto text-sm text-gray-500">Filtres appliqués: <span className="font-medium">{logs.length}</span></div>
                </div>
              </div>
        </form>

        {loading ? (
          <div className="text-center py-12"><Loader size="large" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Utilisateur</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Module</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">IP</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((l, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-gray-600">{l.timestamp ? new Date(l.timestamp).toLocaleString('fr-FR') : '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{l.username || l.user || l.user_id || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{l.module || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{l.action || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{l.ip || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{l.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogsPage;
