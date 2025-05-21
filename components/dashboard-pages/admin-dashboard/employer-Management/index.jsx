"use client";
import { useEffect, useState } from "react";
import DashboardAdminSidebar from "../../../header/DashboardAdminSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import DashboardHeader from "../../../header/DashboardHeaderAdmin";
import "../user-manager/user-manager-animations.css";

const API_URL = "https://localhost:7266/api/Employer";

// Fake data for development
const fakeEmployers = [
  {
    Id: 1,
    CompanyName: "Udemy",
    CompanyProfileDescription: "A global marketplace for learning and teaching online.",
    Location: "London, UK",
    UrlCompanyLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",
    ImageLogoLgr: "",
    TeamSize: "201-500",
    IsVerified: true,
    Website: "https://www.udemy.com",
    Contact: "contact@udemy.com",
    Industry: "Education",
    IsLocked: false
  },
  {
    Id: 2,
    CompanyName: "Stripe",
    CompanyProfileDescription: "Online payment processing for internet businesses.",
    Location: "London, UK",
    UrlCompanyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.svg",
    ImageLogoLgr: "",
    TeamSize: "1001-5000",
    IsVerified: false,
    Website: "https://www.stripe.com",
    Contact: "support@stripe.com",
    Industry: "Fintech",
    IsLocked: false
  },
  {
    Id: 3,
    CompanyName: "Dropbox",
    CompanyProfileDescription: "A modern workspace designed to reduce busywork.",
    Location: "London, UK",
    UrlCompanyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dropbox_Icon.svg",
    ImageLogoLgr: "",
    TeamSize: "501-1000",
    IsVerified: true,
    Website: "https://www.dropbox.com",
    Contact: "info@dropbox.com",
    Industry: "Cloud Storage",
    IsLocked: true
  }
];

