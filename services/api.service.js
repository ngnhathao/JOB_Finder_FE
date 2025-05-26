import API_CONFIG from '../config/api.config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7266/api';

// Định nghĩa class trước
class ApiServiceClass {
  // Auth APIs
  static async login(email, password) {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
    const options = API_CONFIG.getRequestOptions('POST', { email, password });
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  static async register(userData) {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER);
    const options = API_CONFIG.getRequestOptions('POST', userData);
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  // User APIs
  static async getUsers(params) {
    const url = API_CONFIG.getUrlWithParams(API_CONFIG.ENDPOINTS.USER.BASE, params);
    const options = API_CONFIG.getRequestOptions();
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  static async getUserById(id) {
    const url = API_CONFIG.getUrl(`${API_CONFIG.ENDPOINTS.USER.BASE}/${id}`);
    const options = API_CONFIG.getRequestOptions();
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  static async updateUser(id, userData) {
    const url = API_CONFIG.getUrl(`${API_CONFIG.ENDPOINTS.USER.BASE}/${id}`);
    let options;
    if (userData instanceof FormData) {
      options = {
        method: 'PUT',
        body: userData
        // KHÔNG set Content-Type, browser sẽ tự động set boundary cho multipart/form-data
      };
    } else {
      options = API_CONFIG.getRequestOptions('PUT', userData);
    }
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  // Job APIs
  static async getJobs(params) {
    const url = API_CONFIG.getUrlWithParams(API_CONFIG.ENDPOINTS.JOB.BASE, params);
    const options = API_CONFIG.getRequestOptions();
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  static async createJob(jobData) {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.JOB.CREATE);
    let options;
    if (jobData instanceof FormData) {
      options = {
        method: 'POST',
        body: jobData
        // KHÔNG set Content-Type, browser sẽ tự động set boundary cho multipart/form-data
      };
    } else {
      options = API_CONFIG.getRequestOptions('POST', jobData);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Company APIs
  static async getCompanies(params) {
    const url = API_CONFIG.getUrlWithParams(API_CONFIG.ENDPOINTS.COMPANY.BASE, params);
    const options = API_CONFIG.getRequestOptions();
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  static async verifyCompany(id) {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.COMPANY.VERIFY(id));
    const options = API_CONFIG.getRequestOptions('PATCH');
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  // Master Data APIs
  static async getMasterData(type) {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MASTER_DATA[type]);
    const options = API_CONFIG.getRequestOptions();
    return API_CONFIG.handleResponse(await fetch(url, options));
  }

  // Generic method để xử lý các API calls khác
  static async request(endpoint, method = 'GET', data = null, params = null) {
    const url = API_CONFIG.getUrlWithParams(endpoint, params);
    const options = API_CONFIG.getRequestOptions(method, data);
    return API_CONFIG.handleResponse(await fetch(url, options));
  }
}

// Sau đó tạo object từ class
const ApiService = {
  get: (endpoint) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(async res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    });
  },
  post: (endpoint, data) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(async res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    });
  },
  login: ApiServiceClass.login,
  register: ApiServiceClass.register,
  getCompanies: ApiServiceClass.getCompanies,
  verifyCompany: ApiServiceClass.verifyCompany,
  getMasterData: ApiServiceClass.getMasterData,
  getUsers: ApiServiceClass.getUsers,
  getUserById: ApiServiceClass.getUserById,
  updateUser: ApiServiceClass.updateUser,
  request: ApiServiceClass.request,
  createJob: ApiServiceClass.createJob,
  addUser: async (formData) => {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.USER.BASE);
    const options = {
      method: 'POST',
      body: formData
      // KHÔNG set Content-Type, browser sẽ tự động set boundary cho multipart/form-data
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  deleteUser: async (id) => {
    const url = API_CONFIG.getUrl(`${API_CONFIG.ENDPOINTS.USER.BASE}/${id}`);
    const options = { method: 'DELETE' };
    return fetch(url, options);
  }
};

export default ApiService; 