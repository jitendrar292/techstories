import { useState } from 'react';
import { localStorageDB } from '../lib/localStorage';

export const DataManager = () => {
  const [showManager, setShowManager] = useState(false);
  const [importData, setImportData] = useState('');
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const data = localStorageDB.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-blog-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('✅ Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = () => {
    try {
      const success = localStorageDB.importData(importData);
      if (success) {
        setMessage('✅ Data imported successfully! Refresh the page to see changes.');
        setImportData('');
      } else {
        setMessage('❌ Import failed. Please check the JSON format.');
      }
    } catch (error) {
      setMessage('❌ Import failed. Invalid JSON data.');
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      localStorageDB.clearAllData();
      setMessage('🧹 All data cleared! Refresh the page to reset to default data.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (!showManager) {
    return (
      <button 
        onClick={() => setShowManager(true)} 
        style={styles.toggleButton}
        title="Data Management"
      >
        💾
      </button>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Data Management</h3>
          <button 
            onClick={() => setShowManager(false)} 
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>
        
        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <div style={styles.section}>
          <h4>Export Data</h4>
          <p>Download your blog data as a JSON file for backup.</p>
          <button onClick={handleExport} style={styles.button}>
            📥 Export All Data
          </button>
        </div>

        <div style={styles.section}>
          <h4>Import Data</h4>
          <p>Upload a previously exported JSON file to restore your data.</p>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your JSON data here..."
            style={styles.textarea}
          />
          <button 
            onClick={handleImport} 
            disabled={!importData.trim()}
            style={styles.button}
          >
            📤 Import Data
          </button>
        </div>

        <div style={styles.section}>
          <h4>Reset</h4>
          <p style={styles.warning}>⚠️ This will delete all your posts and data!</p>
          <button onClick={handleClearAll} style={styles.dangerButton}>
            🗑️ Clear All Data
          </button>
        </div>

        <div style={styles.info}>
          <h4>💡 About Data Storage</h4>
          <p>
            Your blog data is stored in your browser's localStorage. This means:
          </p>
          <ul>
            <li>✅ Data persists between sessions</li>
            <li>✅ Works offline</li>
            <li>✅ No server required</li>
            <li>⚠️ Data is local to this browser</li>
            <li>⚠️ Clearing browser data will delete your posts</li>
          </ul>
          <p>
            <strong>Tip:</strong> Export your data regularly as a backup!
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  toggleButton: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px',
  },
  section: {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '8px',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '8px',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical' as const,
    marginBottom: '8px',
  },
  message: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    color: '#155724',
  },
  warning: {
    color: '#dc3545',
    fontWeight: 'bold' as const,
  },
  info: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '4px',
    fontSize: '14px',
  },
};