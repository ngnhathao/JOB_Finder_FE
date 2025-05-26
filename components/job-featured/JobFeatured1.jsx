"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const JobFeatured1 = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://localhost:7266/api/Job");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      {jobs.slice(0, 6).map((item) => (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.jobId}>
          <div className="inner-box">
            <div className="content">
              {/* Ảnh logo công ty */}
              <span className="company-logo">
                <Image
                  width={50}
                  height={49}
                  src={item.imagePath}
                  alt="item brand"
                />
              </span>

              {/* Tên công việc */}
              <h4>
                <Link href={`/job-single-v1/${item.jobId}`}>{item.title}</Link>
              </h4>

              {/* Thông tin công ty, địa điểm, lương */}
              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.companyName}
                </li>
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.provinceName}
                </li>
                <li>
                  <span className="icon flaticon-money"></span>
                  {item.salary}
                </li>
              </ul>

              {/* Các thẻ tag: Ngành, loại việc, cấp bậc */}
              <ul className="job-other-info">
                <li className="green">{item.industryName}</li>
                <li className="orange">{item.jobTypeName}</li>
                <li className="purple">{item.experienceLevelName}</li>
              </ul>

              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobFeatured1;
