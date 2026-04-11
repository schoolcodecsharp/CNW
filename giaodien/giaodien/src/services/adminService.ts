import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

// Admin Service
export const adminService = {
  // Admin
  getAllAdmin: async () => {
    const response = await axios.get(API_ENDPOINTS.admin.getAll);
    return response.data;
  },

  getAdminById: async (id: number) => {
    const response = await axios.get(API_ENDPOINTS.admin.getById(id));
    return response.data;
  },

  createAdmin: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.admin.create, data);
    return response.data;
  },

  updateAdmin: async (id: number, data: any) => {
    const response = await axios.put(API_ENDPOINTS.admin.update(id), data);
    return response.data;
  },

  deleteAdmin: async (id: number) => {
    const response = await axios.delete(API_ENDPOINTS.admin.delete(id));
    return response.data;
  },

  // Health check
  checkHealth: async () => {
    const response = await axios.get(API_ENDPOINTS.admin.health);
    return response.data;
  }
};

export default adminService;
