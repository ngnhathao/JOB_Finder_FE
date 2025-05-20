import axios from "axios";

const API_URL = "https://randomuser.me/api";

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
      // Gọi API để lấy 20 user ngẫu nhiên
      const response = await axios.get(`${API_URL}/?results=20`);
      const users = response.data.results;

      // Transform user data thành job data
      const jobs = users.map((user, index) => ({
        id: index + 1,
        jobTitle: `${user.name.first} ${user.name.last} Developer`,
        company: `${user.name.first}'s Company`,
        location: `${user.location.city}, ${user.location.country}`,
        time: new Date(user.registered.date).toLocaleDateString(),
        salary: `$${Math.floor(Math.random() * 50 + 50)}k - $${Math.floor(Math.random() * 100 + 100)}k`,
        logo: user.picture.medium,
        jobType: [JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)]],
        created_at: new Date(user.registered.date).toLocaleDateString(),
        experience: `${Math.floor(Math.random() * 5 + 1)} years`,
        totalSalary: {
          min: Math.floor(Math.random() * 50 + 50),
          max: Math.floor(Math.random() * 100 + 100)
        },
        tag: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        destination: {
          min: Math.floor(Math.random() * 50),
          max: Math.floor(Math.random() * 50 + 50)
        },
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      }));

      // Áp dụng filters
      let filteredJobs = [...jobs];

      if (filters.keyword) {
        filteredJobs = filteredJobs.filter(job => 
          job.jobTitle.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }

      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.category) {
        filteredJobs = filteredJobs.filter(job => 
          job.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      if (filters.jobType?.length) {
        filteredJobs = filteredJobs.filter(job => 
          filters.jobType.includes(job.jobType[0].type.toLowerCase().split(" ").join("-"))
        );
      }

      if (filters.salary?.min) {
        filteredJobs = filteredJobs.filter(job => 
          job.totalSalary.min >= filters.salary.min
        );
      }

      if (filters.salary?.max) {
        filteredJobs = filteredJobs.filter(job => 
          job.totalSalary.max <= filters.salary.max
        );
      }

      // Áp dụng pagination
      const start = filters.page ? (filters.page - 1) * (filters.limit || 10) : 0;
      const end = filters.limit ? start + filters.limit : filteredJobs.length;
      const paginatedJobs = filteredJobs.slice(start, end);

      return {
        data: paginatedJobs,
        total: filteredJobs.length
      };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  getJobById: async (id) => {
    try {
      // Gọi API để lấy 1 user ngẫu nhiên
      const response = await axios.get(`${API_URL}/?results=1`);
      const user = response.data.results[0];

      return {
        id: Number(id),
        jobTitle: `${user.name.first} ${user.name.last} Developer`,
        company: `${user.name.first}'s Company`,
        location: `${user.location.city}, ${user.location.country}`,
        time: new Date(user.registered.date).toLocaleDateString(),
        salary: `$${Math.floor(Math.random() * 50 + 50)}k - $${Math.floor(Math.random() * 100 + 100)}k`,
        logo: user.picture.medium,
        jobType: [JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)]],
        created_at: new Date(user.registered.date).toLocaleDateString(),
        experience: `${Math.floor(Math.random() * 5 + 1)} years`,
        totalSalary: {
          min: Math.floor(Math.random() * 50 + 50),
          max: Math.floor(Math.random() * 100 + 100)
        },
        tag: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        destination: {
          min: Math.floor(Math.random() * 50),
          max: Math.floor(Math.random() * 50 + 50)
        },
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      };
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },

  getJobCategories: async () => {
    try {
      // Trả về danh sách categories mẫu
      return CATEGORIES.map((category, index) => ({
        id: index + 1,
        title: category
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getCompanies: async () => {
    try {
      // Gọi API để lấy 10 user ngẫu nhiên làm companies
      const response = await axios.get(`${API_URL}/?results=10`);
      return response.data.results.map((user, index) => ({
        id: index + 1,
        name: `${user.name.first}'s Company`,
        logo: user.picture.medium
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }
};
