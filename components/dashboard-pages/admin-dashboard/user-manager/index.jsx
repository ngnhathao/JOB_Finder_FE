"use client"
import { useEffect, useState } from "react";
import DashboardAdminSidebar from "../../../header/DashboardAdminSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import DashboardHeader from "../../../header/DashboardHeaderAdmin";
import Link from "next/link";
import "./user-manager-animations.css";


const API_URL = "https://localhost:7266/api/User";

const defaultUser = { fullName: "", email: "", phone: "", role: "User", password: "", status: "Active", skills: [], cvUrl: "" };

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formUser, setFormUser] = useState(defaultUser);
  const [formError, setFormError] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Tự động ẩn alert sau 2.5s
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg("") , 2500);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // Fetch user list
  const fetchUsers = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc user theo search
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage-1)*usersPerPage, currentPage*usersPerPage);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler functions
  const handleShowDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };
  const handleShowEdit = (user) => {
    setFormUser({ ...user, password: "" });
    setSelectedUser(user);
    setShowEditModal(true);
    setFormError("");
  };
  const handleShowAdd = () => {
    setFormUser(defaultUser);
    setShowAddModal(true);
    setFormError("");
  };
  const handleShowDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleDelete = () => {
    fetch(`${API_URL}/${selectedUser.userId}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setAlertMsg("User deleted successfully!");
          fetchUsers();
        } else {
          setAlertMsg("Failed to delete user.");
        }
        setShowDeleteModal(false);
      })
      .catch(() => setAlertMsg("Failed to delete user."));
  };
  const handleToggleLock = (user) => {
    // Giả sử API PATCH trạng thái hoạt động
    fetch(`${API_URL}/${user.userId}/toggle-lock`, { method: "PATCH" })
      .then((res) => {
        if (res.ok) {
          setAlertMsg("User status updated!");
          fetchUsers();
        } else {
          setAlertMsg("Failed to update status.");
        }
      })
      .catch(() => setAlertMsg("Failed to update status."));
  };

  // Form handlers
  const handleFormChange = (e) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (!formUser.fullName || !formUser.email) {
      setFormError("Full name and Email are required.");
      return false;
    }
    if (showAddModal && !formUser.password) {
      setFormError("Password is required.");
      return false;
    }
    return true;
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Add or Edit
    if (showAddModal) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUser),
      })
        .then((res) => {
          if (res.ok) {
            setAlertMsg("User added successfully!");
            fetchUsers();
            setShowAddModal(false);
          } else {
            setFormError("Failed to add user.");
          }
        })
        .catch(() => setFormError("Failed to add user."));
    } else if (showEditModal) {
      // Chỉ gửi đúng các trường API yêu cầu
      const userToUpdate = {
        fullName: formUser.fullName,
        email: formUser.email,
        phone: formUser.phone,
        role: formUser.role,
      };
      fetch(`${API_URL}/${formUser.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToUpdate),
      })
        .then((res) => {
          if (res.ok) {
            setAlertMsg("User updated successfully!");
            fetchUsers();
            setShowEditModal(false);
          } else {
            setFormError("Failed to update user.");
          }
        })
        .catch(() => setFormError("Failed to update user."));
    }
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      <DashboardHeader />
      <DashboardAdminSidebar />
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="User Manager" />
          <MenuToggler />
          {alertMsg && (
            <div className="alert alert-info" style={{marginBottom: 12}}>
              {alertMsg}
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="widget-title d-flex justify-content-between align-items-center">
                  <h4>User Manager</h4>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      style={{width:220}}
                      placeholder="Search user..."
                      value={search}
                      onChange={handleSearch}
                    />
                    <button className="btn btn-primary" onClick={handleShowAdd}>
                      Add User
                    </button>
                  </div>
                </div>
                <div className={`widget-content ${!loading ? 'fade-in' : ''}`}> 
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                    <table className="default-table manage-job-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length === 0 ? (
                          <tr><td colSpan={6}>No users found</td></tr>
                        ) : (
                          paginatedUsers.map((user) => (
                            <tr key={user.userId}>
                              <td>{user.userId}</td>
                              <td>{user.fullName}</td>
                              <td>{user.email}</td>
                              <td>{user.phone}</td>
                              <td>{user.role}</td>
                              <td>
                                <button className="btn btn-sm me-1" onClick={() => handleShowDetail(user)} style={{display:'none'}}>View</button>
                                <Link href={`/admin-dashboard/user-manager/${user.userId}`} className="btn btn-sm me-1">View</Link>
                                <button className="btn btn-sm me-1" onClick={() => handleShowEdit(user)}>Edit</button>
                                <button className="btn btn-sm me-1" onClick={() => handleShowDelete(user)}>Delete</button>
                                <button className="btn btn-sm" onClick={() => handleToggleLock(user)}>
                                  Lock/Unlock
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav className="mt-3">
                        <ul className="pagination justify-content-end">
                          <li className={`page-item${currentPage===1?' disabled':''}`}>
                            <button className="page-link" onClick={()=>handlePageChange(currentPage-1)} disabled={currentPage===1}>&laquo;</button>
                          </li>
                          {Array.from({length: totalPages}, (_,i)=>(
                            <li key={i+1} className={`page-item${currentPage===i+1?' active':''}`}>
                              <button className="page-link" onClick={()=>handlePageChange(i+1)}>{i+1}</button>
                            </li>
                          ))}
                          <li className={`page-item${currentPage===totalPages?' disabled':''}`}>
                            <button className="page-link" onClick={()=>handlePageChange(currentPage+1)} disabled={currentPage===totalPages}>&raquo;</button>
                          </li>
                        </ul>
                      </nav>
                    )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show" style={{display:'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button className="btn-close" onClick={()=>setShowEditModal(false)} type="button"></button>
                </div>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="mb-2">
                    <label>Full Name</label>
                    <input className="form-control" name="fullName" value={formUser.fullName} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input className="form-control" name="email" value={formUser.email} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Phone</label>
                    <input className="form-control" name="phone" value={formUser.phone} onChange={handleFormChange} />
                  </div>
                  <div className="mb-2">
                    <label>Role</label>
                    <select className="form-control" name="role" value={formUser.role} onChange={handleFormChange}>
                      <option value="Candidate">Candidate</option>
                      <option value="Company">Company</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Password (leave blank to keep current)</label>
                    <input className="form-control" name="password" type="password" value={formUser.password} onChange={handleFormChange} autoComplete="new-password" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={()=>setShowEditModal(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal show" style={{display:'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add User</h5>
                  <button className="btn-close" onClick={()=>setShowAddModal(false)} type="button"></button>
                </div>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="mb-2">
                    <label>Full Name</label>
                    <input className="form-control" name="fullName" value={formUser.fullName} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input className="form-control" name="email" value={formUser.email} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Phone</label>
                    <input className="form-control" name="phone" value={formUser.phone} onChange={handleFormChange} />
                  </div>
                  <div className="mb-2">
                    <label>Role</label>
                    <select className="form-control" name="role" value={formUser.role} onChange={handleFormChange}>
                      <option value="Candidate">Candidate</option>
                      <option value="Company">Company</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Password</label>
                    <input className="form-control" name="password" type="password" value={formUser.password} onChange={handleFormChange} required autoComplete="new-password" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={()=>setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show" style={{display:'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button className="btn-close" onClick={()=>setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete user <b>{selectedUser.fullName}</b>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager; 