const EmployerManagement = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employersPerPage = 10;
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeamSize, setFilterTeamSize] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setEmployers(data);
        setLoading(false);
      })
      .catch(() => {
        setEmployers(fakeEmployers);
        setLoading(false);
      });
  };

  const handleShowDetail = (employer) => {
    setSelectedEmployer(employer);
    setShowDetailModal(true);
  };

  const handleVerify = (employerId) => {
    fetch(`${API_URL}/${employerId}/verify`, { method: "PATCH" })
      .then((res) => {
        if (res.ok) {
          setAlertMsg("Account verified!");
          fetchEmployers();
        } else {
          setAlertMsg("Verification failed.");
        }
      })
      .catch(() => setAlertMsg("Verification failed."));
  };

  const handleToggleLock = (employerId, isLocked) => {
    fetch(`${API_URL}/${employerId}/${isLocked ? "unlock" : "lock"}`, { method: "PATCH" })
      .then((res) => {
        if (res.ok) {
          setAlertMsg(isLocked ? "Account unlocked." : "Account locked.");
          fetchEmployers();
        } else {
          setAlertMsg("Operation failed.");
        }
      })
      .catch(() => setAlertMsg("Operation failed."));
  };

  // Lấy danh sách industry duy nhất từ employers
  const industryList = Array.from(new Set(employers.map(e => e.Industry).filter(Boolean)));
  // Lấy danh sách team size mẫu
  const teamSizeOptions = [
    { label: 'All', value: 'all' },
    { label: '1-50', value: '1-50' },
    { label: '51-200', value: '51-200' },
    { label: '201-500', value: '201-500' },
    { label: '501+', value: '501+' },
  ];

  // Filter nâng cao
  const filteredEmployers = employers.filter(emp => {
    // Search
    const matchSearch = emp.CompanyName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.Location?.toLowerCase().includes(search.toLowerCase());
    // Status
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'verified' && emp.IsVerified) ||
      (filterStatus === 'pending' && !emp.IsVerified);
    // Team size
    let matchTeamSize = true;
    if (filterTeamSize !== 'all') {
      const size = emp.TeamSize?.replace(/\D/g, '') || '';
      const num = parseInt(size);
      if (filterTeamSize === '1-50') matchTeamSize = num >= 1 && num <= 50;
      else if (filterTeamSize === '51-200') matchTeamSize = num >= 51 && num <= 200;
      else if (filterTeamSize === '201-500') matchTeamSize = num >= 201 && num <= 500;
      else if (filterTeamSize === '501+') matchTeamSize = num >= 501;
    }
    // Industry
    const matchIndustry = filterIndustry === 'all' || emp.Industry === filterIndustry;
    return matchSearch && matchStatus && matchTeamSize && matchIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployers.length / employersPerPage);
  const paginatedEmployers = filteredEmployers.slice((currentPage-1)*employersPerPage, currentPage*employersPerPage);

  // Reset page về 1 khi filter/search thay đổi
  useEffect(() => { setCurrentPage(1); }, [search, filterStatus, filterTeamSize, filterIndustry]);

  return (
    <div className="page-wrapper dashboard" style={{background:'#f7f8fa', minHeight:'100vh'}}>
      <style>{`
        .employer-card {
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
        .employer-card:hover {
          background: #f5f7fa;
          box-shadow: 0 6px 24px rgba(25,103,210,0.08);
          transform: scale(1.015);
        }
        .employer-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .employer-logo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f3f3f3;
          object-fit: contain;
          border: 1px solid #eee;
        }
        .employer-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          color: #555;
          font-size: 15px;
        }
        .employer-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .employer-actions button {
          min-width: 120px;
        }
        .badge {
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 8px;
        }
        @media (max-width: 700px) {
          .employer-card { flex-direction: column; align-items: flex-start; }
          .employer-actions { flex-direction: row; align-items: center; margin-top: 12px; }
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
          <BreadCrumb title="Company Management" />
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
                  <h4>Company List</h4>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{width:180}}
                      placeholder="Search company..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <select className="form-select form-select-sm" style={{width:120}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                    <select className="form-select form-select-sm" style={{width:120}} value={filterTeamSize} onChange={e=>setFilterTeamSize(e.target.value)}>
                      {teamSizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select className="form-select form-select-sm" style={{width:140}} value={filterIndustry} onChange={e=>setFilterIndustry(e.target.value)}>
                      <option value="all">All Industries</option>
                      {industryList.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                </div>
                <div className={`widget-content ${!loading ? 'fade-in' : ''}`}> 
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <div>
                      {paginatedEmployers.length === 0 ? (
                        <div style={{padding:32, textAlign:'center'}}>No company found</div>
                      ) : (
                        paginatedEmployers.map((emp) => (
                          <div className="employer-card" key={emp.CompanyId || emp.Id}>
                            <div className="employer-info">
                              <img className="employer-logo" src={emp.UrlCompanyLogo || emp.ImageLogoLgr} alt="logo" />
                              <div>
                                <div style={{fontWeight:600, fontSize:20, marginBottom:4}}>{emp.CompanyName}</div>
                                <div className="employer-meta">
                                  <span><i className="fa fa-map-marker-alt" style={{marginRight:4}}></i> {emp.Location}</span>
                                  <span><i className="fa fa-users" style={{marginRight:4}}></i> {emp.TeamSize}</span>
                                  {emp.Industry && <span><i className="fa fa-briefcase" style={{marginRight:4}}></i> {emp.Industry}</span>}
                                  {emp.IsVerified ? (
                                    <span className="badge bg-success">Verified</span>
                                  ) : (
                                    <span className="badge bg-warning">Pending Approval</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="employer-actions">
                              <button className="btn btn-sm me-1" onClick={() => handleShowDetail(emp)}>View Profile</button>
                              {!emp.IsVerified && (
                                <button className="btn btn-sm me-1" onClick={() => handleVerify(emp.CompanyId || emp.Id)}>Approve</button>
                              )}
                              <button className="btn btn-sm" onClick={() => handleToggleLock(emp.CompanyId || emp.Id, emp.IsLocked)}>{emp.IsLocked ? "Unlock" : "Lock"}</button>
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
      {/* Company Profile Modal */}
      {showDetailModal && selectedEmployer && (
        <div className="modal show" style={{display:'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Company Profile</h5>
                <button className="btn-close" onClick={()=>setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img src={selectedEmployer.UrlCompanyLogo || selectedEmployer.ImageLogoLgr} alt="logo" style={{width:96, height:96, objectFit:'contain', background:'#fff', borderRadius:12}} />
                </div>
                <h4>{selectedEmployer.CompanyName}</h4>
                <p><b>Location:</b> {selectedEmployer.Location}</p>
                <p><b>Team Size:</b> {selectedEmployer.TeamSize}</p>
                <p><b>Website:</b> <a href={selectedEmployer.Website} target="_blank" rel="noopener noreferrer">{selectedEmployer.Website}</a></p>
                <p><b>Email/Phone:</b> {selectedEmployer.Contact}</p>
                <p><b>Description:</b> {selectedEmployer.CompanyProfileDescription}</p>
                <p><b>Status:</b> {selectedEmployer.IsVerified ? "Verified" : "Pending Approval"}</p>
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

export default EmployerManagement; 