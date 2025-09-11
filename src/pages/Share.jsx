import React, { useEffect } from 'react';

const Share = () => {
  useEffect(() => {
    // Redirect to P2P server
    window.location.href = 'http://localhost:3000/share';
  }, []);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        🔄 Redirecting to VieCloud Share...
      </div>
      <div style={{ color: '#666' }}>
        If you're not redirected automatically, 
        <a 
          href="http://localhost:3000/share" 
          style={{ color: '#2196f3', textDecoration: 'none', marginLeft: '5px' }}
        >
          click here
        </a>
      </div>
    </div>
  );
};

export default Share;
