import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { listenToAuditLog } from '../../lib/firestore';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToAuditLog(data => {
      setLogs(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <>
      <Helmet><title>Audit Log - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Audit Log</h1>
          <p className="text-gray-500 text-sm">Track all admin actions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No audit entries yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-medium">{log.userName || log.userEmail || 'System'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{log.details || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
