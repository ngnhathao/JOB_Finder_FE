'use client'

import Link from "next/link";
import ListingShowing from "../components/ListingShowing";
import { useDispatch, useSelector } from "react-redux";
import {
  addIndustry,
  addDestination,
  addFoundationDate,
  addKeyword,
  addLocation,
  addPerPage,
  addSort,
  addCompanySize,
} from "../../../features/filter/employerFilterSlice";
import Image from "next/image";
import { useState, useEffect } from "react";

const FilterTopBox = () => {
  const {
    keyword,
    location,
    destination,
    industry,
    foundationDate,
    sort,
    perPage,
    companySize,
  } = useSelector((state) => state.employerFilter) || {};
  const dispatch = useDispatch();

  // Add state for fetched companies, loading, and error
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCompanies, setTotalCompanies] = useState(0); // Add state for total count if API returns it
  const [industries, setIndustries] = useState([]); // State to fetch industries for mapping

  // Fetch industries on component mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("https://localhost:7266/api/Industry", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        const industriesData = await res.json();
        setIndustries(industriesData);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError(err.message || "Failed to fetch industries");
      }
    };
    fetchIndustries();
  }, []);

  // Fetch companies based on filters and pagination
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (keyword) params.append("CompanyName", keyword);
        if (location) params.append("Location", location);
        // Add other filters if supported by the API, based on your FilterSidebar state/components
        if (industry && industry !== "") params.append("IndustryId", industry);
        if (companySize && companySize !== "") params.append("TeamSize", companySize); // Changed from CompanySize to TeamSize

        // Add pagination parameters (assuming API supports page and limit)
        const page = Math.floor(perPage.start / (perPage.end - perPage.start + 1)) + 1; // Calculate page number
        const limit = perPage.end - perPage.start + 1; // Calculate limit

        // Adjust page and limit calculation if perPage logic is different
        let currentLimit = 10; // Default limit
        let currentPage = 1; // Default page

        if (perPage.end !== 0) {
            currentLimit = perPage.end - perPage.start; // Assuming perPage.start and end define the slice
            // Note: This pagination logic based on slice is unusual for APIs.
            // It might be better to send current page and items per page if API supports.
            // For now, adapting to the current Redux state structure.
            currentPage = Math.floor(perPage.start / currentLimit) + 1;
        } else {
             currentLimit = totalCompanies || 20; // If 'All', try to get total or use a large number
        }

        params.append("page", currentPage);
        params.append("limit", currentLimit);

        // Add sort parameter if supported by the API
        // if (sort) params.append("SortBy", sort); // Assuming sort value maps to API parameter

        console.log('Fetching companies with params:', params.toString());
        const url = `https://localhost:7266/api/CompanyProfile/filter?${params.toString()}`;
        console.log('Fetching URL:', url); // Log the full URL
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', res.status); // Log response status
        if (!res.ok) throw new Error(`Failed to fetch companies: ${res.status}`);

        const data = await res.json();
        console.log('API Response Data:', data); // Log the full response data

        // *** CORRECTLY handle API response format (assuming it's a direct array) ***
        if (Array.isArray(data)) { // If API returns a direct array
            setCompanies(data); // Set companies directly from the array
            setTotalCompanies(data.length); // Total is the array length
            console.log('API returned a direct array.', data);
        } else { // Handle unexpected response format
            console.error('Unexpected API response format:', data);
            setError('Unexpected data format from API');
            setCompanies([]);
            setTotalCompanies(0);
        }

        console.log('Companies state updated (should be async):', companies); // Log state (async)
        console.log('TotalCompanies state updated (should be async):', totalCompanies); // Log state (async)

      } catch (err) {
        console.error("Error fetching companies:", err);
        setError('Failed to fetch companies');
        setCompanies([]);
        setTotalCompanies(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [keyword, location, destination, industry, foundationDate, sort, perPage, companySize]); // Add all filter dependencies

  const industryMap = industries.reduce((acc, industry) => {
    acc[industry.industryId] = industry.industryName;
    return acc;
  }, {});

  // keyword filter
  const keywordFilter = (item) =>
    keyword !== ""
      ? item?.companyName?.toLowerCase().includes(keyword?.toLowerCase()) && item // Filter on companyName from API
      : item;

  // location filter (keeping frontend filter for now if API filter is not enough)
  const locationFilter = (item) =>
    location !== ""
      ? item?.location?.toLowerCase().includes(location?.toLowerCase())
      : item;

  // destination filter (keeping frontend filter for now)
  const destinationFilter = (item) =>
    destination?.min === 0 && destination?.max === 100 ? true : // Check default range
    (item?.destination?.min >= destination?.min && // Assuming API returns destination range
    item?.destination?.max <= destination?.max);

  // industry filter (keeping frontend filter for now, mapping industryId)
  const industryFilter = (item) =>
    industry !== ""
      ? item?.industryId == industry // Compare industryId (number/string) with industry filter value
      : item;

  // company size filter (frontend filter)
  const companySizeFilter = (item) => {
    if (!companySize || companySize === "") return true; // No filter applied
    
    // Compare exact string match since we're using predefined ranges
    return item?.teamSize === companySize;
  };

  // foundation date filter (keeping frontend filter for now)
  const foundationDataFilter = (item) => {
      // Need to get foundation year from API data. Assuming an 'foundationYear' field.
      // For now, applying filter on placeholder/example data structure field `foundationDate`
       const itemFoundationYear = item?.foundationYear; // Assuming API provides this field
       return foundationDate?.min <= itemFoundationYear && itemFoundationYear <= foundationDate?.max;
  };

  // sort filter (keeping frontend filter for now)
  const sortFilter = (a, b) => {
      // Assuming sorting by company name or another relevant field
      if (sort === "asc") {
          return a.companyName?.localeCompare(b.companyName);
      } else if (sort === "des") {
          return b.companyName?.localeCompare(a.companyName);
      }
      return 0; // Default no sort
  };

  // Apply frontend filters to the fetched data if API doesn't handle them fully
  console.log('Companies before frontend filters:', companies); // Log before filters

  const filteredByKeyword = companies?.filter(keywordFilter);
  console.log('After keywordFilter:', filteredByKeyword?.length, filteredByKeyword);

  const filteredByLocation = filteredByKeyword?.filter(locationFilter);
  console.log('After locationFilter:', filteredByLocation?.length, filteredByLocation);

  const filteredByDestination = filteredByLocation?.filter(destinationFilter);
  console.log('After destinationFilter:', filteredByDestination?.length, filteredByDestination);

  const filteredByIndustry = filteredByDestination?.filter(industryFilter);
  console.log('After industryFilter:', filteredByIndustry?.length, filteredByIndustry);

  const filteredByCompanySize = filteredByIndustry?.filter(companySizeFilter);
  console.log('After companySizeFilter:', filteredByCompanySize?.length, filteredByCompanySize);

  const filteredCompanies = filteredByCompanySize; // Final filtered list

  // Apply frontend pagination after filtering and sorting
   const sortedAndPaginatedCompanies = filteredCompanies
      ?.sort(sortFilter) // Apply sort here
     ?.slice(perPage.start, perPage.end !== 0 ? perPage.end : filteredCompanies?.length); // Simplified slice logic

  console.log('After sort and slice (paginated):', sortedAndPaginatedCompanies); // Log after sort/slice

  // *** CORRECTLY map array of objects to array of React elements ***
  let content = sortedAndPaginatedCompanies // Use sortedAndPaginatedCompanies for mapping
    ?.map((company) => (
      <div className="company-block" key={company.userId}> {/* Use company.userId as key */}
        <div className="inner-box"> {/* Keeping inner-box for structure/styling */}
          {/* New horizontal layout */} {/* Added main flex container */}
          <div className="d-flex align-items-center justify-content-between w-100"> {/* Flex container for horizontal layout */}
             <div className="d-flex align-items-center"> {/* Flex container for logo and info */}
               <span className="company-logo me-3"> {/* Added margin-right */}
                  <Image
                   width={50} // Adjust logo size based on new image
                   height={50} // Adjust logo size based on new image
                    src={company.urlCompanyLogo || company.imageLogoLgr || '/images/resource/company-6.png'}
                    alt={company.companyName}
                  />
                </span>
                <div className="company-info-block"> {/* Keeping company-info-block div */}
                 <h4 style={{ margin: 0, textAlign: 'left' }}>
   <Link
     href={`/employers-single-v1/${company.userId}`}
     style={{
       color: '#333',
       textDecoration: 'none',
     }}
     onMouseEnter={(e) => (e.target.style.color = '#377dff')} // màu hover
     onMouseLeave={(e) => (e.target.style.color = '#333')}     // màu gốc
   >
                       {company.companyName}
                     </Link>
                   </h4>
                   <div className="d-flex align-items-center gap-3"> {/* Location, Industry, Team Size */}
                     <div className="d-flex align-items-center me-3">
                       <span className="icon flaticon-map-locator me-2"></span>
                       <span>{company.location}</span>
                     </div>
                     <div className="d-flex align-items-center">
                       <span className="icon flaticon-briefcase me-2"></span>
                       <span>{industryMap[company.industryId] || `Industry ID: ${company.industryId}`}</span>
                     </div>
                    <div className="d-flex align-items-center">
                       <span className="icon flaticon-user me-2"></span> {/* Using flaticon-user as a common user/team icon */}
                       <span>{company.teamSize || 'N/A'}</span> {/* Assuming teamSize property exists in company data */}
                     </div>
                   </div>
                </div>
              </div>

            {/* Open Jobs button and Bookmark icon container */} {/* Added container */}
             <div className="d-flex align-items-center"> {/* Flex container for button and bookmark */}
               {/* Open jobs button removed as requested */}
               {/* Added Bookmark button */} {/* Added bookmark button */}
               <button className="bookmark-btn" title="Lưu công ty"> {/* Added bookmark button */}
                 <span className="flaticon-bookmark"></span> {/* Added bookmark icon */}
               </button>
            </div>
          </div>

        </div>
      </div>
    ));

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // clear handler
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addIndustry(""));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
    dispatch(addCompanySize(""));
  };

  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="text">
            <strong>{filteredCompanies?.length || 0}</strong> companies {/* Use filteredCompanies length before pagination for display */}
            {totalCompanies > 0 && ` of ${totalCompanies}`} {/* Show total if available */}
          </div>
        </div>
        {/* End showing-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination.min !== 0 ||
          destination.max !== 100 ||
          industry !== "" ||
          foundationDate.min !== 1900 ||
          foundationDate.max !== 2028 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ||
          companySize !== "" ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
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
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 24,
              })}
            >
              24 per page
            </option>
          </select>
          {/* End select */}
        </div>
    </div>
      {/* End top filter bar box */}

      {loading ? ( // Show loading message
         <div className="text-center py-5">Loading companies...</div>
       ) : error ? ( // Show error message
         <div className="text-center py-5 text-danger">{error}</div>
       ) : ( // If not loading and no error, check if companies exist
         sortedAndPaginatedCompanies?.length > 0 ? ( // Show content if companies found after filtering/pagination
           content
         ) : ( // Show no results message
           <div className="text-center py-5">No companies found matching your criteria.</div>
         )
       )}

      {/* <ListingShowing /> */} {/* Keep ListingShowing if it handles pagination buttons based on totalCompanies */}
      {/* <!-- Listing Show More --> */}
    </>
  );
};

export default FilterTopBox;
