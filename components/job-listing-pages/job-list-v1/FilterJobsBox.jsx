'use client'

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
} from "../../../features/filter/filterSlice";
import {
  clearDatePostToggle,
  clearExperienceToggle,
  clearJobTypeToggle,
} from "../../../features/job/jobSlice";
import Image from "next/image";
import { jobService } from "../../../services/jobService";

const FilterJobsBox = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Thêm state để lưu dữ liệu lookup
  const [companies, setCompanies] = useState([]);
  const [jobTypesData, setJobTypesData] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [industries, setIndustries] = useState([]);

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

  // Fetch jobs khi filters hoặc pagination thay đổi
  useEffect(() => {
    console.log('useEffect in FilterJobsBox triggered');
    // Fetch dữ liệu lookup khi component mount
    const fetchLookupData = async () => {
      try {
        // Fetch từng loại dữ liệu lookup độc lập để xử lý lỗi riêng
        const companiesRes = await jobService.getCompanies().catch(err => {
          console.error('Failed to fetch companies data', err);
          return []; // Trả về mảng rỗng nếu fetch thất bại
        });
        const jobTypesRes = await jobService.getJobTypes().catch(err => {
          console.error('Failed to fetch job types data', err);
          return []; // Trả về mảng rỗng nếu fetch thất bại
        });
        const expLevelsRes = await jobService.getExperienceLevels().catch(err => {
          console.error('Failed to fetch experience levels data', err);
          return []; // Trả về mảng rỗng nếu fetch thất bại
        });
        const industriesRes = await jobService.getIndustries().catch(err => {
          console.error('Failed to fetch industries data', err);
          return []; // Trả về mảng rỗng nếu fetch thất bại
        });

        setCompanies(companiesRes);
        setJobTypesData(jobTypesRes);
        setExperienceLevels(expLevelsRes);
        setIndustries(industriesRes);
        console.log('Lookup data fetched', { companiesRes, jobTypesRes, expLevelsRes, industriesRes });
      } catch (err) {
        // Catch block này có thể không cần thiết nữa nếu các catch riêng lẻ hoạt động
        console.error('An unexpected error occurred during lookup data fetching', err);
      }
    };
    fetchLookupData();

    // Logic fetch jobs (giữ nguyên)
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const filters = {};

        if (keyword !== "") filters.keyword = keyword;
        if (location !== "") filters.location = location;
        if (destination?.min !== 0 || destination?.max !== 100) filters.destination = destination;
        if (salary?.min !== 0 || salary?.max !== 20000) filters.salary = salary;
        if (category !== "") filters.category = category;
        if (jobType?.length > 0) filters.jobType = jobType;
        if (datePosted !== "" && datePosted !== "all") filters.datePosted = datePosted;
        if (experience?.length > 0) filters.experience = experience;
        if (tag !== "") filters.tag = tag;
        if (sort !== "") filters.sort = sort;

        filters.page = currentPage;
        filters.limit = itemsPerPage;

        console.log('Fetching jobs with filters:', filters);
        const response = await jobService.getJobs(filters);
        console.log('Jobs fetch response:', response);
        setJobs(response.data);
        setTotalJobs(response.total);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
        setJobs([]);
        setTotalJobs(0);
      } finally { 
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, location, destination, category, jobType, datePosted, experience, salary, tag, sort, currentPage, itemsPerPage]);

  // Helper function để tìm tên từ ID trong dữ liệu lookup
  const getCompanyName = (companyId) => {
      const company = companies.find(c => c.id === companyId);
      return company ? company.name : 'N/A';
  };

  const getJobTypeName = (jobTypeId) => {
      const type = jobTypesData.find(jt => jt.id === jobTypeId);
      // Dữ liệu API JobType có trường jobTypeName
      return type ? type.jobTypeName : 'N/A';
  };

  const getIndustryName = (industryId) => {
      const industry = industries.find(i => i.industryId === industryId);
      // Dữ liệu API Industry có trường industryName
      return industry ? industry.industryName : 'N/A';
  };

  const getExperienceLevelName = (expLevelId) => {
      const level = experienceLevels.find(el => el.id === expLevelId);
       // Dữ liệu API ExperienceLevels có trường name
      return level ? level.name : 'N/A';
  };

  // keyword filter on title
  const keywordFilter = (item) =>
    keyword !== ""
      ? item.jobTitle.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      : item;

  // location filter
  const locationFilter = (item) =>
    location !== ""
      ? item?.location
          ?.toLocaleLowerCase()
          .includes(location?.toLocaleLowerCase())
      : item;

  // location filter
  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  // category filter
  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  // job-type filter
  const jobTypeFilter = (item) =>
    jobType?.length !== 0 && item?.jobType !== undefined
      ? jobType?.includes(
          item?.jobType[0]?.type.toLocaleLowerCase().split(" ").join("-")
        )
      : item;

  // date-posted filter
  const datePostedFilter = (item) =>
    datePosted !== "all" && datePosted !== ""
      ? item?.created_at
          ?.toLocaleLowerCase()
          .split(" ")
          .join("-")
          .includes(datePosted)
      : item;

  // experience level filter
  const experienceFilter = (item) =>
    experience?.length !== 0
      ? experience?.includes(
          item?.experience?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  // salary filter
  const salaryFilter = (item) =>
    item?.totalSalary?.min >= salary?.min &&
    item?.totalSalary?.max <= salary?.max;

  // tag filter
  const tagFilter = (item) => (tag !== "" ? item?.tag === tag : item);

  // sort filter
  const sortFilter = (a, b) =>
    sort === "CreatedAtDesc" ? a.id > b.id && -1 : a.id < b.id && -1;

  // Thêm handler cho nút Show More
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  let content = jobs
    ?.map((item) => (
      <div className="job-block" key={item.id}>
        <div className="inner-box">
          <div className="content">
            {/* Restored Company Logo */}
             <span className="company-logo">
               {/* Sử dụng item.logo từ API cho ảnh công ty */}
               {item.logo ? (
                 <Image width={50} height={49} src={item.logo} alt={getCompanyName(item.companyId)} />
               ) : (
                 <Image width={50} height={49} src={'/images/company-logo/default-logo.png'} alt={getCompanyName(item.companyId)} />
               )}
             </span>
            {/* Restored Job Title */}
             <h4>
               <Link href={`/job-single-v1/${item.id}`}>{item.jobTitle}</Link>
             </h4>

            <ul className="job-info">
              {/* Removed Industry from job-info */}
              {/* Hiển thị Industry với icon cặp xách */}
              {/* {item.industryId ? (
                 <li>
                     <span className="icon flaticon-briefcase"></span>
                     {getIndustryName(item.industryId)}
                 </li>
               ) : null} */}
              <li>
                <span className="icon flaticon-map-locator"></span>
                {/* Chỉ hiển thị ProvinceName */}
                {console.log('Item provinceName:', item.provinceName)}
                {item.provinceName || 'Province N/A'}
              </li>
              {/* Removed Date Posted */}
              {/* Kept only salary */}
              <li>
                <span className="icon flaticon-money"></span>
                 {item.salary || 'Salary N/A'} {/* Giữ lại Salary */}
              </li>
            </ul>

            {/* Restored Job Type, Experience Level, other tags */}
             <ul className="job-other-info">
               {/* Hiển thị Industry tag */}
               {item.industryId ? (
                 <li className="time">{getIndustryName(item.industryId)}</li>
               ) : null}
               {/* Hiển thị Job Type tag */}
               {item.jobTypeId ? (
                  <li className="time">{getJobTypeName(item.jobTypeId)}</li>
               ) : null}
                {/* Hiển thị Experience Level tag */}
               {item.experienceLevelId ? (
                 <li className="urgent">{getExperienceLevelName(item.experienceLevelId)}</li>
                ) : null}
                {/* Removed other placeholder tags */}

             </ul>

            {/* Restored Bookmark button */}
             <button className="bookmark-btn">
               <span className="flaticon-bookmark"></span>
             </button>

          </div>
        </div>
      </div>
    ));

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
    setCurrentPage(1);
  };

  // per page handler
  const perPageHandler = (e) => {
    const limit = Number(e.target.value);
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  // Điều chỉnh logic phân trang hiển thị
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + jobs.length;

  // clear all filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(clearJobType());
    dispatch(clearJobTypeToggle());
    dispatch(addDatePosted(""));
    dispatch(clearDatePostToggle());
    dispatch(clearExperience());
    dispatch(clearExperienceToggle());
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addTag(""));
    dispatch(addSort(""));
    setCurrentPage(1);
    setItemsPerPage(10);
    setDisplayCount(10);
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <>
      <div className="ls-switcher">
        <div className="show-result">
          <div className="show-1023">
            <button
              type="button"
              className="theme-btn toggle-filters"
              data-bs-toggle="offcanvas"
              data-bs-target="#filter-sidebar"
            >
              <span className="icon icon-filter"></span> Filter
            </button>
          </div>
          {/* Collapsible sidebar button */}

          <div className="text">
            Show <strong>{jobs?.length}</strong> of <strong>{totalJobs}</strong> jobs
          </div>
        </div>
        {/* End show-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination?.min !== 0 ||
          destination?.max !== 100 ||
          category !== "" ||
          jobType?.length !== 0 ||
          datePosted !== "" ||
          experience?.length !== 0 ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          tag !== "" ||
          sort !== "" ||
          currentPage !== 1 ||
          itemsPerPage !== 10 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="CreatedAtAsc">Newest</option>
            <option value="CreatedAtDesc">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3"
            value={itemsPerPage}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
            <option value={totalJobs}>All</option>
          </select>
          {/* End select */}
        </div>
      </div>
      {/* End top filter bar box */}
      {content}
      {/* <!-- List Show More --> */}
      {totalJobs > 0 && (
        <div className="ls-pagination">
          <p>Pagination component goes here...</p>
        </div>
      )}
    </>
  );
};

export default FilterJobsBox;
