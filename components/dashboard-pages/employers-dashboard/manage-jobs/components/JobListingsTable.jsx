"use client";

import Link from "next/link";
import Image from "next/image.js";
import { useEffect, useState } from "react";
import { jobService } from "../../../../../services/jobService";
import { useRouter } from "next/navigation";
import "./JobListingsTable.css";

const JobListingsTable = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [jobLevels, setJobLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    salary: '',
    industryId: '',
    levelId: '',
    jobTypeId: '',
    experienceLevelId: '',
    expiryDate: '',
    timeStart: '',
    timeEnd: '',
    provinceName: '',
    addressDetail: '',
    status: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        setCurrentUserId(userId);

        // Fetch all required data in parallel
        const [
          jobsResponse,
          companiesResponse,
          industriesResponse,
          jobLevelsResponse,
          jobTypesResponse,
          experienceLevelsResponse
        ] = await Promise.all([
          jobService.getJobs(),
          jobService.getCompanies(),
          jobService.getIndustries(),
          jobService.getJobLevels(),
          jobService.getJobTypes(),
          jobService.getExperienceLevels()
        ]);

        console.log('API Responses:', {
          industries: industriesResponse,
          jobLevels: jobLevelsResponse,
          jobTypes: jobTypesResponse,
          experienceLevels: experienceLevelsResponse
        });

        // Filter jobs for current company
        const filteredJobs = jobsResponse.data.filter(job => job.companyId === parseInt(userId));
        setJobs(filteredJobs);

        // Set companies data
        const companiesMap = companiesResponse.reduce((acc, company) => {
          acc[company.id] = company.name;
          return acc;
        }, {});
        setCompanies(companiesMap);

        // Set dropdown data
        setIndustries(industriesResponse || []);
        setJobLevels(jobLevelsResponse || []);
        setJobTypes(jobTypesResponse || []);
        setExperienceLevels(experienceLevelsResponse || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewJob = (jobId) => {
    router.push(`/job-single-v3/${jobId}`);
  };

  const formatDateVN = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN');
  };

  const handleEditClick = (job) => {
    console.log('Selected job:', job);
    setSelectedJob(job);

    setEditForm({
      title: job.jobTitle || '',
      description: job.description || '',
      salary: job.salary ? job.salary.replace(' USD', '') : '',
      industryId: job.industryId || '',
      levelId: job.levelId || '',
      jobTypeId: job.jobTypeId || '',
      experienceLevelId: job.experienceLevelId || '',
      expiryDate: job.expiryDate ? job.expiryDate.split('T')[0] : '',
      timeStart: job.timeStart ? job.timeStart.split('T')[0] : '',
      timeEnd: job.timeEnd ? job.timeEnd.split('T')[0] : '',
      provinceName: job.provinceName || '',
      addressDetail: job.addressDetail || job.address || job.location || '',
      status: job.status === 1 ? "Active" : "Inactive"
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Giá trị status trong form:", editForm.status);
      const updatedJob = {
        ...selectedJob,
        title: editForm.title,
        description: editForm.description,
        salary: parseFloat(editForm.salary),
        industryId: parseInt(editForm.industryId),
        levelId: parseInt(editForm.levelId),
        jobTypeId: parseInt(editForm.jobTypeId),
        experienceLevelId: parseInt(editForm.experienceLevelId),
        expiryDate: editForm.expiryDate,
        timeStart: new Date(editForm.timeStart).toISOString(),
        timeEnd: new Date(editForm.timeEnd).toISOString(),
        provinceName: editForm.provinceName,
        addressDetail: editForm.addressDetail,
        status: editForm.status === "Active" ? 1 : 0,
        companyId: selectedJob.companyId
      };

      await jobService.updateJob(selectedJob.id, updatedJob);

      // Gọi lại API lấy job mới nhất
      const refreshedJob = await jobService.getJobById(selectedJob.id);
      console.log('Status sau khi update:', refreshedJob.status);

      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === selectedJob.id
            ? { ...job, ...refreshedJob }
            : job
        )
      );

      setShowSuccessModal(true);
      setIsEditModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật công việc:", error);
      alert(error.response?.data?.message || "Cập nhật công việc thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUserId) {
    return <div>Please login to view your jobs</div>;
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Applications</th>
                <th>Created & Expired</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    {/* <!-- Job Block --> */}
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <h4>
                            <Link href={`/job-single-v3/${job.id}`}>
                              {job.jobTitle}
                            </Link>
                          </h4>
                          <ul className="job-info">
                            <li>
                              <span className="icon flaticon-briefcase"></span>
                              {companies[job.companyId] || 'Unknown Company'}
                            </li>
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {job.location}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    <a href="#">3+ Applied</a>
                  </td>
                  <td>
                    {formatDateVN(job.timeStart)} <br />
                    {formatDateVN(job.timeEnd)}
                  </td>
                  <td className="status">
                    {job.status === 1 ? "Active" : job.status === 0 ? "Inactive" : job.status}
                  </td>
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li>
                          <button 
                            onClick={() => handleViewJob(job.id)}
                            data-text="View Job"
                          >
                            <span className="la la-eye"></span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleEditClick(job)}
                            data-text="Edit Job"
                          >
                            <span className="la la-pencil"></span>
                          </button>
                        </li>
                        {/* <li>
                          <button data-text="Delete Job">
                            <span className="la la-trash"></span>
                          </button>
                        </li> */}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* End table widget content */}

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <div className="modal-header" style={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              background: '#fff',
              paddingTop: 16,
              paddingBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              minHeight: 56
            }}>
              <h3 style={{ margin: 0 }}>Edit Job</h3>
              <button
                className="close-button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  fontSize: 24,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ paddingTop: 24 }}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary (USD)</label>
                <input
                  type="number"
                  name="salary"
                  value={editForm.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <select
                  name="industryId"
                  value={editForm.industryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Industry</option>
                  {industries && industries.map(industry => (
                    <option key={industry.industryId} value={industry.industryId}>
                      {industry.industryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Job Level</label>
                <select
                  name="levelId"
                  value={editForm.levelId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Job Level</option>
                  {jobLevels && jobLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.levelName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Job Type</label>
                <select
                  name="jobTypeId"
                  value={editForm.jobTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Job Type</option>
                  {jobTypes && jobTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.jobTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  name="experienceLevelId"
                  value={editForm.experienceLevelId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Experience Level</option>
                  {experienceLevels && experienceLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={editForm.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="timeStart"
                  value={editForm.timeStart}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="timeEnd"
                  value={editForm.timeEnd}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Province</label>
                <input
                  type="text"
                  name="provinceName"
                  value={editForm.provinceName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Detail</label>
                <input
                  type="text"
                  name="addressDetail"
                  value={editForm.addressDetail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: 32, width: '100%', maxWidth: '350px', minWidth: '0' }}>
            <h2 style={{ color: 'green' }}>Success!</h2>
            <p>Update job successfully!</p>
            <button
              style={{
                background: '#0d47a1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '12px 32px',
                fontSize: 18,
                marginTop: 16,
                cursor: 'pointer'
              }}
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingsTable;
