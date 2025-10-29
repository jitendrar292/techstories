import { useState, useEffect } from 'react';
import { localStorageDB } from '../lib/localStorage';

export const StorageStatus = () => {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    dataSize: '0 KB'
  });

  useEffect(() => {
    const updateStats = () => {
      const posts = localStorageDB.getPosts();
      const categories = localStorageDB.getCategories();
      
      // Calculate approximate storage size
      const data = localStorageDB.exportData();
      const sizeInBytes = new Blob([data]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(1);
      
      setStats({
        posts: posts.length,
        categories: categories.length,
        dataSize: `${sizeInKB} KB`
      });
    };

    updateStats();
    
    // Update every 5 seconds
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.stat}>
        <span style={styles.icon}>📝</span>
        <span>{stats.posts} posts</span>
      </div>
      <div style={styles.stat}>
        <span style={styles.icon}>📁</span>
        <span>{stats.categories} categories</span>
      </div>
      <div style={styles.stat}>
        <span style={styles.icon}>💾</span>
        <span>{stats.dataSize}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#666',
    alignItems: 'center',
    margin: '16px 0',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  icon: {
    fontSize: '12px',
  },
};