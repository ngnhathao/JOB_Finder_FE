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
    salary: "",
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

  const [levels, setLevels] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Lấy userId từ localStorage và gán vào companyId
    const userId = localStorage.getItem('userId');
    if (userId) {
      setFormData(prev => ({
        ...prev,
        companyId: parseInt(userId)
      }));
    }

    // Fetch levels from API
    fetch('https://localhost:7266/api/Level')
      .then(res => res.json())
      .then(data => setLevels(data))
      .catch(() => setLevels([]));

    // Fetch industries from API
    fetch('https://localhost:7266/api/Industry')
      .then(res => res.json())
      .then(data => setIndustries(data))
      .catch(() => setIndustries([]));

    // Fetch job types from API
    fetch('https://localhost:7266/api/JobType')
      .then(res => res.json())
      .then(data => setJobTypes(data))
      .catch(() => setJobTypes([]));

    // Fetch experience levels from API
    fetch('https://localhost:7266/api/ExperienceLevels')
      .then(res => res.json())
      .then(data => setExperienceLevels(data))
      .catch(() => setExperienceLevels([]));
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
    if (formData.timeStart) {
      const startDate = new Date(formData.timeStart);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (startDate < today) {
        newErrors.timeStart = 'Start date cannot be in the past';
      }
    }
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
      [name]: [
        "industryId",
        "levelId",
        "jobTypeId",
        "experienceLevelId"
      ].includes(name)
        ? Number(value)
        : value
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

      let responseData;
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        console.error('Raw response:', text);
        throw new Error('Server returned non-JSON response');
      }

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

      setShowSuccessModal(true);
      
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
            {industries.map(ind => (
              <option key={ind.industryId} value={ind.industryId}>{ind.industryName}</option>
            ))}
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
            {levels.map((level, idx) => (
              <option key={level.id || idx} value={level.id}>{level.levelName}</option>
            ))}
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
            {jobTypes.map(type => (
              <option key={type.id} value={type.id}>{type.jobTypeName}</option>
            ))}
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
            {experienceLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
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

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Success!</h3>
            <p>Post job successfully!</p>
            <button
              className="theme-btn btn-style-one"
              onClick={() => window.location.reload()}
            >
              Close
            </button>
          </div>
        </div>
      )}

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

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          padding: 24px 16px;
          text-align: center;
          width: 100%;
          max-width: 350px;
          min-width: 0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
          box-sizing: border-box;
        }
        @media (max-width: 400px) {
          .modal-content {
            max-width: 95vw;
            padding: 16px 4vw;
          }
        }
        .modal-content h3 {
          margin-bottom: 12px;
          color: #28a745;
        }
        .modal-content button {
          margin-top: 16px;
        }
      `}</style>
    </form>
  );
};

export default PostBoxForm;