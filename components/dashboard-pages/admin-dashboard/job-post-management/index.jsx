"use client";
import { useEffect, useState } from "react";
import DashboardAdminSidebar from "../../../header/DashboardAdminSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import DashboardHeader from "../../../header/DashboardHeaderAdmin";
import "../user-manager/user-manager-animations.css";

const API_URL = "https://localhost:7266/api/JobPost";

// Fake data for development
const fakeJobs = [
  {
    Id: 1,
    Title: "Software Engineer (Android), Libraries",
    Description: "Build and maintain Android libraries for our platform.",
    CompanyId: 1,
    CompanyName: "Segment",
    Salary: "$35k - $45k",
    IndustryId: 1,
    Industry: "IT",
    ExpiryDate: "2024-07-30",
    LevelId: 2,
    JobTypeId: 1,
    ExperienceId: 2,
    TimeStart: "2024-06-01",
    TimeEnd: "2024-07-01",
    Status: "Pending",
    ImageJob: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    CreatedAt: "2024-06-01",
    UpdatedAt: "2024-06-01"
  },
  {
    Id: 2,
    Title: "Recruiting Coordinator",
    Description: "Coordinate recruitment process and support HR team.",
    CompanyId: 2,
    CompanyName: "Catalyst",
    Salary: "$35k - $45k",
    IndustryId: 2,
    Industry: "HR",
    ExpiryDate: "2024-07-30",
    LevelId: 1,
    JobTypeId: 2,
    ExperienceId: 1,
    TimeStart: "2024-06-01",
    TimeEnd: "2024-07-01",
    Status: "Approved",
    ImageJob: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    CreatedAt: "2024-06-01",
    UpdatedAt: "2024-06-01"
  },
  {
    Id: 3,
    Title: "Senior Product Designer",
    Description: "Design and improve product UI/UX.",
    CompanyId: 3,
    CompanyName: "Upwork",
    Salary: "$35k - $45k",
    IndustryId: 1,
    Industry: "Design",
    ExpiryDate: "2024-07-30",
    LevelId: 3,
    JobTypeId: 3,
    ExperienceId: 3,
    TimeStart: "2024-06-01",
    TimeEnd: "2024-07-01",
    Status: "Rejected",
    ImageJob: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    CreatedAt: "2024-06-01",
    UpdatedAt: "2024-06-01"
  }
];

const JobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        setJobs(fakeJobs);
        setLoading(false);
      });
  };

  // Lấy danh sách công ty và ngành nghề duy nhất
  const companyList = Array.from(new Set(jobs.map(j => j.CompanyName).filter(Boolean)));
  const industryList = Array.from(new Set(jobs.map(j => j.Industry).filter(Boolean)));

  // Filter nâng cao
  const filteredJobs = jobs.filter(job => {
    // Search
    const matchSearch = job.Title?.toLowerCase().includes(search.toLowerCase()) ||
      job.CompanyName?.toLowerCase().includes(search.toLowerCase());
    // Company
    const matchCompany = filterCompany === 'all' || job.CompanyName === filterCompany;
    // Industry
    const matchIndustry = filterIndustry === 'all' || job.Industry === filterIndustry;
    // Status
    const matchStatus = filterStatus === 'all' || job.Status === filterStatus;
    return matchSearch && matchCompany && matchIndustry && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage-1)*jobsPerPage, currentPage*jobsPerPage);

  // Reset page về 1 khi filter/search thay đổi
  useEffect(() => { setCurrentPage(1); }, [search, filterCompany, filterIndustry, filterStatus]);

  // Action handlers
  const handleShowDetail = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };
  const handleApprove = (jobId) => {
    setAlertMsg("Job post approved!");
    // Gọi API thực tế ở đây
  };
  const handleReject = (jobId) => {
    setAlertMsg("Job post rejected!");
    // Gọi API thực tế ở đây
  };
  const handleRemove = (jobId) => {
    setAlertMsg("Job post removed!");
    // Gọi API thực tế ở đây
  };

  return (
    <div className="page-wrapper dashboard" style={{background:'#f7f8fa', minHeight:'100vh'}}>
      <style>{`
        .job-card {
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
        .job-card:hover {
          background: #f5f7fa;
          box-shadow: 0 6px 24px rgba(25,103,210,0.08);
          transform: scale(1.015);
        }
        .job-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .job-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: #f3f3f3;
          object-fit: contain;
          border: 1px solid #eee;
        }
        .job-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          color: #555;
          font-size: 15px;
          margin-top: 6px;
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
        .badge {
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 8px;
        }
        .badge-status {
          background: #e9ecef;
          color: #333;
        }
        .badge-status.Approved { background: #d1f5e0; color: #1a7f37; }
        .badge-status.Pending { background: #fff3cd; color: #856404; }
        .badge-status.Rejected { background: #f8d7da; color: #842029; }
        @media (max-width: 700px) {
          .job-card { flex-direction: column; align-items: flex-start; }
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
                      placeholder="Search job..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <select className="form-select form-select-sm" style={{width:140}} value={filterCompany} onChange={e=>setFilterCompany(e.target.value)}>
                      <option value="all">All Companies</option>
                      {companyList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="form-select form-select-sm" style={{width:140}} value={filterIndustry} onChange={e=>setFilterIndustry(e.target.value)}>
                      <option value="all">All Industries</option>
                      {industryList.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    <select className="form-select form-select-sm" style={{width:120}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className={`widget-content ${!loading ? 'fade-in' : ''}`}> 
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <div>
                      {paginatedJobs.length === 0 ? (
                        <div style={{padding:32, textAlign:'center'}}>No job found</div>
                      ) : (
                        paginatedJobs.map((job) => (
                          <div className="job-card" key={job.Id}>
                            <div className="job-info">
                              <img className="job-logo" src={job.ImageJob} alt="logo" />
                              <div>
                                <div style={{fontWeight:600, fontSize:20, marginBottom:4}}>{job.Title}</div>
                                <div className="job-meta">
                                  <span><i className="fa fa-building" style={{marginRight:4}}></i> {job.CompanyName}</span>
                                  <span><i className="fa fa-briefcase" style={{marginRight:4}}></i> {job.Industry}</span>
                                  <span><i className="fa fa-calendar" style={{marginRight:4}}></i> {job.CreatedAt}</span>
                                  <span><i className="fa fa-money-bill" style={{marginRight:4}}></i> {job.Salary}</span>
                                  <span className={`badge badge-status ${job.Status}`}>{job.Status}</span>
                                </div>
                              </div>
                            </div>
                            <div className="job-actions">
                              <button className="btn btn-sm me-1" onClick={() => handleShowDetail(job)}>View</button>
                              {job.Status === "Pending" && (
                                <button className="btn btn-sm me-1" onClick={() => handleApprove(job.Id)}>Approve</button>
                              )}
                              {job.Status === "Pending" && (
                                <button className="btn btn-sm me-1" onClick={() => handleReject(job.Id)}>Reject</button>
                              )}
                              <button className="btn btn-sm" onClick={() => handleRemove(job.Id)}>Remove</button>
                            </div>
                          </div>
                        ))
                      )}
                      {/* Pagination */}
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
      {/* Modal xem chi tiết job */}
      {showDetailModal && selectedJob && (
        <div className="modal show" style={{display:'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Job Detail</h5>
                <button className="btn-close" onClick={()=>setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img src={selectedJob.ImageJob} alt="logo" style={{width:96, height:96, objectFit:'contain', background:'#fff', borderRadius:12}} />
                </div>
                <h4>{selectedJob.Title}</h4>
                <p><b>Company:</b> {selectedJob.CompanyName}</p>
                <p><b>Industry:</b> {selectedJob.Industry}</p>
                <p><b>Salary:</b> {selectedJob.Salary}</p>
                <p><b>Status:</b> {selectedJob.Status}</p>
                <p><b>Description:</b> {selectedJob.Description}</p>
                <p><b>Created At:</b> {selectedJob.CreatedAt}</p>
                <p><b>Updated At:</b> {selectedJob.UpdatedAt}</p>
                <p><b>Expiry Date:</b> {selectedJob.ExpiryDate}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostManagement; 