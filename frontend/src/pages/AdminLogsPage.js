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

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async (opts = {}) => {
    setLoading(true);
    try {
      const params = { page, limit, ...(opts.query ? { q: opts.query } : {}) };
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold">Logs d'activité</h1>
        <p className="text-sm text-gray-600">Consultez les logs remontés par le service `activity_logs`.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Rechercher (username/action/module/ip)" className="input flex-1" />
          <button className="btn btn-primary" type="submit">Rechercher</button>
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
