import Cookies from 'js-cookie';

const API_URL = 'https://localhost:7266/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      // Lưu token và role (và tên nếu có) vào cookies
      Cookies.set('token', data.token, { expires: 7 }); // Lưu 7 ngày
      Cookies.set('role', data.role, { expires: 7 });
      if (data.name) { // Giả định API trả về tên người dùng
        Cookies.set('name', data.name, { expires: 7 });
      }
      return data; // Trả về dữ liệu để component gọi xử lý và dispatch
    } catch (error) {
      throw error;
    }
  },

  async register(email, password, role) {
    try {
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('name'); // Xóa tên khỏi cookie khi logout
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

  isAuthenticated() {
    return !!this.getToken();
  }
};