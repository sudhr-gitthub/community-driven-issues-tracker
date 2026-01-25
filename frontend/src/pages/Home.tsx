import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIssues } from '../services/api';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import MapComponent from '../components/MapComponent';

interface Issue {
  id: string;
  title: string;
  category: string;
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  location: any;
  createdAt: string;
}

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIssues()
      .then((data) => setIssues(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'bg-status-reported/10 text-status-reported border-status-reported/20';
      case 'IN_PROGRESS': return 'bg-status-inprogress/10 text-status-inprogress border-status-inprogress/20';
      case 'RESOLVED': return 'bg-status-resolved/10 text-status-resolved border-status-resolved/20';
      default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-5 text-center text-md-start">
        <h1 className="display-6 fw-bold text-dark">Community Issues</h1>
        <p className="text-secondary lead fs-6">Updates on local infrastructure and services.</p>
      </header>

      {/* Map View */}
      <div className="card border-0 shadow-sm mb-5 rounded-4 overflow-hidden" style={{ height: '400px' }}>
        <MapComponent 
          markers={issues.map(i => ({ 
            lat: (i.location as any)?.coordinates?.[1] || 40.7128, 
            lng: (i.location as any)?.coordinates?.[0] || -74.0060,
            id: i.id 
          }))}
        />
      </div>

      {/* Issue Feed */}
      <div className="row g-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
               <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 placeholder-glow">
                     <span className="placeholder col-7 mb-3"></span>
                     <span className="placeholder col-4"></span>
                     <div className="mt-4">
                        <span className="placeholder col-12 mb-2"></span>
                        <span className="placeholder col-8"></span>
                     </div>
                  </div>
               </div>
            </div>
          ))
        ) : issues.length === 0 ? (
          <div className="col-12">
            <div className="card border-dashed border-2 bg-light text-center py-5">
              <div className="card-body">
                 <AlertCircle size={40} className="text-muted mb-3 mx-auto" />
                 <h5 className="text-secondary fw-bold">No issues reported yet.</h5>
                 <p className="text-muted small">Be the first to create a report!</p>
              </div>
            </div>
          </div>
        ) : (
          issues.map((issue) => (
            <div className="col-md-6 col-lg-4" key={issue.id}>
              <Link to={`/issues/${issue.id}`} className="card h-100 border-0 shadow-sm text-decoration-none hover-up transition overflow-hidden">
                <div className="position-relative bg-light" style={{ height: '160px' }}>
                  {/* Image Placeholder */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small fw-medium">
                    No Image
                  </div>
                  <div className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-bold border ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="small fw-bold text-primary text-uppercase letter-spacing-1 mb-2">
                    {issue.category}
                  </div>
                  <h3 className="h5 fw-bold text-dark mb-3 text-truncate">
                    {issue.title}
                  </h3>
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-light">
                    <div className="d-flex align-items-center text-muted small gap-1">
                      <Clock size={14} />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Distance Placeholder */}
                    <div className="d-flex align-items-center text-muted small gap-1">
                      <MapPin size={14} />
                      <span>0.5 km</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
