import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../services/apiConfig';
import { useAuth } from '../../context/AuthContext';

function TestKho() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    testFlow();
  }, []);

  const testFlow = async () => {
    try {
      addLog('=== BẮT ĐẦU TEST ===');
      addLog(`User: ${JSON.stringify(user)}`);
      addLog(`MaTaiKhoan: ${user?.maTaiKhoan}`);

      // Test 1: Get all daily
      addLog('\n--- TEST 1: GET ALL DAILY ---');
      const dailyRes = await axios.get(API_ENDPOINTS.daiLy.getAll);
      addLog(`Response status: ${dailyRes.status}`);
      addLog(`Response data: ${JSON.stringify(dailyRes.data, null, 2)}`);

      if (dailyRes.data.success && dailyRes.data.data) {
        addLog(`Số lượng đại lý: ${dailyRes.data.data.length}`);
        
        dailyRes.data.data.forEach((dl: any, index: number) => {
          addLog(`Đại lý ${index + 1}: maTaiKhoan=${dl.maTaiKhoan}, maDaiLy=${dl.maDaiLy}, tenDaiLy=${dl.tenDaiLy}`);
        });

        const currentDaily = dailyRes.data.data.find(
          (dl: any) => dl.maTaiKhoan === user?.maTaiKhoan
        );

        if (currentDaily) {
          addLog(`\n✅ TÌM THẤY ĐẠI LÝ HIỆN TẠI:`);
          addLog(`  - maDaiLy: ${currentDaily.maDaiLy}`);
          addLog(`  - tenDaiLy: ${currentDaily.tenDaiLy}`);

          // Test 2: Get kho by daily
          addLog('\n--- TEST 2: GET KHO BY DAILY ---');
          const khoRes = await axios.get(API_ENDPOINTS.kho.getByDaiLy(currentDaily.maDaiLy));
          addLog(`Response status: ${khoRes.status}`);
          addLog(`Response data: ${JSON.stringify(khoRes.data, null, 2)}`);

          if (khoRes.data.success && khoRes.data.data) {
            addLog(`✅ Số lượng kho: ${khoRes.data.data.length}`);
            khoRes.data.data.forEach((kho: any, index: number) => {
              addLog(`Kho ${index + 1}: maKho=${kho.maKho}, tenKho=${kho.tenKho}`);
            });
          } else {
            addLog(`❌ Không có kho hoặc response không đúng`);
          }
        } else {
          addLog(`\n❌ KHÔNG TÌM THẤY ĐẠI LÝ với maTaiKhoan=${user?.maTaiKhoan}`);
        }
      } else {
        addLog(`❌ Response không hợp lệ`);
      }

      addLog('\n=== KẾT THÚC TEST ===');
    } catch (error: any) {
      addLog(`\n❌ LỖI: ${error.message}`);
      addLog(`Error details: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Test Kho API</h1>
      <button onClick={testFlow} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        🔄 Chạy lại test
      </button>
      <div style={{ 
        background: '#000', 
        color: '#0f0', 
        padding: '20px', 
        borderRadius: '8px',
        maxHeight: '600px',
        overflow: 'auto'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '5px', whiteSpace: 'pre-wrap' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestKho;
