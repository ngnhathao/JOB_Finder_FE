"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jobService } from "../../services/jobService"; // Import jobService

const JobFeatured1 = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobTypesData, setJobTypesData] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job list
        const jobsData = await jobService.getJobs({}); // Sử dụng jobService.getJobs để fetch job list
        console.log('API response data for JobFeatured1 (Jobs):', jobsData);

        // Fetch lookup data using jobService
        const companiesRes = await jobService.getCompanies();
        const jobTypesRes = await jobService.getJobTypes();
        const expLevelsRes = await jobService.getExperienceLevels();
        const industriesRes = await jobService.getIndustries();

        console.log('JobFeatured1 Lookup data:', { companiesRes, jobTypesRes, expLevelsRes, industriesRes });

        // Set states
        setJobs(jobsData.data || []); // Giả định jobService.getJobs trả về object có trường 'data'
        setCompanies(companiesRes || []);
        setJobTypesData(jobTypesRes || []);
        setExperienceLevels(expLevelsRes || []);
        setIndustries(industriesRes || []);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array

  // Helper functions to get names from IDs using lookup data
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'N/A';
  };

  const getJobTypeName = (jobTypeId) => {
    const type = jobTypesData.find(jt => jt.id === jobTypeId);
    return type ? type.jobTypeName || type.name : 'N/A';
  };

  const getIndustryName = (industryId) => {
    // Kiểm tra cả industryId và id trong dữ liệu industries
    const industry = industries.find(i => i.industryId === industryId || i.id === industryId);
    // Kiểm tra cả industryName và name trong dữ liệu industries
    return industry ? industry.industryName || industry.name : 'N/A';
  };

  const getExperienceLevelName = (expLevelId) => {
    const level = experienceLevels.find(el => el.id === expLevelId);
    return level ? level.name : 'N/A';
  };

  return (
    <>
      {/* Sử dụng slice(0, 6) để chỉ hiển thị 6 job đầu tiên */}
      {jobs.slice(0, 6).map((item) => {
        // Log chi tiết data item
        console.log(`--- Rendering Job Item ${item.jobId} ---`);
        console.log('Item Data:', item);
        console.log('Company Name (Lookup):', getCompanyName(item.companyId));
        console.log('Industry Name (Lookup):', getIndustryName(item.industryId));
        console.log('Job Type Name (Lookup):', getJobTypeName(item.jobTypeId));
        console.log('Experience Level Name (Lookup):', getExperienceLevelName(item.experienceLevelId));
        console.log('Logo URL:', item.logo);
        console.log('---------------------------');

        return (
          <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.jobId}>
            <div className="inner-box">
              <div className="content">
                {/* Bookmark Button */}
                <button className="bookmark-btn">
                  <span className="flaticon-bookmark"></span>
                </button>

                <div className="row">
                  {/* Logo Column - Use col-auto to fit content */}
                  <div className="col-auto">
                    <span className="company-logo">
                      {/* Sử dụng item.logo trực tiếp cho ảnh */}
                      {item.logo ? (
                        <Image width={50} height={49} src={item.logo} alt={getCompanyName(item.companyId) || "Company Logo"} unoptimized={true} />
                      ) : (
                        <Image width={50} height={49} src={'/images/company-logo/default-logo.png'} alt={getCompanyName(item.companyId) || "Company Logo"} />
                      )}
                    </span>
                  </div>

                  {/* Job Details Column - Let it take remaining space */}
                  <div className="col">
                    {/* Job Title */}
                    <h4>
                      {/* Link tới trang chi tiết job */}
                      <Link href={`/job-single-v1/${item.jobId}`}>{item.jobTitle}</Link>
                    </h4>

                    {/* Job Info (Company Name, Location, Salary) */}
                    <ul className="job-info">
                      {/* Company Name - Lookup */}
                      {item.companyId && (
                        <li>
                          <span className="icon flaticon-briefcase"></span>
                          {getCompanyName(item.companyId)}
                        </li>
                      )}
                      {/* Địa điểm */}
                      {item.provinceName && (
                        <li>
                          <span className="icon flaticon-map-locator"></span>
                          {item.provinceName}
                        </li>
                      )}
                      {/* Lương */}
                      {item.salary && (
                        <li>
                          <span className="icon flaticon-money"></span>
                          {item.salary} USD
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Job Other Info (Tags) - Lookup */}
                <ul className="job-other-info">
                  {/* Industry Tag */}
                  {item.industryId && <li className="green">{getIndustryName(item.industryId)}</li>}
                  {/* Job Type Tag */}
                  {item.jobTypeId && <li className="orange">{getJobTypeName(item.jobTypeId)}</li>}
                  {/* Experience Level Tag */}
                  {item.experienceLevelId && <li className="purple">{getExperienceLevelName(item.experienceLevelId)}</li>}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default JobFeatured1;
