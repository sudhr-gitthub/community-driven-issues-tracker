import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock } from 'lucide-react';
import { getUserIssues } from '../services/api';

export default function UserProfile() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('civic_user_id');
    setUserId(storedUserId);

    if (storedUserId) {
      getUserIssues(storedUserId)
        .then(setIssues)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-4 mb-5">
        <div className="bg-light p-3 rounded-circle border border-2 border-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
          <User className="text-primary" size={40} />
        </div>
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">My Profile</h1>
          <p className="text-muted mb-0">
            {userId ? 'Anonymous Citizen' : 'Guest User'}
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h2 className="h5 fw-bold text-dark mb-0">My Reports</h2>
      </div>

      {!userId ? (
        <div className="card border-dashed border-2 bg-light text-center py-5">
          <div className="card-body">
            <p className="text-muted mb-3">You haven't submitted any reports yet (or your session was cleared).</p>
            <Link to="/report" className="btn btn-primary fw-medium">
              Submit a Report
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="row g-3">
          {[...Array(2)].map((_, i) => (
             <div key={i} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                   <div className="card-body placeholder-glow">
                       <span className="placeholder col-7 mb-2"></span>
                       <span className="placeholder col-4"></span>
                   </div>
                </div>
             </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card border-dashed border-2 bg-light text-center py-5">
          <div className="card-body">
            <p className="text-muted mb-3">No reports found for this device.</p>
            <Link to="/report" className="btn btn-primary fw-medium">
              Submit your first report
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {issues.map((issue) => (
            <div key={issue.id} className="col-md-6">
              <Link to={`/issues/${issue.id}`} className="card h-100 border-0 shadow-sm text-decoration-none hover-shadow transition">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <div className="small fw-bold text-primary text-uppercase mb-1">
                      {issue.category}
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2 text-truncate" style={{ maxWidth: '300px' }}>
                      {issue.title}
                    </h3>
                    <div className="d-flex align-items-center text-muted small gap-2">
                      <Clock size={14} />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="badge bg-light text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2 fw-bold text-capitalize">
                    {issue.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
