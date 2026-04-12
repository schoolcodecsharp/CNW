import React, { useState } from 'react';
import { 
  nongdanService, 
  dailyService, 
  sieuthiService, 
  adminService 
} from '../services';

function ApiDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async (apiCall: () => Promise<any>, name: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await apiCall();
      setResult({ name, data, success: true });
    } catch (err: any) {
      setError(err.message || 'API call failed');
      setResult({ name, error: err.response?.data || err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>API Demo - Test Kết Nối</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
        {/* Nông Dân APIs */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#10b981' }}>Nông Dân Service</h3>
          <button onClick={() => testApi(nongdanService.getAllNongDan, 'Get All Nông Dân')}>
            Get All Nông Dân
          </button>
          <button onClick={() => testApi(nongdanService.getAllTrangTrai, 'Get All Trang Trại')}>
            Get All Trang Trại
          </button>
          <button onClick={() => testApi(nongdanService.getAllLoNongSan, 'Get All Lô Nông Sản')}>
            Get All Lô Nông Sản
          </button>
          <button onClick={() => testApi(nongdanService.getAllSanPham, 'Get All Sản Phẩm')}>
            Get All Sản Phẩm
          </button>
        </div>

        {/* Đại Lý APIs */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#3b82f6' }}>Đại Lý Service</h3>
          <button onClick={() => testApi(dailyService.getAllDaiLy, 'Get All Đại Lý')}>
            Get All Đại Lý
          </button>
          <button onClick={() => testApi(dailyService.getAllKho, 'Get All Kho')}>
            Get All Kho
          </button>
          <button onClick={() => testApi(dailyService.getAllDonHangDaiLy, 'Get All Đơn Hàng')}>
            Get All Đơn Hàng
          </button>
          <button onClick={() => testApi(dailyService.getAllKiemDinh, 'Get All Kiểm Định')}>
            Get All Kiểm Định
          </button>
          <button onClick={() => testApi(dailyService.getAllTonKho, 'Get All Tồn Kho')}>
            Get All Tồn Kho
          </button>
        </div>

        {/* Siêu Thị APIs */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#f59e0b' }}>Siêu Thị Service</h3>
          <button onClick={() => testApi(sieuthiService.getAllSieuThi, 'Get All Siêu Thị')}>
            Get All Siêu Thị
          </button>
          <button onClick={() => testApi(sieuthiService.getAllDonHangSieuThi, 'Get All Đơn Hàng ST')}>
            Get All Đơn Hàng
          </button>
        </div>

        {/* Admin APIs */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#ef4444' }}>Admin Service</h3>
          <button onClick={() => testApi(adminService.getAllAdmin, 'Get All Admin')}>
            Get All Admin
          </button>
          <button onClick={() => testApi(adminService.checkHealth, 'Health Check')}>
            Health Check
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p>Loading...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: result.success ? '#d1fae5' : '#fee2e2', 
          borderRadius: '8px' 
        }}>
          <h4 style={{ color: result.success ? '#059669' : '#dc2626' }}>
            {result.name} - {result.success ? 'Success ✓' : 'Failed ✗'}
          </h4>
          <pre style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '5px', 
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result.data || result.error, null, 2)}
          </pre>
        </div>
      )}

      <style>{`
        button {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover {
          background-color: #059669;
        }
        button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default ApiDemo;
