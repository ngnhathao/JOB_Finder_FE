'use client'

import { useState, useEffect } from "react";
// import Map from "../../../Map";
import Select from "react-select";
import { useRouter } from 'next/navigation';

const PostBoxForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobId: 0,
    title: '',
    description: '',
    companyId: 0,
    salary: 0,
    industryId: 0,
    expiryDate: '',
    levelId: 0,
    jobTypeId: 0,
    experienceLevelId: 0,
    timeStart: '',
    timeEnd: '',
    status: 0,
    provinceName: '',
    addressDetail: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    // Lấy userId từ localStorage và gán vào companyId
    const userId = localStorage.getItem('userId');
    if (userId) {
      setFormData(prev => ({
        ...prev,
        companyId: parseInt(userId)
      }));
    }
  }, []);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    }
    if (!formData.industryId) {
      newErrors.industryId = 'Industry is required';
    }
    if (!formData.levelId) {
      newErrors.levelId = 'Job level is required';
    }
    if (!formData.jobTypeId) {
      newErrors.jobTypeId = 'Job type is required';
    }
    if (!formData.experienceLevelId) {
      newErrors.experienceLevelId = 'Experience level is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Application deadline is required';
    }
    if (!formData.timeStart) {
      newErrors.timeStart = 'Start date is required';
    }
    if (!formData.timeEnd) {
      newErrors.timeEnd = 'End date is required';
    }
    if (!formData.provinceName) {
      newErrors.provinceName = 'Province is required';
    }
    if (!formData.addressDetail) {
      newErrors.addressDetail = 'Address detail is required';
    }

    // Validate dates
    if (formData.timeStart && formData.timeEnd) {
      const startDate = new Date(formData.timeStart);
      const endDate = new Date(formData.timeEnd);
      
      if (endDate <= startDate) {
        newErrors.timeEnd = 'End date must be after start date';
      }
    }

    if (formData.timeStart && formData.timeEnd && formData.expiryDate) {
      const startDate = new Date(formData.timeStart);
      const endDate = new Date(formData.timeEnd);
      const expiryDate = new Date(formData.expiryDate);
      
      if (expiryDate < startDate || expiryDate > endDate) {
        newErrors.expiryDate = 'Application deadline must be between start date and end date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!formData.companyId) {
      alert('Company information is not available. Please try again later.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data in the format API expects
      const jobData = {
        ...formData,
        jobId: 0,
        companyId: parseInt(formData.companyId),
        salary: parseInt(formData.salary),
        industryId: parseInt(formData.industryId),
        levelId: parseInt(formData.levelId),
        jobTypeId: parseInt(formData.jobTypeId),
        experienceLevelId: parseInt(formData.experienceLevelId),
        status: 0,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        timeStart: new Date(formData.timeStart).toISOString(),
        timeEnd: new Date(formData.timeEnd).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Sending data:', jobData);

      const response = await fetch('https://localhost:7266/api/Job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(jobData),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response:', responseData);
        if (responseData.errors) {
          const serverErrors = Object.entries(responseData.errors)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n');
          throw new Error(`Validation errors:\n${serverErrors}`);
        }
        throw new Error(responseData.title || `Failed to create job: ${response.status} ${response.statusText}`);
      }

      console.log('Success response:', responseData);
      alert('Job created successfully!');
      router.push('/employers-dashboard/jobs');
      
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.message || 'Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* Job Title */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter job title" 
            className={errors.title ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Job Description */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter job description"
            className={errors.description ? 'error' : ''}
            disabled={isLoading}
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Salary */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Salary</label>
          <input 
            type="number" 
            name="salary" 
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Enter salary amount"
            className={errors.salary ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.salary && <span className="error-message">{errors.salary}</span>}
        </div>

        {/* Industry */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Industry</label>
          <select 
            name="industryId" 
            value={formData.industryId}
            onChange={handleInputChange}
            className={`chosen-single form-select ${errors.industryId ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Industry</option>
            <option value="1">Technology</option>
            <option value="2">Finance</option>
            <option value="3">Healthcare</option>
            <option value="4">Education</option>
            <option value="5">Manufacturing</option>
          </select>
          {errors.industryId && <span className="error-message">{errors.industryId}</span>}
        </div>

        {/* Job Level */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Level</label>
          <select 
            name="levelId" 
            value={formData.levelId}
            onChange={handleInputChange}
            className={`chosen-single form-select ${errors.levelId ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Level</option>
            <option value="1">Entry Level</option>
            <option value="2">Mid Level</option>
            <option value="3">Senior Level</option>
            <option value="4">Executive Level</option>
          </select>
          {errors.levelId && <span className="error-message">{errors.levelId}</span>}
        </div>

        {/* Job Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select 
            name="jobTypeId" 
            value={formData.jobTypeId}
            onChange={handleInputChange}
            className={`chosen-single form-select ${errors.jobTypeId ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Job Type</option>
            <option value="1">Full-time</option>
            <option value="2">Part-time</option>
            <option value="3">Contract</option>
            <option value="4">Internship</option>
            <option value="5">Remote</option>
          </select>
          {errors.jobTypeId && <span className="error-message">{errors.jobTypeId}</span>}
        </div>

        {/* Experience Level */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience Level</label>
          <select 
            name="experienceLevelId" 
            value={formData.experienceLevelId}
            onChange={handleInputChange}
            className={`chosen-single form-select ${errors.experienceLevelId ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Experience Level</option>
            <option value="1">0-1 years</option>
            <option value="2">1-3 years</option>
            <option value="3">3-5 years</option>
            <option value="4">5-10 years</option>
            <option value="5">10+ years</option>
          </select>
          {errors.experienceLevelId && <span className="error-message">{errors.experienceLevelId}</span>}
        </div>

        {/* Expiry Date */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Application Deadline</label>
          <input 
            type="date" 
            name="expiryDate" 
            value={formData.expiryDate}
            onChange={handleInputChange}
            className={`form-control ${errors.expiryDate ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
        </div>

        {/* Time Start */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Start Date</label>
          <input 
            type="date" 
            name="timeStart" 
            value={formData.timeStart}
            onChange={handleInputChange}
            className={`form-control ${errors.timeStart ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.timeStart && <span className="error-message">{errors.timeStart}</span>}
        </div>

        {/* Time End */}
        <div className="form-group col-lg-6 col-md-12">
          <label>End Date</label>
          <input 
            type="date" 
            name="timeEnd" 
            value={formData.timeEnd}
            onChange={handleInputChange}
            className={`form-control ${errors.timeEnd ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.timeEnd && <span className="error-message">{errors.timeEnd}</span>}
        </div>

        {/* Province Name */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Province</label>
          <input 
            type="text" 
            name="provinceName" 
            value={formData.provinceName}
            onChange={handleInputChange}
            placeholder="Enter province name"
            className={errors.provinceName ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.provinceName && <span className="error-message">{errors.provinceName}</span>}
        </div>

        {/* Address Detail */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Address Detail</label>
          <input 
            type="text" 
            name="addressDetail" 
            value={formData.addressDetail}
            onChange={handleInputChange}
            placeholder="Enter address detail"
            className={errors.addressDetail ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.addressDetail && <span className="error-message">{errors.addressDetail}</span>}
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button 
            type="submit" 
            className="theme-btn btn-style-one"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background-color: #fff;
        }

        .form-control:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }

        .error {
          border-color: #dc3545 !important;
        }

        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        input[type="date"] {
          position: relative;
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          padding: 5px;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .theme-btn {
          position: relative;
        }

        .theme-btn:disabled {
          background-color: #ccc;
        }
      `}</style>
    </form>
  );
};

export default PostBoxForm;