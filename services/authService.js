import Cookies from 'js-cookie';
import ApiService from './api.service';

export const authService = {
  async login(email, password) {
    try {
      const data = await ApiService.login(email, password);
      // Lưu token và role (và tên nếu có) vào cookies
      Cookies.set('token', data.token, { expires: 7 }); // Lưu 7 ngày
      Cookies.set('role', data.role, { expires: 7 });
      if (data.name) {
        Cookies.set('name', data.name, { expires: 7 });
      }
      if (data.companyId) {
        Cookies.set('companyId', data.companyId, { expires: 7 });
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  async register(fullName, email, phone, password) {
    try {
      const userData = {
        fullName,
        email,
        phone,
        password,
        role: '1' // Set default role as user
      };
      const data = await ApiService.register(userData);
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    Cookies.remove('name', { path: '/' });
    Cookies.remove('token', { path: '/', domain: 'localhost' });
    Cookies.remove('role', { path: '/', domain: 'localhost' });
    Cookies.remove('name', { path: '/', domain: 'localhost' });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  },

  getToken() {
    return Cookies.get('token');
  },

  getRole() {
    return Cookies.get('role');
  },

  getName() {
    return Cookies.get('name');
  },

  getCompanyId() {
    return Cookies.get('companyId');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};