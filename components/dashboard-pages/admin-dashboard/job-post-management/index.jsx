"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDatePosted,
  addDestination,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
  addTag,
  clearExperience,
  clearJobType,
} from "../../../../features/filter/filterSlice";
import {
  clearDatePostToggle,
  clearExperienceToggle,
  clearJobTypeToggle,
} from "../../../../features/job/jobSlice";
import Image from "next/image";
import { jobService } from "../../../../services/jobService";
import DashboardAdminSidebar from "../../../header/DashboardAdminSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import DashboardHeader from "../../../header/DashboardHeaderAdmin";
import "../user-manager/user-manager-animations.css";
import ApiService from "../../../../services/api.service";
import API_CONFIG from '../../../../config/api.config';

const JobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State để lưu dữ liệu lookup
  const [companies, setCompanies] = useState([]);
  const [jobTypesData, setJobTypesData] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [industries, setIndustries] = useState([]);

  // Adjust useSelector path for filters if needed (assuming filterSlice is shared or adapted)
  // Using Redux state for public job filters for consistency, adjust if admin needs separate filters
  const { jobList, jobSort } = useSelector((state) => state.filter);
  const {
    keyword,
    location,
    destination,
    category,
    jobType,
    datePosted,
    experience,
    salary,
    tag,
  } = jobList || {};

  const { sort } = jobSort;
  const dispatch = useDispatch();

  // Add state for status filter locally if not using Redux for it
  const [filterStatus, setFilterStatus] = useState('');

  const [alertMsg, setAlertMsg] = useState("");

  const jobStatuses = ["Approved", "Pending", "Rejected"];

  // Fetch jobs và lookup data
  useEffect(() => {
    console.log('useEffect in JobPostManagement triggered');

    // Fetch dữ liệu lookup
    const fetchLookupData = async () => {
      try {
        console.log('Fetching lookup data with Promise.all...');
        const [companiesRes, jobTypesRes, expLevelsRes, industriesRes] = await Promise.all([
            jobService.getCompanies().catch(err => { console.error('Failed to fetch companies data', err); return []; }),
            jobService.getJobTypes().catch(err => { console.error('Failed to fetch job types data', err); return []; }),
            jobService.getExperienceLevels().catch(err => { console.error('Failed to fetch experience levels data', err); return []; }),
            jobService.getIndustries().catch(err => { console.error('Failed to fetch industries data', err); return []; })
        ]);

        console.log('Raw companies response:', companiesRes);

        // Map companies
        const mappedCompanies = companiesRes.map(company => {
          // console.log('Mapping company object:', company); // Remove this log now that we know the structure
           return ({
             Id: company.id, // Use company.id for Id
             CompanyName: company.name, // Use company.name for CompanyName
             logo: company.logo, // Use company.logo for logo
           });
        });

        // Map industries
         const mappedIndustries = industriesRes.map(industry => ({
            Id: industry.industryId,
            IndustryName: industry.industryName,
         }));

        // Map job types
         const mappedJobTypes = jobTypesRes.map(type => ({
            Id: type.id,
            JobTypeName: type.jobTypeName,
         }));

        // Map experience levels
         const mappedExpLevels = expLevelsRes.map(level => ({
            Id: level.id,
            Name: level.name,
         }));

        setCompanies(mappedCompanies);
        setIndustries(mappedIndustries);
        setJobTypesData(mappedJobTypes);
        setExperienceLevels(mappedExpLevels);
        console.log('Mapped Lookup data states updated (after Promise.all).', { mappedCompanies, mappedIndustries, mappedJobTypes, mappedExpLevels });
        console.log('Final companies state after fetchLookupData:', mappedCompanies);

      } catch (err) {
        console.error('An unexpected error occurred during lookup data fetching with Promise.all', err);
        // Set all lookup states to empty arrays in case of error
        setCompanies([]);
        setIndustries([]);
        setJobTypesData([]);
        setExperienceLevels([]);
      }
    };

    // Logic fetch jobs for admin
  const fetchJobs = async () => {
    try {
      setLoading(true);
        const filters = {};

        // Use Redux filter states for API parameters
        if (keyword !== "") filters.keyword = keyword;
        if (location !== "") filters.location = location; // Assuming location filter maps to provinceName or similar
        if (category !== "") filters.industryId = parseInt(category); // Assuming category filter maps to industryId
        if (jobType?.length > 0) filters.jobTypeIds = jobType; // Assuming jobType filter maps to jobTypeIds array
        if (experience?.length > 0) filters.experienceLevelIds = experience; // Assuming experience filter maps to experienceLevelIds array
        if (salary?.min !== 0 || salary?.max !== 20000) filters.salaryRange = salary; // Assuming salary filter maps to salaryRange object
        if (datePosted !== "" && datePosted !== "all") filters.datePosted = datePosted; // Assuming datePosted filter is supported
        // Add status filter from local state
        if (filterStatus !== "") filters.status = parseInt(filterStatus); // Assuming status filter maps to status integer

        // Pagination parameters for API (if API supports)
        filters.page = currentPage;
        filters.limit = itemsPerPage;

        console.log('Fetching jobs with filters (for admin):' + JSON.stringify(filters)); // Log filters as JSON
        // *** Use API endpoint for admin job list ***
        const response = await ApiService.request('Job/filter', 'GET', filters); // Using GET /api/Job/filter

        console.log('Admin Jobs fetch response:', response);

        // *** Handle direct array response from API ***
        if (Array.isArray(response)) { // Check if response is a direct array
             setJobs(response); // Set jobs directly from the array
             setTotalJobs(response.length); // Total is the array length
             setError(null);
             console.log('Admin Jobs state updated (direct array): ', response);
        } else { // Handle unexpected response format (not an array)
             console.error('Unexpected API response format for admin jobs:', response);
             setJobs([]);
             setTotalJobs(0);
             setError('Unexpected data format from API');
        }

      } catch (err) {
        console.error('Error fetching admin jobs:', err);
        setError('Failed to fetch admin jobs');
        console.error(err);
      setJobs([]);
        setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

    // Call fetchLookupData first, then fetchJobs
    fetchLookupData();
    fetchJobs();

  }, [keyword, location, category, jobType, datePosted, experience, salary, sort, currentPage, itemsPerPage, filterStatus]);

  // Helper function để tìm tên từ ID trong dữ liệu lookup (Sử dụng mapped data)
  const getCompanyName = (companyId) => {
    console.log('Attempting to get company name for companyId:', companyId);
    console.log('Current companies array in getCompanyName:', companies);
    const company = companies.find(c => c.Id === companyId);
    return company ? company.CompanyName : 'N/A';
  };

  const getIndustryName = (industryId) => {
    const industry = industries.find(i => i.Id === industryId);
    return industry ? industry.IndustryName : 'N/A';
  };

  const getJobTypeName = (jobTypeId) => {
    const type = jobTypesData.find(jt => jt.Id === jobTypeId);
    return type ? type.JobTypeName : 'N/A';
  };

  const getExperienceLevelName = (expLevelId) => {
    const level = experienceLevels.find(el => el.Id === expLevelId);
    return level ? level.Name : 'N/A';
  };

  // Frontend filtering and sorting will be removed or minimal if API handles it
  // Keeping these helper functions for now but rely more on API filters

  // Pagination logic remains as it operates on the fetched and filtered list
  const totalPages = Math.ceil(totalJobs / itemsPerPage);

  // Adjust content mapping to display job data and admin actions
  let content = jobs
    ?.map((item) => (
      <div className="job-block" key={item.jobId}>
        <div className="inner-box">
          <div className="job-info-area">
            {/* Company Logo */}
            <span className="company-logo">
              {(() => {
                const company = companies.find(c => c.Id === item.companyId);
                const logoSrc = company?.logo || '/images/company-logo/default-logo.png';
                const companyName = company?.CompanyName || 'N/A';
                return <Image width={50} height={49} src={logoSrc} alt={companyName} />;
              })()}
            </span>

            <div className="job-details">
              {/* Job Title */}
              <h4>
                <Link href={`/job-single-v3/${item.jobId}`}>{item.title}</Link>
              </h4>

              <ul className="job-info">
                {/* Company Name from lookup */}
                {item.companyId && companies.length > 0 && (
                  <li style={{ flexGrow: 1 }}>
                    <span className="icon flaticon-building"></span>
                    {getCompanyName(item.companyId)}
                  </li>
                )}
                {/* Province Name */}
                {item.provinceName && (
                  <li>
                    <span className="icon flaticon-map-locator"></span>
                    {item.provinceName}
                  </li>
                )}
                {/* Salary */}
                {item.salary !== undefined && (
                  <li>
                    <span className="icon flaticon-money"></span>
                    {item.salary}
                  </li>
                )}
                {/* Add Status if available on job object */}
                {item.status !== undefined && (
                  <li className={`badge badge-status ${item.status}`}>{jobStatuses[item.status]}</li>
                )}
                {/* Add Created At if available */}
                {item.createdAt && (
                  <li>
                    <span className="icon fa fa-calendar"></span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </li>
                )}
              </ul>

              {/* Job Tags (Industry, Job Type, Experience Level) */}
              <ul className="job-other-info">
                {/* Industry tag from lookup */}
                {item.industryId && industries.length > 0 && (
                  <li className="time">{getIndustryName(item.industryId)}</li>
                )}
                {/* Job Type tag from lookup */}
                {item.jobTypeId && jobTypesData.length > 0 && (
                  <li className="time">{getJobTypeName(item.jobTypeId)}</li>
                )}
                {/* Experience Level tag from lookup */}
                {item.experienceLevelId && experienceLevels.length > 0 && (
                  <li className="urgent">{getExperienceLevelName(item.experienceLevelId)}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Admin Actions Buttons */}
          <div className="job-actions">
            {/* Approve/Reject buttons (Add logic) */}
            {item.status === 1 && (
              <button className="btn btn-sm btn-success me-1" onClick={() => handleApproveJob(item.jobId)}>Approve</button>
            )}
            {item.status === 1 && (
              <button className="btn btn-sm btn-warning me-1" onClick={() => handleRejectJob(item.jobId)}>Reject</button>
            )}
            {/* Edit button (Add logic) */}
            <button className="btn btn-sm btn-secondary me-1" onClick={() => handleShowEdit(item)}>Edit</button>
            {/* Delete button (Add logic) */}
            <button className="btn btn-sm btn-danger" onClick={() => handleShowDelete(item)}>Delete</button>
          </div>
        </div>
      </div>
    ));

  // Pagination controls - Operate on totalJobs from API and local currentPage/itemsPerPage
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
    setCurrentPage(1);
  };

  const perPageHandler = (e) => {
    const limit = Number(e.target.value);
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  // Clear all filters - Adjust to clear relevant filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addCategory(""));
    dispatch(clearJobType());
    dispatch(addDatePosted(""));
    dispatch(clearExperience());
    dispatch(addSalary({ min: 0, max: 20000 }));
    setFilterStatus('');
    dispatch(addSort(""));
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  // --- Admin specific logic (Modals and Handlers) ---

  // Add state for modals and selected job for actions
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobToDelete, setSelectedJobToDelete] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [formJob, setFormJob] = useState({});
  const [editError, setEditError] = useState("");

  // Handlers for admin actions (Implement API calls using ApiService)

  const handleShowAdd = () => {
    setFormJob({});
    setShowAddModal(true);
  };

  const handleShowEdit = (job) => {
    setEditJob({ ...job });
    setEditError("");
    setShowEditModal(true);
  };

  const handleShowDelete = (job) => {
    setSelectedJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleApproveJob = async (jobId) => {
    try {
      console.log(`Attempting to approve job with ID: ${jobId}`);
      const response = await ApiService.request(`Job/${jobId}/approve`, 'PATCH');
      if (response.ok) {
      setAlertMsg("Job post approved!");
      fetchJobs();
      } else {
        const errorData = await response.json();
        setAlertMsg(errorData.message || `Failed to approve job post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error approving job:', error);
      setAlertMsg(`Failed to approve job post: ${error.message || error}`);
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      console.log(`Attempting to reject job with ID: ${jobId}`);
      const response = await ApiService.request(`Job/${jobId}/reject`, 'PATCH');
      if (response.ok) {
      setAlertMsg("Job post rejected!");
      fetchJobs();
      } else {
        const errorData = await response.json();
        setAlertMsg(errorData.message || `Failed to reject job post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
      setAlertMsg(`Failed to reject job post: ${error.message || error}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedJobToDelete) return;
    try {
      console.log(`Attempting to delete job with ID: ${selectedJobToDelete.jobId}`);
      const response = await ApiService.request(`Job/${selectedJobToDelete.jobId}`, 'DELETE');
      if (response.ok) {
        setAlertMsg(`Job post ${selectedJobToDelete.title} removed!`);
        fetchJobs();
      } else {
        const errorData = await response.json();
        setAlertMsg(errorData.message || `Failed to remove job post ${selectedJobToDelete.title}: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setAlertMsg(`Failed to remove job post ${selectedJobToDelete.title}: ${error.message || error}`);
    }
    setShowDeleteModal(false);
    setSelectedJobToDelete(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const processedValue = ['companyId', 'industryId', 'jobTypeId', 'experienceLevelId', 'status'].includes(name) ? parseInt(value) || '' : value;

    setEditJob({
      ...editJob,
      [name]: processedValue,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editJob?.jobId) return;
    try {
      console.log(`Attempting to edit job with ID: ${editJob.jobId}`, editJob);
      const response = await ApiService.request(`Job/${editJob.jobId}`, 'PUT', editJob);

      if (response.ok) {
        setAlertMsg("Job post updated successfully!");
        setShowEditModal(false);
        fetchJobs();
      } else {
        const errorData = await response.json();
        setEditError(errorData.message || `Failed to update job post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating job post:', error);
      setEditError(error.message || "Failed to update job post.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to add new job post:', formJob);
      const response = await ApiService.request('Job/create', 'POST', formJob);

      if (response.ok) {
        setAlertMsg("Job post added successfully!");
        setShowAddModal(false);
        fetchJobs();
      } else {
        const errorData = await response.json();
        setAlertMsg(errorData.message || `Failed to add job post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding job post:', error);
      setAlertMsg(error.message || "Failed to add job post.");
    }
  };

  // --- Modals JSX ---

  // Add Job Modal JSX (Adjust fields based on job creation API)
  const AddJobModal = () => (
    <div className={`modal show ${showAddModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{display: showAddModal ? 'block' : 'none'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Job Post</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={formJob.title || ''} onChange={(e) => setFormJob({...formJob, title: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Company (Select from lookup)</label>
                <select className="form-select" name="companyId" value={formJob.companyId || ''} onChange={(e) => setFormJob({...formJob, companyId: parseInt(e.target.value) || ''})} required>
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.Id} value={company.Id}>{company.CompanyName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Industry (Select from lookup)</label>
                <select className="form-select" name="industryId" value={formJob.industryId || ''} onChange={(e) => setFormJob({...formJob, industryId: parseInt(e.target.value) || ''})}>
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry.Id} value={industry.Id}>{industry.IndustryName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input type="text" className="form-control" name="salary" value={formJob.salary || ''} onChange={(e) => setFormJob({...formJob, salary: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Job Type (Select from lookup)</label>
                <select className="form-select" name="jobTypeId" value={formJob.jobTypeId || ''} onChange={(e) => setFormJob({...formJob, jobTypeId: parseInt(e.target.value) || ''})}>
                  <option value="">Select Job Type</option>
                  {jobTypesData.map(type => (
                    <option key={type.Id} value={type.Id}>{type.JobTypeName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Experience Level (Select from lookup)</label>
                <select className="form-select" name="experienceLevelId" value={formJob.experienceLevelId || ''} onChange={(e) => setFormJob({...formJob, experienceLevelId: parseInt(e.target.value) || ''})}>
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map(level => (
                    <option key={level.Id} value={level.Id}>{level.Name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Province Name</label>
                <input type="text" className="form-control" name="provinceName" value={formJob.provinceName || ''} onChange={(e) => setFormJob({...formJob, provinceName: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Address Detail</label>
                <input type="text" className="form-control" name="addressDetail" value={formJob.addressDetail || ''} onChange={(e) => setFormJob({...formJob, addressDetail: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Status (Select)</label>
                <select className="form-select" name="status" value={formJob.status !== undefined ? formJob.status : ''} onChange={(e) => setFormJob({...formJob, status: parseInt(e.target.value) || ''})} required>
                  <option value="">Select Status</option>
                  <option value={0}>Approved</option>
                  <option value={1}>Pending</option>
                  <option value={2}>Rejected</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={formJob.description || ''} onChange={(e) => setFormJob({...formJob, description: e.target.value})} rows="4"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Job Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Edit Job Modal JSX (Adjust fields based on job edit API and data structure)
  const EditJobModal = () => (
    <div className={`modal show ${showEditModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{display: showEditModal ? 'block' : 'none'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleEditSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Job Post</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editError && <div className="alert alert-danger">{editError}</div>}
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={editJob?.title || ''} onChange={handleEditChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Company (Select from lookup)</label>
                <select className="form-select" name="companyId" value={editJob?.companyId || ''} onChange={handleEditChange} required>
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.Id} value={company.Id}>{company.CompanyName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Industry (Select from lookup)</label>
                <select className="form-select" name="industryId" value={editJob?.industryId || ''} onChange={handleEditChange}>
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry.Id} value={industry.Id}>{industry.IndustryName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input type="text" className="form-control" name="salary" value={editJob?.salary || ''} onChange={handleEditChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Job Type (Select from lookup)</label>
                <select className="form-select" name="jobTypeId" value={editJob?.jobTypeId || ''} onChange={handleEditChange}>
                  <option value="">Select Job Type</option>
                  {jobTypesData.map(type => (
                    <option key={type.Id} value={type.Id}>{type.JobTypeName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Experience Level (Select from lookup)</label>
                <select className="form-select" name="experienceLevelId" value={editJob?.experienceLevelId || ''} onChange={handleEditChange}>
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map(level => (
                    <option key={level.Id} value={level.Id}>{level.Name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Province Name</label>
                <input type="text" className="form-control" name="provinceName" value={editJob?.provinceName || ''} onChange={handleEditChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Address Detail</label>
                <input type="text" className="form-control" name="addressDetail" value={editJob?.addressDetail || ''} onChange={handleEditChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Status (Select)</label>
                <select className="form-select" name="status" value={editJob?.status !== undefined ? editJob.status : ''} onChange={handleEditChange} required>
                  <option value="">Select Status</option>
                  <option value={0}>Approved</option>
                  <option value={1}>Pending</option>
                  <option value={2}>Rejected</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={editJob?.description || ''} onChange={handleEditChange} rows="4"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal JSX
  const DeleteJobModal = () => (
    <div className={`modal show ${showDeleteModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{display: showDeleteModal ? 'block' : 'none'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete the job post <b>{selectedJobToDelete?.title}</b>?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-wrapper dashboard" style={{background:'#f7f8fa', minHeight:'100vh'}}>
        <span className="header-span"></span>
        <DashboardHeader />
        <DashboardAdminSidebar />
        <section className="user-dashboard">
          <div className="dashboard-outer">
            <BreadCrumb title="Job Post Management" />
            <MenuToggler />
            <div className="text-center py-5">Loading...</div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper dashboard" style={{background:'#f7f8fa', minHeight:'100vh'}}>
        <span className="header-span"></span>
        <DashboardHeader />
        <DashboardAdminSidebar />
        <section className="user-dashboard">
          <div className="dashboard-outer">
            <BreadCrumb title="Job Post Management" />
            <MenuToggler />
            <div className="text-center py-5 text-danger">{error}</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper dashboard" style={{background:'#f7f8fa', minHeight:'100vh'}}>
      <style>{`
        .job-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 24px 32px;
          margin-bottom: 24px;
          transition: box-shadow 0.2s, background 0.2s, transform 0.18s;
        }
        .job-block:hover {
          background: #f5f7fa;
          box-shadow: 0 6px 24px rgba(25,103,210,0.08);
          transform: scale(1.015);
        }
        .inner-box {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }
        .job-info-area {
          flex-grow: 1;
          padding-right: 20px;
        }
        .job-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .company-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: #f3f3f3;
          object-fit: contain;
          border: 1px solid #eee;
        }
        .job-other-info {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .job-other-info li {
          list-style: none;
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 8px;
          background: #e9ecef;
        }
        .job-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .job-actions button {
          min-width: 110px;
        }
        .badge-status {
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 8px;
        }
        .badge-status.0 { background: #d1f5e0; color: #1a7f37; }
        .badge-status.1 { background: #fff3cd; color: #856404; }
        .badge-status.2 { background: #f8d7da; color: #842029; }
        @media (max-width: 768px) {
          .job-block { flex-direction: column; align-items: flex-start; }
          .job-info { flex-direction: column; align-items: flex-start; gap: 8px; }
          .job-actions { flex-direction: row; align-items: center; margin-top: 12px; }
        }
        .btn.btn-sm:hover, .btn.btn-sm:focus {
          background: #f5f7fa;
          border-color: #1967d2;
          color: #1967d2;
          box-shadow: 0 2px 8px rgba(25,103,210,0.08);
          transform: scale(1.05);
          transition: all 0.18s;
        }
        .job-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
      <span className="header-span"></span>
      <DashboardHeader />
      <DashboardAdminSidebar />
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Job Post Management" />
          <MenuToggler />
          {alertMsg && (
            <div className="alert alert-info" style={{marginBottom: 12}}>
              {alertMsg}
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="widget-title d-flex flex-wrap gap-2 justify-content-between align-items-center">
                  <h4>Job Post List</h4>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{width:180}}
                      placeholder="Search job title..."
                      value={keyword}
                      onChange={(e) => dispatch(addKeyword(e.target.value))}
                    />
                    <select className="form-select form-select-sm" style={{width:140}} value={category} onChange={(e)=>dispatch(addCategory(e.target.value))}>
                      <option value="">All Companies</option>
                      {companies.map(company => <option key={company.Id} value={company.Id}>{company.CompanyName}</option>)}
                    </select>
                    <select className="form-select form-select-sm" style={{width:140}} value={category} onChange={(e)=>dispatch(addCategory(e.target.value))}>
                      <option value="">All Industries</option>
                      {industries.map(industry => <option key={industry.Id} value={industry.Id}>{industry.IndustryName}</option>)}
                    </select>
                    <select className="form-select form-select-sm" style={{width:120}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                      <option value="">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={handleShowAdd}>Add Job</button>
                  </div>
                </div>
                <div className={`widget-content ${!loading ? 'fade-in' : ''}`}> 
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <div>
                      {jobs.length === 0 ? (
                        <div style={{padding:32, textAlign:'center'}}>No job found</div>
                      ) : (
                        content
                      )}
                      {totalPages > 1 && (
                        <nav className="mt-3">
                          <ul className="pagination justify-content-end">
                            <li className={`page-item${currentPage===1?' disabled':''}`}>
                              <button className="page-link" onClick={()=>setCurrentPage(currentPage-1)} disabled={currentPage===1}>&laquo;</button>
                            </li>
                            {Array.from({length: totalPages}, (_,i)=>(
                              <li key={i+1} className={`page-item${currentPage===i+1?' active':''}`}>
                                <button className="page-link" onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
                              </li>
                            ))}
                            <li className={`page-item${currentPage===totalPages?' disabled':''}`}>
                              <button className="page-link" onClick={()=>setCurrentPage(currentPage+1)} disabled={currentPage===totalPages}>&raquo;</button>
                            </li>
                          </ul>
                        </nav>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showAddModal && <AddJobModal />}
      {showEditModal && editJob && <EditJobModal />}
      {showDeleteModal && selectedJobToDelete && <DeleteJobModal />}
    </div>
  );
};

export default JobPostManagement; 