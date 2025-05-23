"use client";

import FooterDefault from "../../../components/footer/common-footer";
import Breadcrumb from "../../common/Breadcrumb";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FilterTopBox from "./FilterTopBox";
import FilterSidebar from "./FilterSidebar";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";



const index = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = authService.getToken();
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch("https://localhost:7266/api/CompanyProfile", {
          method: 'GET',
          headers: headers,
        });
        

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        const mapped = data.map((item) => ({
          Id: item.userId,
          CompanyName: item.companyName,
          CompanyProfileDescription: item.companyProfileDescription,
          Location: item.location,
          UrlCompanyLogo: item.urlCompanyLogo,
          ImageLogoLgr: item.imageLogoLgr,
          TeamSize: item.teamSize,
          IsVerified: item.isVerified,
          Website: item.website,
          Contact: item.contact,
          Industry: item.industry || '',
          IsLocked: false
        }));

        setCompanies(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err);
        // setCompanies(fakeEmployers); // Bỏ dòng này
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []); // Dependencies rỗng, chỉ chạy 1 lần khi mount

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Breadcrumb title="Companies" meta="Companies" />
      {/* <!--End Breadcrumb Start--> */}

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filter-sidebar"
              aria-labelledby="offcanvasLabel"
            >
              <div className="filters-column hide-left">
                <FilterSidebar />
              </div>
            </div>
            {/* End filter column for tablet and mobile devices */}

            <div className="filters-column hidden-1023 col-lg-4 col-md-12 col-sm-12">
              <FilterSidebar />
            </div>
            {/* <!-- End Filters Column for destop and laptop --> */}

            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="ls-outer">
                <FilterTopBox companies={companies} loading={loading} error={error} />

                {/* Old rendering logic removed */}

              </div>
            </div>
            {/* <!-- End Content Column --> */}
          </div>
          {/* End row */}
        </div>
        {/* End container */}
      </section>
      {/* <!--End Listing Page Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
