import axios from "axios";

const API_URL = "https://localhost:7266/api";

// Hàm lấy token từ localStorage hoặc cookie
function getToken() {
  let token = localStorage.getItem('token');
  if (token) return token;
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  if (match) return match[2];
  return null;
}

export const companyService = {
  async getCompanyById(companyId) {
    try {
      const response = await axios.get(`${API_URL}/Company/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },
  getFavoriteCompanies: async () => {
    try {
      const token = getToken();
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      // Log config để kiểm tra
     
  
      const response = await axios.get(`${API_URL}/Application/my-favorite-companies`, config);
    
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite companies:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error;
    }
  },

  unfavoriteCompany: async (companyId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      // Đúng endpoint backend của bạn
      const response = await axios.delete(
        `${API_URL}/Application/favorite-company/${companyId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error unfavoriting company:", error);
      throw error;
    }
  },
}; 