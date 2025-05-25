import axios from "axios";

const API_URL = "https://localhost:7266/api";

// Cấu hình axios
axios.defaults.headers.common['Content-Type'] = 'application/json';


// Map job types
const JOB_TYPES = {
  1: "Full-time",
  2: "Part-time",
  3: "Contract",
  4: "Internship"
};


// Map experience levels
const EXPERIENCE_LEVELS = {
  1: "Entry Level",
  2: "Junior",
  3: "Mid Level",
  4: "Senior",
  5: "Lead"
};


// Map industries
const INDUSTRIES = {
  1: "Technology",
  2: "Finance",
  3: "Healthcare",
  4: "Education",
  5: "Marketing"
};


// Map job levels
const JOB_LEVELS = {
  1: "Intern",
  2: "Junior",
  3: "Middle",
  4: "Senior",
  5: "Lead",
  6: "Manager"
};


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


// Danh sách job titles mẫu
const JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer"
];


// Danh sách companies mẫu
const COMPANIES = [
  "Tech Solutions Inc.",
  "Digital Innovations",
  "Future Systems",
  "Smart Tech",
  "Global Software",
  "Innovative Solutions",
  "Tech Pioneers",
  "Digital Dynamics",
  "Future Technologies",
  "Smart Solutions"
];


export const jobService = {
  async getJobs(filters = {}) {
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
         // Lọc theo JobTypeId
         filteredJobs = filteredJobs.filter(job =>
           filters.jobType.includes(job.jobTypeId)
         );
       }

        if (filters.category) { // filters.category hiện đang là IndustryId
          filteredJobs = filteredJobs.filter(job =>
             // Lọc dựa trên IndustryId
             job.industryId === parseInt(filters.category) // So sánh IndustryId số nguyên
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

       if (filters.experience?.length) { // filters.experience hiện đang là mảng ExperienceLevelIds
         filteredJobs = filteredJobs.filter(job =>
           // Lọc dựa trên ExperienceLevelId
            filters.experience.includes(job.experienceLevelId) // So sánh ExperienceLevelId số nguyên
         );
       }

      // Các bộ lọc frontend khác cần được thêm lại tại đây nếu cần (datePosted, tag, sort)

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
      // Use the correct endpoint for CompanyProfile
      const response = await axios.get(`${API_URL}/CompanyProfile`);
      // Map the response data to the expected structure
      return response.data.map(company => ({
        id: company.userId, // Use userId from API as id
        name: company.companyName, // Use companyName from API as name
        logo: company.urlCompanyLogo || '/images/company-logo/default-logo.png' // Use urlCompanyLogo from API
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error; // Throw error for calling component to handle
    }
  },

  // Add a function to fetch provinces
  getProvinces: async () => {
    try {
      // Use the public API for provinces
      const response = await axios.get(`https://provinces.open-api.vn/api/p/`); // Call the public API endpoint for provinces
      // Dữ liệu trả về dạng [{ code: "01", name: "Thành phố Hà Nội", ... }, ...]
      // Ánh xạ dữ liệu để có cấu trúc { id: ..., name: ... }
      return response.data.map(province => ({
        id: province.code, // Sử dụng 'code' từ API làm 'id'
        name: province.name // Sử dụng 'name' từ API làm 'name'
      }));
    } catch (error) {
      console.error("Error fetching provinces:", error);
      // Trả về mảng rỗng khi có lỗi
      return [];
    }
  }
};


