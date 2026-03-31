import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    maTaiKhoan: number;
    tenDangNhap: string;
    loaiTaiKhoan: string;
    token: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

const authService = {
  login: async (tenDangNhap: string, matKhau: string, loaiTaiKhoan: string): Promise<LoginResponse> => {
    try {
      console.log('Login attempt:', { tenDangNhap, loaiTaiKhoan });
      
      const response = await axios.post(API_ENDPOINTS.login, {
        tenDangNhap,
        matKhau
      });

      console.log('Login response:', response.data);

      if (response.data) {
        // Kiểm tra loại tài khoản có khớp không
        // Backend trả về: 'admin', 'nongdan', 'daily', 'sieuthi' (không có underscore)
        // Frontend gửi: 'admin', 'nongdan', 'daily', 'sieuthi' (không có underscore)
        if (response.data.loaiTaiKhoan !== loaiTaiKhoan) {
          console.error('Account type mismatch:', {
            expected: loaiTaiKhoan,
            received: response.data.loaiTaiKhoan
          });
          return {
            success: false,
            message: `Loại tài khoản không đúng! Tài khoản này là ${response.data.loaiTaiKhoan}, không phải ${loaiTaiKhoan}`
          };
        }

        return {
          success: true,
          data: {
            maTaiKhoan: response.data.maTaiKhoan,
            tenDangNhap: tenDangNhap,
            loaiTaiKhoan: response.data.loaiTaiKhoan,
            token: 'dummy-token' // Backend chưa có JWT
          }
        };
      }

      return { success: false, message: 'Đăng nhập thất bại' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Lỗi kết nối đến server'
      };
    }
  },

  register: async (userData: any): Promise<RegisterResponse> => {
    // TODO: Implement register API when backend is ready
    try {
      // Mock implementation
      return {
        success: true,
        message: 'Đăng ký thành công! Vui lòng đăng nhập.'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Đăng ký thất bại'
      };
    }
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    // TODO: Implement forgot password API when backend is ready
    try {
      // Mock implementation
      return {
        success: true,
        message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Không thể gửi email'
      };
    }
  }
};

export default authService;
