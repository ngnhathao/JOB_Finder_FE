
import axios from "axios";


const API_URL = "https://jsonplaceholder.typicode.com";


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
      // Fetch posts from JSONPlaceholder using axios
      const response = await axios.get(`${API_URL}/posts`);
      const posts = response.data;
     
      // Map posts to job properties
      const jobs = posts.map((post, index) => {
        // Generate random dates
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30));
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 15));


        // Generate random salary between 5M and 50M
        const salary = Math.floor(Math.random() * (50000000 - 5000000) + 5000000);


        // Generate random IDs for various properties
        const jobTypeId = Math.floor(Math.random() * 4) + 1;
        const levelId = Math.floor(Math.random() * 6) + 1;
        const experienceId = Math.floor(Math.random() * 5) + 1;
        const industryId = Math.floor(Math.random() * 5) + 1;


        // Get random job title and company
        const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
        const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];


        return {
          jobId: post.id,
          title: `${jobTitle} - ${post.title}`,
          description: post.body,
          companyId: company,
          salary: salary,
          industryId: INDUSTRIES[industryId],
          expiryDate: expiryDate.toISOString(),
          levelId: JOB_LEVELS[levelId],
          jobTypeId: JOB_TYPES[jobTypeId],
          experienceId: EXPERIENCE_LEVELS[experienceId],
          timeStart: startDate.toISOString(),
          timeEnd: endDate.toISOString(),
          status: "active",
          imageJob: `https://picsum.photos/200/200?random=${post.id}`,
          createdAt: startDate.toISOString(),
          updatedAt: new Date().toISOString(),
          destination: {
            min: Math.floor(Math.random() * 50),
            max: Math.floor(Math.random() * 50 + 50)
          }
        };
      });


      // Apply filters if any
      let filteredJobs = jobs;


      // Keyword filter
      if (filters.keyword) {
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }


      // Job type filter
      if (filters.jobType?.length) {
        filteredJobs = filteredJobs.filter(job =>
          filters.jobType.includes(job.jobTypeId)
        );
      }


      // Salary filter
      if (filters.salary?.min > 0 || filters.salary?.max < 20000) {
        filteredJobs = filteredJobs.filter(job =>
          job.salary >= filters.salary.min && job.salary <= filters.salary.max
        );
      }


      // Category filter
      if (filters.category) {
        filteredJobs = filteredJobs.filter(job =>
          job.industryId.toLowerCase() === filters.category.toLowerCase()
        );
      }


      // Experience filter
      if (filters.experience?.length) {
        filteredJobs = filteredJobs.filter(job =>
          filters.experience.includes(job.experienceId)
        );
      }


      // Sort
      if (filters.sort) {
        filteredJobs.sort((a, b) =>
          filters.sort === "des" ? b.jobId - a.jobId : a.jobId - b.jobId
        );
      }


      // Pagination
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      const paginatedJobs = filteredJobs.slice(start, end);


      return {
        data: paginatedJobs,
        total: filteredJobs.length
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },


  getJobById: async (id) => {
    try {
      // Fetch single post from JSONPlaceholder using axios
      const response = await axios.get(`${API_URL}/posts/${id}`);
      const post = response.data;


      // Generate random dates
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30));


      // Get random job title and company
      const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
      const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];


      return {
        id: post.id,
        jobTitle: jobTitle,
        company: company,
        location: "Ho Chi Minh City, Vietnam",
        time: startDate.toLocaleDateString(),
        salary: `$${Math.floor(Math.random() * 50 + 50)}k - $${Math.floor(Math.random() * 100 + 100)}k`,
        logo: `https://picsum.photos/200/200?random=${post.id}`,
        jobType: [JOB_TYPES[Math.floor(Math.random() * 4) + 1]],
        created_at: startDate.toLocaleDateString(),
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
      return COMPANIES.map((company, index) => ({
        id: index + 1,
        name: company,
        logo: `https://picsum.photos/200/200?random=${index}`
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }
};


