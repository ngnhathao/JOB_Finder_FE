import axios from "axios";

const API_URL = "https://localhost:7266/api";

export const companyService = {
  async getCompanyById(companyId) {
    try {
      // Lấy danh sách công ty và tìm công ty theo ID
      const response = await axios.get(`${API_URL}/CompanyProfile`);
      const companies = response.data;
      const company = companies.find(c => c.userId === parseInt(companyId));
      
      if (!company) {
        throw new Error('Company not found');
      }
      
      return company;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }
}; 