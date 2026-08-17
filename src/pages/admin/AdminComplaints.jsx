import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { listenToComplaints, updateComplaint } from '../../lib/firestore';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToComplaints(data => {
      setComplaints(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateComplaint(id, { status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <>
      <Helmet><title>Complaints - JAA FOODS Admin</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-800">Complaints & Feedback</h1>
          <p className="text-gray-500 text-sm">{complaints.length} total complaints</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No complaints yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Issue</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">{c.phone}</td>
                      <td className="px-4 py-3 text-brand-orange">{c.orderId || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.issue}</td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={e => handleStatus(c.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border text-xs"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
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
