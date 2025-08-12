import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getStoredUser, getToken } from '../utils/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [imageModal, setImageModal] = useState({ open: false, imageUrl: '', imageAlt: '' });
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();
    
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Only make API call if authenticated
    setLoading(true);
    const url = statusFilter ? `/api/admin/records?status=${statusFilter}` : '/api/admin/records';
    api.get(url)
      .then(({ data }) => {
        setRecords(data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching admin records:', err);
        setError(err.response?.data?.message || 'Failed to fetch records');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/records/${id}/payment`, { status });
      setRecords((prev) => prev.map((r) => (r._id === id ? { ...r, paymentStatus: status } : r)));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update payment status');
    }
  };

  const exportRecords = () => {
    const csvContent = [
      ['Date', 'User', 'Meter Number', 'Previous Reading', 'Current Reading', 'Units', 'Amount', 'Due Date', 'Status', 'Payment Date', 'Remarks'],
      ...records.map(r => [
        new Date(r.createdAt).toLocaleDateString(),
        r.user?.name || '',
        r.user?.meterNumber || '',
        r.previousReading,
        r.currentReading,
        r.unitsConsumed,
        r.totalAmount.toFixed(2),
        r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '',
        r.paymentStatus,
        r.paymentDate ? new Date(r.paymentDate).toLocaleDateString() : '',
        r.remarks || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electricity-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openImageModal = (imageUrl, userName, meterNumber) => {
    setImageModal({
      open: true,
      imageUrl,
      imageAlt: `Bill image for ${userName} (${meterNumber})`
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
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [imageModal.open]);

  if (loading) {
    return (
      <div className="card">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="header">
        <h2>Admin Dashboard</h2>
      </div>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select 
            id="statusFilter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="filter-actions">
          <div className="filter-info">
            Showing {records.length} record{records.length !== 1 ? 's' : ''}
          </div>
          <button 
            className="export-btn" 
            onClick={exportRecords}
            disabled={records.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Previous</th>
            <th>Current</th>
            <th>Units</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Bill Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                No records found.
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.user?.name} ({r.user?.meterNumber})</td>
                <td>{r.previousReading}</td>
                <td>{r.currentReading}</td>
                <td>{r.unitsConsumed}</td>
                <td>{r.totalAmount.toFixed(2)}</td>
                <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`status-${r.paymentStatus}`}>
                    {r.paymentStatus}
                  </span>
                  {r.paymentDate && r.paymentStatus === 'paid' && (
                    <div className="payment-date">
                      Paid: {new Date(r.paymentDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="remarks-cell" title={r.remarks || 'No remarks'}>
                  {r.remarks || '-'}
                </td>
                <td>
                  {r.billImage ? (
                    <div className="image-container">
                      <button 
                        className="view-image-btn" 
                        onClick={() => openImageModal(r.billImage, r.user?.name, r.user?.meterNumber)}
                        title="Click to view bill image"
                      >
                        View Image
                      </button>
                      <div className="image-preview">
                        <img 
                          src={r.billImage} 
                          alt="Bill preview" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <span className="image-error" style={{ display: 'none' }}>
                          Image not available
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>No image</span>
                  )}
                </td>
                <td>
                  <select value={r.paymentStatus} onChange={(e) => updateStatus(r._id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="overdue">overdue</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Image Modal */}
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