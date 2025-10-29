export const MockModeNotification = () => {
  const isDevelopment = import.meta.env.DEV;

  if (!isDevelopment) return null;

  return (
    <div style={styles.notification}>
      <div style={styles.content}>
        <span style={styles.icon}>�</span>
        <div style={styles.text}>
          <strong>Local Storage Mode:</strong> Your data is saved in browser localStorage. 
          <span style={styles.link}>Use the 💾 button to export/import data.</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  notification: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px',
    padding: '12px 16px',
    margin: '16px 0',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#856404',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: '8px',
    fontSize: '16px',
  },
  text: {
    flex: 1,
  },
  link: {
    color: '#0366d6',
    textDecoration: 'none',
    marginLeft: '8px',
    fontWeight: 'bold',
  },
};