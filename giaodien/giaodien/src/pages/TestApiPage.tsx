import React, { useState } from 'react';
import { testApiConnections } from '../services/testApi';
import { API_BASE_URLS } from '../services/apiConfig';

function TestApiPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const testResults = await testApiConnections();
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test API Connections</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>API Endpoints:</h3>
        <ul>
          <li>AuthService: {API_BASE_URLS.auth}</li>
          <li>AdminService: {API_BASE_URLS.admin}</li>
          <li>NongDanService: {API_BASE_URLS.nongdan}</li>
          <li>DaiLyService: {API_BASE_URLS.daily}</li>
          <li>SieuThiService: {API_BASE_URLS.sieuthi}</li>
        </ul>
      </div>

      <button 
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test All Connections'}
      </button>

      {results && (
        <div style={{ marginTop: '30px' }}>
          <h3>Results:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(results).map(([service, status]) => (
              <div 
                key={service}
                style={{
                  padding: '15px',
                  backgroundColor: status ? '#d1fae5' : '#fee2e2',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {service}Service
                </span>
                <span style={{ 
                  color: status ? '#059669' : '#dc2626',
                  fontWeight: 'bold'
                }}>
                  {status ? '✓ Connected' : '✗ Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestApiPage;
