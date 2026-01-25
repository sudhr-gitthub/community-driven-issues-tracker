import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { createIssue } from '../services/api';
import MapComponent from '../components/MapComponent';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    images: string[];
  }>({
    title: '',
    description: '',
    category: 'Road',
    latitude: 0,
    longitude: 0,
    images: [],
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const { uploadFile } = await import('../services/api');
        const data = await uploadFile(file);
        setFormData(prev => ({ ...prev, images: [data.url] }));
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload file");
      } finally {
        setUploading(false);
      }
    }
  };

  const categories = ['Road', 'Water', 'Electricity', 'Sanitation', 'Other'];

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => console.error("Location error", error)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createIssue(formData);
      // Mock Auth: Save the user ID associated with this issue
      if (data.reportedBy) {
        localStorage.setItem('civic_user_id', data.reportedBy);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to submit issue', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="bg-primary text-white p-4 rounded-top d-md-none">
            <h1 className="h4 fw-bold mb-1">New Report</h1>
            <p className="mb-0 small opacity-75">Help improve our community.</p>
          </div>

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden hover-lift transition-all">
            <div className="card-body p-4 p-md-5">
              <div className="d-none d-md-block mb-4">
                <h1 className="h3 fw-bold text-dark">Report an Issue</h1>
                <p className="text-muted">Details help us fix problems faster.</p>
              </div>

              <form onSubmit={handleSubmit}>
                
                {/* Media Upload */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Evidence (Photo/Video)</label>
                  <div className="border-2 border-dashed border-secondary border-opacity-25 rounded-3 p-4 bg-light text-center hover-glow transition-all">
                    <input
                      type="file"
                      id="media-upload"
                      className="d-none"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                    
                    {!formData.images?.[0] ? (
                      <label htmlFor="media-upload" className="cursor-pointer d-block">
                        {uploading ? (
                          <div className="py-4">
                            <Loader2 className="animate-spin text-primary mb-2 mx-auto" size={32} />
                            <span className="text-primary fw-bold">Uploading...</span>
                          </div>
                        ) : (
                          <div className="py-4 hover-opacity-75 transition">
                             <Camera className="mb-2 text-primary mx-auto" size={40} />
                             <span className="fw-medium text-secondary d-block">Tap to upload photo or video</span>
                             <span className="small text-muted mt-1">(Max 2GB)</span>
                          </div>
                        )}
                      </label>
                    ) : (
                      <div className="position-relative d-inline-block">
                        {formData.images[0].match(/\.(mp4|webm|ogg)$/i) || formData.images[0].includes('video') ? (
                          <video 
                            src={formData.images[0]} 
                            className="img-fluid rounded-3 shadow-sm" 
                            style={{ maxHeight: '200px' }} 
                            controls 
                          />
                        ) : (
                          <img 
                            src={formData.images[0]} 
                            alt="Evidence" 
                            className="img-fluid rounded-3 shadow-sm" 
                            style={{ maxHeight: '200px' }} 
                          />
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-1"
                          onClick={() => setFormData({...formData, images: []})}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                  <div className="d-flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`btn btn-sm ${
                          formData.category === cat
                            ? 'btn-outline-primary active'
                            : 'btn-outline-secondary'
                        } rounded-pill px-3 hover-scale transition-all`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Title</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-lg"
                    placeholder="e.g., Pothole on Main St"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe the issue..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Location Trigger */}
                <div className="card bg-light border-0 mb-4 overflow-hidden">
                  <div className="card-body p-0">
                    <div style={{ height: '300px' }}>
                       <MapComponent 
                         center={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
                         zoom={15}
                         onMapClick={(e) => {
                           if (e.latLng) {
                             setFormData({...formData, latitude: e.latLng.lat(), longitude: e.latLng.lng() });
                           }
                         }}
                         markers={formData.latitude ? [{ lat: formData.latitude, lng: formData.longitude }] : []}
                       />
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-between border-top">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="fw-bold mb-0 text-dark">Selected Location</p>
                          <p className="text-muted small mb-0">
                            {formData.latitude ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}` : 'Tap on map or use Detect'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={detectLocation}
                        className="btn btn-sm btn-outline-primary fw-bold"
                      >
                        Use Current Location
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
