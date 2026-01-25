import { useEffect, useState } from 'react';
import { getIssues, updateIssueStatus } from '../services/api';
import { Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    getIssues()
      .then(setIssues)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await updateIssueStatus(id, newStatus);
      setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const statusOptions = ['REPORTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-dark text-white rounded-3 p-3 d-flex align-items-center justify-content-center shadow-sm">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="h3 fw-bold text-dark mb-0">Admin Dashboard</h1>
          <p className="text-muted mb-0">Manage community reports</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden hover-lift transition-all">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 small fw-bold text-secondary text-uppercase border-0">Issue</th>
                <th className="px-4 py-3 small fw-bold text-secondary text-uppercase border-0">Category</th>
                <th className="px-4 py-3 small fw-bold text-secondary text-uppercase border-0">Date</th>
                <th className="px-4 py-3 small fw-bold text-secondary text-uppercase border-0">Status</th>
                <th className="px-4 py-3 small fw-bold text-secondary text-uppercase border-0">Action</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-5 text-center text-muted">Loading issues...</td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-5 text-center text-muted">No issues found.</td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="px-4 py-3">
                      <div className="fw-medium text-dark">{issue.title}</div>
                      <div className="small text-muted font-monospace mt-1">{issue.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-4 py-3 text-secondary text-sm">
                      {issue.category}
                    </td>
                    <td className="px-4 py-3 text-secondary text-sm">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        disabled={updating === issue.id}
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className={`form-select form-select-sm fw-bold border-0 py-1 px-2 ${
                          issue.status === 'RESOLVED' ? 'bg-success bg-opacity-10 text-success' :
                          issue.status === 'IN_PROGRESS' ? 'bg-warning bg-opacity-10 text-warning' :
                          issue.status === 'REJECTED' ? 'bg-secondary bg-opacity-10 text-secondary' :
                          'bg-danger bg-opacity-10 text-danger'
                        }`}
                        style={{ width: 'auto', cursor: 'pointer' }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {updating === issue.id && <span className="small text-muted ms-2">Saving...</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/issues/${issue.id}`} className="btn btn-sm btn-light text-primary hover-scale transition-all">
                        <ExternalLink size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
