import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AddEntryModal({ open, onClose, onCreated }) {
  const [previous, setPrevious] = useState(0);
  const [current, setCurrent] = useState('');
  const [ratePerUnit, setRatePerUnit] = useState('8');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      setLoading(true);
      api.get('/api/records/last')
        .then(({ data }) => {
          setPrevious(data?.currentReading || 0);
        })
        .catch((err) => {
          console.error('Error fetching last record:', err);
          setError('Failed to fetch previous reading');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  const validateForm = () => {
    if (!current || current <= 0) {
      setError('Current reading must be greater than 0');
      return false;
    }
    if (Number(current) <= Number(previous)) {
      setError('Current reading must be greater than previous reading');
      return false;
    }
    if (!dueDate) {
      setError('Due date is required');
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('currentReading', current);
      form.append('ratePerUnit', ratePerUnit);
      form.append('dueDate', dueDate);
      form.append('remarks', remarks);
      if (file) form.append('billImage', file);
      
      console.log('Submitting form data:', {
        currentReading: current,
        ratePerUnit,
        dueDate,
        remarks,
        hasFile: !!file
      });

      const { data } = await api.post('/api/records', form, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      console.log('Record created successfully:', data);
      onCreated(data);
      onClose();
      setCurrent(''); 
      setDueDate(''); 
      setRemarks(''); 
      setFile(null);
    } catch (err) {
      console.error('Error creating record:', err);
      setError(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content entry-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Add New Electricity Entry</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={submit} className="entry-form">
          <div className="form-row">
            <div className="form-group">
              <label>Previous Reading</label>
              <div className="input-wrapper">
                <span className="input-icon">🔢</span>
                <input 
                  value={previous} 
                  disabled 
                  className="disabled-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Current Reading</label>
              <div className="input-wrapper">
                <span className="input-icon">📈</span>
                <input 
                  type="number" 
                  value={current} 
                  onChange={(e) => setCurrent(e.target.value)} 
                  required 
                  min={previous + 1}
                  placeholder="Enter current reading"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rate Per Unit (₹)</label>
              <div className="input-wrapper">
                <span className="input-icon">💰</span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={ratePerUnit} 
                  onChange={(e) => setRatePerUnit(e.target.value)} 
                  placeholder="8.00"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Bill Image</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files[0])}
                id="bill-image"
                className="file-input"
              />
              <label htmlFor="bill-image" className="file-input-label">
                <span className="file-icon">📷</span>
                <span className="file-text">
                  {file ? file.name : 'Choose bill image'}
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Remarks (Optional)</label>
            <div className="input-wrapper">
              <span className="input-icon">💬</span>
              <input 
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)} 
                placeholder="Any additional notes..."
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 