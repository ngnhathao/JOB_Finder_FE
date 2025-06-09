'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const JobListingsTable = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "https://localhost:7266/api/Application/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppliedJobs(response.data);
      } catch (err) {
        setError("Failed to load applied jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

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
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : appliedJobs.length === 0 ? (
          <div>No jobs applied yet.</div>
        ) : (
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Salary</th>
                  <th>Location</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>CV</th>
                  <th>Cover Letter</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appliedJobs.map((item) => (
                  <tr key={item.applicationId}>
                    <td>
                      {item.job?.title || "N/A"}
                    </td>
                    <td>
                      {item.job?.salary ? item.job.salary.toLocaleString() : "N/A"}
                    </td>
                    <td>
                      {item.job?.addressDetail || item.job?.provinceName || "N/A"}
                    </td>
                    <td>{new Date(item.submittedAt).toLocaleString()}</td>
                    <td>
                      {item.status === 0 ? "Pending" : item.status === 1 ? "Accepted" : "Rejected"}
                    </td>
                    <td>
                      <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    </td>
                    <td>{item.coverLetter}</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer" data-text="View CV">
                              <span className="la la-eye"></span>
                            </a>
                          </li>
                          {/* Thêm các action khác nếu muốn */}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
