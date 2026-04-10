import axios from 'axios';
import { API_BASE_URLS } from './apiConfig';

// Test kết nối đến các services
export const testApiConnections = async () => {
  const results = {
    auth: false,
    admin: false,
    nongdan: false,
    daily: false,
    sieuthi: false
  };

  try {
    // Test AuthService
    const authResponse = await axios.get(`${API_BASE_URLS.auth}/api/Auth/health`, { timeout: 3000 });
    results.auth = authResponse.status === 200;
  } catch (error) {
    console.error('AuthService connection failed:', error);
  }

  try {
    // Test AdminService
    const adminResponse = await axios.get(`${API_BASE_URLS.admin}/api/Admin`, { timeout: 3000 });
    results.admin = adminResponse.status === 200 || adminResponse.status === 404;
  } catch (error) {
    console.error('AdminService connection failed:', error);
  }

  try {
    // Test NongDanService
    const nongdanResponse = await axios.get(`${API_BASE_URLS.nongdan}/api/nong-dan/get-all`, { timeout: 3000 });
    results.nongdan = nongdanResponse.status === 200;
  } catch (error) {
    console.error('NongDanService connection failed:', error);
  }

  try {
    // Test DaiLyService
    const dailyResponse = await axios.get(`${API_BASE_URLS.daily}/api/dai-ly/get-all`, { timeout: 3000 });
    results.daily = dailyResponse.status === 200;
  } catch (error) {
    console.error('DaiLyService connection failed:', error);
  }

  try {
    // Test SieuThiService
    const sieuthiResponse = await axios.get(`${API_BASE_URLS.sieuthi}/api/sieu-thi/get-all`, { timeout: 3000 });
    results.sieuthi = sieuthiResponse.status === 200;
  } catch (error) {
    console.error('SieuThiService connection failed:', error);
  }

  return results;
};
