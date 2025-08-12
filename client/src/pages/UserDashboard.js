import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getStoredUser, getToken } from '../utils/auth';
import AddEntryModal from '../components/AddEntryModal';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageModal, setImageModal] = useState({ open: false, imageUrl: '', imageAlt: '' });
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();
    
    if (!token || !user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    // Only make API call if authenticated
    setLoading(true);
    api.get('/api/records/mine')
      .then(({ data }) => {
        setRecords(data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching records:', err);
        setError(err.response?.data?.message || 'Failed to fetch records');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const openImageModal = (imageUrl, date) => {
    setImageModal({
      open: true,
      imageUrl,
      imageAlt: `Bill image for ${date}`
    });
    setImageLoading(true);
  };

  const closeImageModal = () => {
    setImageModal({ open: false, imageUrl: '', imageAlt: '' });
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && imageModal.open) {
        closeImageModal();
      }
    };

    if (imageModal.open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [imageModal.open]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <h2>Loading your electricity records...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>⚡ Electricity Dashboard</h1>
          <p>Manage your electricity meter readings and bills</p>
        </div>
        <button className="add-entry-btn" onClick={() => setOpen(true)}>
          <span className="btn-icon">➕</span>
          Add New Entry
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{records.length}</h3>
            <p>Total Entries</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{records.reduce((sum, r) => sum + r.totalAmount, 0).toFixed(2)}</h3>
            <p>Total Amount</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{records.reduce((sum, r) => sum + r.unitsConsumed, 0)}</h3>
            <p>Total Units</p>
          </div>
        </div>
      </div>

      <div className="records-section">
        <h2>Your Records</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Units</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Bill Image</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-content">
                      <div className="empty-icon">📊</div>
                      <h3>No records yet</h3>
                      <p>Add your first electricity entry to get started!</p>
                      <button onClick={() => setOpen(true)} className="empty-btn">
                        Add First Entry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r._id} className="record-row">
                    <td>
                      <div className="date-cell">
                        <div className="date-main">{new Date(r.createdAt).toLocaleDateString()}</div>
                        <div className="date-time">{new Date(r.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td>{r.previousReading}</td>
                    <td>{r.currentReading}</td>
                    <td>
                      <span className="units-badge">{r.unitsConsumed} units</span>
                    </td>
                    <td>
                      <span className="amount-badge">₹{r.totalAmount.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${r.paymentStatus}`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {r.billImage ? (
                        <button 
                          className="view-bill-btn"
                          onClick={() => openImageModal(r.billImage, new Date(r.createdAt).toLocaleDateString())}
                          title="View bill image"
                        >
                          <span className="btn-icon">📷</span>
                          View
                        </button>
                      ) : (
                        <span className="no-image">No image</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddEntryModal open={open} onClose={() => setOpen(false)} onCreated={(rec) => setRecords((prev) => [rec, ...prev])} />

      {/* Bill Image Modal */}
      {imageModal.open && (
        <div className="modal" onClick={closeImageModal}>
          <div className="modal-content image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bill Image</h3>
              <button className="close-btn" onClick={closeImageModal}>×</button>
            </div>
            <div className="modal-body">
              {imageLoading && (
                <div className="image-loading">
                  <div className="spinner"></div>
                  <p>Loading image...</p>
                </div>
              )}
              <img 
                src={imageModal.imageUrl} 
                alt={imageModal.imageAlt}
                style={{ display: imageLoading ? 'none' : 'block' }}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  setImageLoading(false);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="image-error-modal" style={{ display: 'none' }}>
                <p>Image could not be loaded</p>
                <p>Please check if the image file exists and is accessible.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary" onClick={closeImageModal}>Close</button>
              <button 
                onClick={() => window.open(imageModal.imageUrl, '_blank')}
                title="Open in new tab"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 