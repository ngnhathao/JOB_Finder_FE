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

  const { sort, perPage } = jobSort;
  const dispatch = useDispatch();

  // Fetch jobs khi filters thay đổi
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const filters = {
          keyword: keyword || '',
          location: location || '',
          destination: destination || { min: 0, max: 100 },
          category: category || '',
          jobType: jobType || [],
          datePosted: datePosted || '',
          experience: experience || [],
          salary: salary || { min: 0, max: 20000 },
          tag: tag || '',
          sort: sort || '',
          page: perPage.end ? Math.floor(perPage.start / perPage.end) + 1 : 1,
          limit: perPage.end || 10
        };

        console.log('Fetching jobs with filters:', filters);
        const response = await jobService.getJobs(filters);
        console.log('Jobs response:', response);
        setJobs(response.data);
        setTotalJobs(response.total);
        setError(null);
      } catch (err) {
        console.error('Error in fetchJobs:', err);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, location, destination, category, jobType, datePosted, experience, salary, tag, sort, perPage]);

  // keyword filter on title
  const keywordFilter = (item) =>
    keyword ? item.title.toLowerCase().includes(keyword.toLowerCase()) : true;

  // location filter
  const locationFilter = (item) =>
    location ? item?.industryId?.toLowerCase().includes(location.toLowerCase()) : true;

  // destination filter
  const destinationFilter = (item) =>
    destination?.min === 0 && destination?.max === 100 ? true :
    item?.destination?.min >= destination?.min && item?.destination?.max <= destination?.max;

  // category filter
  const categoryFilter = (item) =>
    category ? item?.industryId?.toLowerCase() === category.toLowerCase() : true;

  // job-type filter
  const jobTypeFilter = (item) =>
    jobType?.length ? jobType.includes(item.jobTypeId) : true;

  // date-posted filter
  const datePostedFilter = (item) =>
    datePosted && datePosted !== "all" ? 
    item?.createdAt?.toLowerCase().split(" ").join("-").includes(datePosted) : true;

  // experience level filter
  const experienceFilter = (item) =>
    experience?.length ? experience.includes(item.experienceId) : true;

  // salary filter
  const salaryFilter = (item) =>
    salary?.min === 0 && salary?.max === 20000 ? true :
    item.salary >= salary?.min && item.salary <= salary?.max;

  // tag filter
  const tagFilter = (item) => tag ? item?.industryId === tag : true;

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? b.jobId - a.jobId : a.jobId - b.jobId;

  // Thêm handler cho nút Show More
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  let content = jobs
    ?.filter(keywordFilter)
    ?.filter(locationFilter)
    ?.filter(destinationFilter)
    ?.filter(categoryFilter)
    ?.filter(jobTypeFilter)
    ?.filter(datePostedFilter)
    ?.filter(experienceFilter)
    ?.filter(salaryFilter)
    ?.filter(tagFilter)
    ?.sort(sortFilter)
    .slice(0, displayCount)
    ?.map((item) => (
      <div className="job-block" key={item.jobId}>
        <div className="inner-box">
          <div className="content">
            <span className="company-logo">
              <Image 
                width={50} 
                height={49} 
                src={item.imageJob || '/images/default-job.png'} 
                alt={`${item.title} image`}
                className="job-image"
              />
            </span>
            <h4>
              <Link href={`/job-single-v1/${item.jobId}`}>{item.title}</Link>
            </h4>

            <ul className="job-info">
              <li>
                <span className="icon flaticon-briefcase"></span>
                {item.companyId}
              </li>
              <li>
                <span className="icon flaticon-map-locator"></span>
                {item.industryId}
              </li>
              <li>
                <span className="icon flaticon-clock-3"></span>
                {new Date(item.timeStart).toLocaleDateString()} - {new Date(item.timeEnd).toLocaleDateString()}
              </li>
              <li>
                <span className="icon flaticon-money"></span>
                {item.salary.toLocaleString('vi-VN')} USD
              </li>
            </ul>

            <ul className="job-other-info">
              <li className="job-type">{item.jobTypeId}</li>
              <li className="level">{item.levelId}</li>
              <li className="experience">{item.experienceId}</li>
              <li className="expiry">Deadline: {new Date(item.expiryDate).toLocaleDateString()}</li>
            </ul>

            <div className="post-date">
              Postting DateDate: {new Date(item.createdAt).toLocaleDateString()}
            </div>

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
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

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
    dispatch(addPerPage({ start: 0, end: 0 }));
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
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
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
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3"
            value={JSON.stringify(perPage)}
          >
            <option value={JSON.stringify({ start: 0, end: 0 })}>All</option>
            <option value={JSON.stringify({ start: 0, end: 10 })}>10 per page</option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>20 per page</option>
            <option value={JSON.stringify({ start: 0, end: 30 })}>30 per page</option>
          </select>
          {/* End select */}
        </div>
      </div>
      {/* End top filter bar box */}
      {content}
      {/* <!-- List Show More --> */}
      {jobs.length > 0 && (
        <div className="ls-show-more">
          <p>Show {displayCount} of {totalJobs} Jobs</p>
          <div className="bar">
            <span 
              className="bar-inner" 
              style={{ width: `${(displayCount / totalJobs) * 100}%` }}
            ></span>
          </div>
          {displayCount < totalJobs && (
            <button 
              className="show-more"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default FilterJobsBox;
