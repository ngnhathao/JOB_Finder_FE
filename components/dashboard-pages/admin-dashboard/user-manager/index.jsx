"use client"
import { useEffect, useState } from "react";
import DashboardAdminSidebar from "../../../header/DashboardAdminSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import DashboardHeader from "../../../header/DashboardHeaderAdmin";
import Link from "next/link";
import "./user-manager-animations.css";
import ApiService from "../../../../services/api.service";
import API_CONFIG from '../../../../config/api.config';

const roleOptions = [
  { id: 1, name: "Candidate" },
  { id: 2, name: "Company" },
  { id: 3, name: "Admin" }
];

const defaultUser = { fullName: "", email: "", phone: "", roleId: 1, password: "", status: "Active", skills: [], cvUrl: "", image: "" };

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
  const [filterRole, setFilterRole] = useState('all');
  const [filterLock, setFilterLock] = useState('all');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editError, setEditError] = useState("");

  // Tự động ẩn alert sau 2.5s
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg("") , 2500);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.get('/' + API_CONFIG.ENDPOINTS.USER.BASE);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc user theo search và filter
  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || user.roleId === Number(filterRole);
    const matchLock = filterLock === 'all' || (filterLock === 'locked' ? user.isActive === false : user.isActive !== false);
    return matchSearch && matchRole && matchLock;
  });

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
    setEditUser({ ...user });
    setFormUser({ ...user });
    setEditError("");
    setShowEditModal(true);
    setFormError("");
    setSelectedImageFile(null);
  };
  const handleShowAdd = () => {
    setFormUser(defaultUser);
    setShowAddModal(true);
    setFormError("");
    setSelectedImageFile(null);
  };
  const handleShowDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      await ApiService.deleteUser(selectedUser.id);
      setAlertMsg("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      setAlertMsg("Failed to delete user.");
    }
    setShowDeleteModal(false);
  };
  const handleToggleLock = async (user) => {
    let action = ''; // Declare action outside the try block
    try {
      const isLocked = user.isActive === false;
      action = isLocked ? 'unlock' : 'lock'; // Assign value to action
      await ApiService.request(`User/${user.id}/${action}`, 'PUT');
      setAlertMsg(`User ${isLocked ? 'unlocked' : 'locked'} successfully!`);
      setTimeout(fetchUsers, 300);
    } catch (error) {
      setAlertMsg(`Failed to ${action} user.`);
    }
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setSelectedImageFile(files[0]);
      setFormUser({
        ...formUser,
        image: URL.createObjectURL(files[0])
      });
    } else {
      setFormUser({
        ...formUser,
        [name]: name === "roleId" ? Number(value) : value
      });
    }
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
      const formData = new FormData();
      formData.append('fullName', formUser.fullName);
      formData.append('email', formUser.email);
      formData.append('phone', formUser.phone);
      formData.append('roleId', formUser.roleId);
      formData.append('password', formUser.password);

      if (selectedImageFile) {
        formData.append('imageFile', selectedImageFile);
      } else if (formUser.image && showEditModal) {
        formData.append('image', formUser.image);
      }

      ApiService.addUser(formData)
        .then(() => {
          setAlertMsg("User added successfully!");
          fetchUsers();
          setShowAddModal(false);
        })
        .catch((err) => setFormError(err.message || "Failed to add user."));
    } else if (showEditModal) {
      const formData = new FormData();
      formData.append('fullName', formUser.fullName);
      formData.append('email', formUser.email);
      formData.append('phone', formUser.phone);
      formData.append('roleId', formUser.roleId);
      if (selectedImageFile) {
        formData.append('imageFile', selectedImageFile);
      }

      ApiService.updateUser(editUser.id, formData)
        .then(() => {
          setAlertMsg("User updated successfully!");
          fetchUsers();
          setShowEditModal(false);
        })
        .catch((err) => setEditError(err.message || "Failed to update user."));
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
                      placeholder="Search by name, email, phone..."
                      value={search}
                      onChange={handleSearch}
                    />
                    <select className="form-select form-select-sm me-2" style={{width:120}} value={filterRole} onChange={e=>setFilterRole(e.target.value)}>
                      <option value="all">All Roles</option>
                      {roleOptions.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    <select className="form-select form-select-sm me-2" style={{width:120}} value={filterLock} onChange={e=>setFilterLock(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="locked">Locked</option>
                      <option value="unlocked">Unlocked</option>
                    </select>
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
                          <th>Image</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length === 0 ? (
                          <tr><td colSpan={7}>No users found</td></tr>
                        ) : (
                          paginatedUsers.map((user) => {
                            const isLocked = user.isActive === false;
                            return (
                              <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                  <img 
                                    src={user.image || '/images/default-avatar.png'} 
                                    alt={user.fullName}
                                    style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}}
                                  />
                                </td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role}</td>
                                <td>
                                  <button className="btn btn-sm me-1" onClick={() => handleShowDetail(user)} style={{display:'none'}}>View</button>
                                  <Link href={`/admin-dashboard/user-manager/${user.id}`} className="btn btn-sm me-1">View</Link>
                                  <button className="btn btn-sm me-1" onClick={() => handleShowEdit(user)}>Edit</button>
                                  <button className="btn btn-sm me-1" onClick={() => handleShowDelete(user)}>Delete</button>
                                  <button
                                    className={`btn btn-sm me-1 ${isLocked ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                                    onClick={() => handleToggleLock(user)}
                                  >
                                    {isLocked ? 'Unlock' : 'Lock'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
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
                  {editError && <div className="alert alert-danger">{editError}</div>}
                  <div className="mb-2">
                    <label>Profile Image</label>
                    <input 
                      className="form-control" 
                      type="file"
                      name="image"
                      onChange={handleFormChange}
                      accept="image/*"
                    />
                    {(selectedImageFile || formUser.image) && (
                      <img 
                        src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : formUser.image} 
                        alt="Preview" 
                        style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '50%'}}
                      />
                    )}
                  </div>
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
                    <select className="form-control" name="roleId" value={formUser.roleId} onChange={handleFormChange}>
                      {roleOptions.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
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
                    <label>Profile Image</label>
                    <input 
                      className="form-control" 
                      type="file"
                      name="image"
                      onChange={handleFormChange}
                      accept="image/*"
                    />
                    {selectedImageFile && (
                      <img 
                        src={URL.createObjectURL(selectedImageFile)} 
                        alt="Preview" 
                        style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '50%'}}
                      />
                    )}
                  </div>
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
                    <select className="form-control" name="roleId" value={formUser.roleId} onChange={handleFormChange}>
                      {roleOptions.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
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