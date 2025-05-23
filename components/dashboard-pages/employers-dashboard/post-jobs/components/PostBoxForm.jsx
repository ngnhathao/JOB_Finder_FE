'use client'

import { useState } from "react";
// import Map from "../../../Map";
import Select from "react-select";
import { useRouter } from 'next/navigation';

const PostBoxForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '', // This will be set from the logged-in company
    salary: '',
    industryId: '',
    expiryDate: '',
    levelId: '',
    jobTypeId: '',
    experienceId: '',
    timeStart: '',
    timeEnd: '',
    status: 'active', // Default status
    imageJob: null
  });

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
    if (!formData.experienceId) {
      newErrors.experienceId = 'Experience is required';
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
    if (!formData.imageJob) {
      newErrors.imageJob = 'Job image is required';
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      imageJob: file
    }));
    // Clear error when user selects an image
    if (errors.imageJob) {
      setErrors(prev => ({
        ...prev,
        imageJob: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Store form data in localStorage before navigating to payment
    localStorage.setItem('pendingJobData', JSON.stringify(formData));
    
    // Navigate to payment page
    router.push('/employers-dashboard/packages');
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

        {/* Experience */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <select 
            name="experienceId" 
            value={formData.experienceId}
            onChange={handleInputChange}
            className={`chosen-single form-select ${errors.experienceId ? 'error' : ''}`}
          >
            <option value="">Select Experience</option>
            <option value="1">0-1 years</option>
            <option value="2">1-3 years</option>
            <option value="3">3-5 years</option>
            <option value="4">5-10 years</option>
            <option value="5">10+ years</option>
          </select>
          {errors.experienceId && <span className="error-message">{errors.experienceId}</span>}
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
          />
          {errors.timeEnd && <span className="error-message">{errors.timeEnd}</span>}
        </div>

        {/* Job Image */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Image</label>
          <div className="file-upload-wrapper">
            <div className="file-upload-input-wrapper">
              <input 
                type="file" 
                name="imageJob" 
                onChange={handleImageChange}
                accept="image/*"
                id="job-image-upload"
                className={`file-upload-input ${errors.imageJob ? 'error' : ''}`}
              />
              <label htmlFor="job-image-upload" className={`file-upload-label ${errors.imageJob ? 'error' : ''}`}>
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Choose a file or drag it here</span>
              </label>
            </div>
            {formData.imageJob && (
              <div className="file-preview">
                <img 
                  src={URL.createObjectURL(formData.imageJob)} 
                  alt="Preview" 
                  className="preview-image"
                />
                <span className="file-name">{formData.imageJob.name}</span>
              </div>
            )}
            {errors.imageJob && <span className="error-message">{errors.imageJob}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">Post Job</button>
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

        .file-upload-wrapper {
          width: 100%;
          margin-top: 10px;
        }

        .file-upload-input-wrapper {
          position: relative;
          width: 100%;
        }

        .file-upload-input {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 20px;
          background-color: #f8f9fa;
          border: 2px dashed #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-label.error {
          border-color: #dc3545;
        }

        .file-upload-label:hover {
          border-color: #4a90e2;
          background-color: #f0f7ff;
        }

        .file-upload-label i {
          font-size: 24px;
          color: #4a90e2;
        }

        .file-upload-label span {
          color: #666;
          font-size: 14px;
        }

        .file-preview {
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .preview-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .file-name {
          color: #333;
          font-size: 14px;
          word-break: break-all;
        }
      `}</style>
    </form>
  );
};

export default PostBoxForm;