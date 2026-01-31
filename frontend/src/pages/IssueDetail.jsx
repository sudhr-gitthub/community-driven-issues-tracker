import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, XCircle, ShieldCheck, ShieldAlert, FileSearch, Trash2, Edit2, Save, X } from 'lucide-react';
import { getIssueById, deleteIssue, updateIssue } from '../services/api';
import MapComponent from '../components/MapComponent';

const statusConfig = {
  REPORTED: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', label: 'Reported' },
  IN_PROGRESS: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'In Progress' },
  RESOLVED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Resolved' },
  REJECTED: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Rejected' },
};

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });
  
  const currentUserId = localStorage.getItem('civic_user_id');

  useEffect(() => {
    if (id) {
      loadIssue();
    }
  }, [id]);

  const loadIssue = () => {
    getIssueById(id)
        .then(data => {
          setIssue(data);
          setEditForm({ 
            title: data.title, 
            description: data.description || '', 
            category: data.category 
          });
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await deleteIssue(id);
        alert('Report deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete report');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateIssue(id, editForm);
      setIssue(prev => prev ? { ...prev, ...updated } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update report');
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading details...</div>;
  if (!issue) return <div className="p-8 text-center text-red-500">Issue not found.</div>;

  const StatusIcon = statusConfig[issue.status] ? statusConfig[issue.status].icon : AlertTriangle;
  // Fallback for missing status config
  const statusColor = statusConfig[issue.status] ? statusConfig[issue.status].color : 'text-gray-600';
  const statusLabel = statusConfig[issue.status] ? statusConfig[issue.status].label : issue.status;

  const isOwner = currentUserId === issue.reportedBy || currentUserId === 'admin_id_placeholder'; 

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <Link to="/" className="text-decoration-none text-muted d-inline-flex align-items-center fw-medium hover-text-primary hover-scale transition-all origin-left">
              <ArrowLeft size={18} className="me-1" />
              Back to Feed
            </Link>

            {isOwner && !isEditing && (
              <div className="d-flex gap-2">
                 <button onClick={() => setIsEditing(true)} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 hover-scale transition-all">
                   <Edit2 size={16} /> Edit
                 </button>
                 <button onClick={handleDelete} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 hover-scale transition-all">
                   <Trash2 size={16} /> Delete
                 </button>
              </div>
            )}
           
            {isEditing && (
              <div className="d-flex gap-2">
                 <button onClick={handleUpdate} className="btn btn-primary btn-sm d-flex align-items-center gap-1 hover-scale transition-all">
                   <Save size={16} /> Save
                 </button>
                 <button onClick={() => setIsEditing(false)} className="btn btn-light btn-sm d-flex align-items-center gap-1 hover-scale transition-all">
                   <X size={16} /> Cancel
                 </button>
              </div>
            )}
          </div>

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden hover-lift transition-all">
            {/* Status Header */}
            <div className={`card-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between ${
                issue.status === 'RESOLVED' ? 'bg-success bg-opacity-10' :
                issue.status === 'IN_PROGRESS' ? 'bg-warning bg-opacity-10' :
                issue.status === 'REJECTED' ? 'bg-secondary bg-opacity-10' :
                'bg-danger bg-opacity-10'
              }`}>
               <div className="d-flex align-items-center gap-2">
                 <StatusIcon size={20} className={statusColor.replace('text-', 'text-')} />
                 <span className={`fw-bold ${statusColor.replace('text-', 'text-')}`}>{statusLabel}</span>
               </div>
               <span className="small text-muted fw-bold text-uppercase opacity-75">ID: {issue.id.slice(0, 8)}</span>
            </div>

            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <div className="small fw-bold text-primary text-uppercase letter-spacing-1 mb-2">
                   {isEditing ? (
                     <select 
                       className="form-select form-select-sm w-auto"
                       value={editForm.category}
                       onChange={e => setEditForm({...editForm, category: e.target.value})}
                     >
                       {['Road', 'Water', 'Electricity', 'Sanitation', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   ) : issue.category}
                </div>
                
                {isEditing ? (
                  <input 
                    type="text" 
                    className="form-control form-control-lg fw-bold mb-3" 
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                  />
                ) : (
                  <h1 className="h2 fw-bold text-dark mb-3">
                    {issue.title}
                  </h1>
                )}

                <div className="d-flex flex-wrap items-center text-muted small gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                     <MapPin size={16} />
                     <span>Location Data</span>
                  </div>
                </div>
              </div>

              {/* AI Verification Badge */}
              <div className={`mb-5 p-4 rounded-3 border ${
                issue.aiStatus === 'REAL' ? 'bg-success bg-opacity-10 border-success border-opacity-25' : 
                issue.aiStatus === 'FAKE' ? 'bg-danger bg-opacity-10 border-danger border-opacity-25' :
                'bg-light border-secondary border-opacity-25'
              }`}>
                <div className="d-flex align-items-start gap-3">
                  <div className={`p-2 rounded-circle ${
                     issue.aiStatus === 'REAL' ? 'bg-success text-white' : 
                     issue.aiStatus === 'FAKE' ? 'bg-danger text-white' :
                     'bg-secondary text-white'
                  }`}>
                    {issue.aiStatus === 'REAL' ? <ShieldCheck size={24} /> : 
                     issue.aiStatus === 'FAKE' ? <ShieldAlert size={24} /> :
                     <FileSearch size={24} />}
                  </div>
                  <div>
                    <h4 className={`h6 fw-bold mb-1 ${
                       issue.aiStatus === 'REAL' ? 'text-success' : 
                       issue.aiStatus === 'FAKE' ? 'text-danger' :
                       'text-secondary'
                    }`}>
                      AI Integrity Check: {issue.aiStatus}
                    </h4>
                    <p className="mb-2 small opacity-75">
                      {issue.aiAnalysis || 'Pending analysis...'}
                    </p>
                    {issue.aiConfidence && (
                      <div className="d-flex align-items-center gap-2 small fw-bold opacity-75">
                         <span>Confidence: {(issue.aiConfidence * 100).toFixed(1)}%</span>
                         <div className="progress flex-grow-1" style={{ width: '100px', height: '6px' }}>
                           <div 
                             className={`progress-bar ${
                               issue.aiStatus === 'REAL' ? 'bg-success' : 
                               issue.aiStatus === 'FAKE' ? 'bg-danger' :
                               'bg-secondary'
                             }`} 
                             role="progressbar" 
                             style={{ width: `${issue.aiConfidence * 100}%` }}
                           ></div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h3 className="h6 fw-bold text-dark text-uppercase mb-3 border-bottom pb-2">Description</h3>
                {isEditing ? (
                  <textarea 
                    className="form-control" 
                    rows={4}
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                ) : (
                  <p className="text-secondary leading-relaxed lead fs-6">
                    {issue.description || 'No description provided.'}
                  </p>
                )}
              </div>

              {/* Map/Photos */}
              <div className="row g-3">
                 <div className="col-md-6">
                   <div className="bg-light rounded-3 p-5 d-flex align-items-center justify-content-center border border-dashed border-2" style={{ height: '300px' }}>
                      <span className="text-muted fw-medium small">Photo Verification</span>
                   </div>
                 </div>
                 <div className="col-md-6">
                   <div className="card border-0 shadow-sm rounded-3 overflow-hidden hover-lift transition-all" style={{ height: '300px' }}>
                      <MapComponent 
                        center={{ lat: issue.location?.coordinates?.[1] || 40.7128, lng: issue.location?.coordinates?.[0] || -74.0060 }}
                        zoom={15}
                        markers={[{ lat: issue.location?.coordinates?.[1] || 40.7128, lng: issue.location?.coordinates?.[0] || -74.0060 }]}
                      />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
