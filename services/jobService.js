import axios from "axios";

const API_URL = "https://localhost:7266/api";

// Cấu hình axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Danh sách job types mẫu
const JOB_TYPES = [
  { type: "Full Time", styleClass: "time" },
  { type: "Part Time", styleClass: "privacy" },
  { type: "Freelance", styleClass: "urgent" },
  { type: "Temporary", styleClass: "time" }
];

// Danh sách categories mẫu
const CATEGORIES = [
  "Design",
  "Development",
  "Marketing",
  "Business",
  "Technology",
  "Finance",
  "Healthcare",
  "Education"
];

export const jobService = {
  getJobs: async (filters = {}) => {
    try {
      // Hoàn tác: Gọi lại endpoint /api/Job và loại bỏ truyền filters tùy chỉnh
      console.log('Calling backend API at endpoint /api/Job'); // Log endpoint gọi đi
      const response = await axios.get(`${API_URL}/Job`); // Gọi endpoint /api/Job

      const apiJobs = response.data; // Phản hồi có vẻ là mảng trực tiếp

      console.log('Raw API response data for getJobs:', apiJobs); // Thêm log dữ liệu thô nhận được

      // Ánh xạ dữ liệu từ API sang cấu trúc frontend mong đợi
      const jobs = apiJobs.map(job => ({
        id: job.jobId, // Sử dụng jobId từ API
        jobTitle: job.title,
        description: job.description,
        // company: job.companyId, // Frontend có thể cần fetch tên công ty riêng nếu cần
        location: `${job.addressDetail || ''}${job.addressDetail && job.provinceName ? ', ' : ''}${job.provinceName || ''}`.trim(), // Xử lý trường hợp thiếu addressDetail hoặc provinceName
        provinceName: job.provinceName, // Add provinceName field
        // time: job.createdAt, // Có thể dùng createdAt để hiển thị thời gian đăng
        salary: `${job.salary} USD`, // Giữ định dạng chuỗi nếu frontend hiển thị như vậy
        totalSalary: { min: job.salary, max: job.salary }, // Lấy giá trị số từ API
        logo: job.imageJob || '/images/company-logo/default-logo.png',

        // Các trường ID và dữ liệu khác từ API
        companyId: job.companyId,
        industryId: job.industryId,
        jobTypeId: job.jobTypeId,
        levelId: job.levelId,
        experienceLevelId: job.experienceLevelId,
        status: job.status,
        expiryDate: job.expiryDate,
        timeStart: job.timeStart,
        timeEnd: job.timeEnd,
        createdAt: job.createdAt, // Đổi tên để khớp với API
        updatedAt: job.updatedAt,

        // Các trường có thể cần ánh xạ thêm từ ID sang tên nếu frontend cần hiển thị tên
        // jobType: mapJobTypeIdToName(job.jobTypeId), // Cần hàm ánh xạ nếu JobType component cần tên
        // experience: mapExpLevelIdToName(job.experienceLevelId), // Cần hàm ánh xạ
        // industry: mapIndustryIdToName(job.industryId), // Cần hàm ánh xạ
      }));

      // Khôi phục logic lọc và phân trang frontend
      let filteredJobs = [...jobs];

      // Áp dụng filters (frontend)
      if (filters.keyword) {
        filteredJobs = filteredJobs.filter(job =>
          job.jobTitle?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.description?.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }

      if (filters.location) {
         // Lọc theo location string bao gồm addressDetail và provinceName
        filteredJobs = filteredJobs.filter(job =>
          job.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

       if (filters.jobType?.length) {
         // Lọc theo JobTypeId - cần ánh xạ từ ID sang tên nếu API không trả về tên
         // hoặc kiểm tra JobTypeId trực tiếp nếu JobType component gửi ID
         // Hiện tại jobType state trong FilterSidebar đang lưu ID
         filteredJobs = filteredJobs.filter(job =>
           filters.jobType.includes(job.jobTypeId)
         );
       }

       if (filters.salary?.min !== undefined) { // Kiểm tra rõ ràng undefined
         filteredJobs = filteredJobs.filter(job =>
           job.totalSalary?.min >= filters.salary.min
         );
       }

       if (filters.salary?.max !== undefined) { // Kiểm tra rõ ràng undefined
         filteredJobs = filteredJobs.filter(job =>
           job.totalSalary?.max <= filters.salary.max
         );
       }

      // Các bộ lọc frontend khác cần được thêm lại tại đây nếu cần (category, datePosted, experience, tag, sort)

      // Áp dụng pagination (frontend)
      const total = filteredJobs.length; // Tổng số kết quả sau khi lọc frontend
      const start = filters.page ? (filters.page - 1) * (filters.limit || 10) : 0;
      const end = filters.limit ? start + filters.limit : filteredJobs.length;
      const paginatedJobs = filteredJobs.slice(start, end);

      return {
        data: paginatedJobs, // Trả về dữ liệu đã được frontend lọc và phân trang
        total: total // Trả về tổng số kết quả sau lọc frontend
      };
    } catch (error) {
      console.error("Error fetching jobs from backend API:", error);
      // Trả về mảng rỗng và tổng 0 khi có lỗi
      return { data: [], total: 0 };
    }
  },

  getJobById: async (id) => {
    try {
      // Gọi API backend để lấy job theo ID
      const response = await axios.get(`${API_URL}/Job/${id}`);
      const job = response.data;

      console.log(`Raw API response data for getJobById (ID ${id}):`, job); // Thêm log dữ liệu thô

      // Ánh xạ dữ liệu từ API sang cấu trúc frontend
      const mappedJob = {
        id: job.jobId, // Sử dụng jobId từ API
        jobTitle: job.title,
        description: job.description,
        // company: job.companyId, // Có thể cần fetch tên công ty
        location: `${job.addressDetail || ''}${job.addressDetail && job.provinceName ? ', ' : ''}${job.provinceName || ''}`.trim(),
        provinceName: job.provinceName, // Add provinceName field
        // time: job.createdAt, // Có thể dùng createdAt
        salary: `${job.salary} USD`, // Định dạng chuỗi
        totalSalary: { min: job.salary, max: job.salary },
        logo: job.imageJob || '/images/company-logo/default-logo.png',

        // Các trường ID và dữ liệu khác
        companyId: job.companyId,
        industryId: job.industryId,
        jobTypeId: job.jobTypeId,
        levelId: job.levelId,
        experienceLevelId: job.experienceLevelId,
        status: job.status,
        expiryDate: job.expiryDate,
        timeStart: job.timeStart,
        timeEnd: job.timeEnd,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,

         // Các trường có thể cần ánh xạ
        // jobType: mapJobTypeIdToName(job.jobTypeId),
        // experience: mapExpLevelIdToName(job.experienceLevelId),
        // industry: mapIndustryIdToName(job.industryId),
      };

      return mappedJob;
    } catch (error) {
      console.error(`Error fetching job with ID ${id} from backend API:`, error);
      throw error; // Ném lỗi để component gọi xử lý
    }
  },

  getJobTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/JobType`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job types:", error);
      throw error;
    }
  },

  getExperienceLevels: async () => {
    try {
      const response = await axios.get(`${API_URL}/ExperienceLevels`);
      return response.data;
    } catch (error) {
      console.error("Error fetching experience levels:", error);
      throw error;
    }
  },

  getIndustries: async () => {
    try {
      const response = await axios.get(`${API_URL}/Industry`);
      return response.data;
    } catch (error) {
      console.error("Error fetching industries:", error);
      throw error;
    }
  },

  getJobCategories: async () => {
     // Nếu API backend không có endpoint riêng cho categories, bạn có thể cần
     // tạo danh sách category dựa trên Industry hoặc JobType từ lookup data.
     // Hiện tại giữ nguyên logic trả về danh sách mẫu nếu chưa có API.

    // try {
    //   // const response = await axios.get(`${API_URL}/Categories`); // Nếu có API
    //   // return response.data;
    // } catch (error) {
    //   console.error("Error fetching categories:", error);
    //   // throw error;
    // }

     // Trả về danh sách categories mẫu
     const CATEGORIES = [
       "Design",
       "Development",
       "Marketing",
       "Business",
       "Technology",
       "Finance",
       "Healthcare",
       "Education"
     ];
     return CATEGORIES.map((category, index) => ({
       id: index + 1,
       title: category
     }));
  },

  getCompanies: async () => {
    try {
      const response = await axios.get(`${API_URL}/Company`);
      // Dữ liệu từ API Company có thể khác cấu trúc mẫu ban đầu.
      // Ánh xạ dữ liệu từ API vào cấu trúc frontend mong đợi.
      return response.data.map(company => ({
        id: company.Id, // Sử dụng ID từ API nếu có trường ID
        name: company.Name, // Sử dụng Name từ API
        logo: company.Logo || '/images/company-logo/default-logo.png' // Sử dụng Logo từ API
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error; // Ném lỗi để component gọi xử lý
    }
  }
};
