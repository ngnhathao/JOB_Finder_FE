"use client";

import FooterDefault from "../../../components/footer/common-footer";
import Breadcrumb from "../../common/Breadcrumb";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FilterTopBox from "./FilterTopBox";
import FilterSidebar from "./FilterSidebar";
import { useState, useEffect } from "react";

const EmployersListV1 = () => {
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [teamSizes, setTeamSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch industries
    fetch("/api/Industry").then(res => res.json()).then(setIndustries);
    // Fetch all companies to get all team sizes
    fetch("/api/CompanyProfile")
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        setTeamSizes(Array.from(new Set(data.map(c => c.teamSize).filter(Boolean))));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Khi filter thay đổi, cập nhật companies
  const handleFilterChange = (filtered) => {
    setLoading(true);
    setCompanies(filtered);
    setLoading(false);
  };

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
            <div className="filters-column col-lg-4 col-md-12 col-sm-12">
              <FilterSidebar onFilterChange={handleFilterChange} industries={industries} teamSizes={teamSizes} />
            </div>
            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="ls-outer">
                <FilterTopBox companies={companies} loading={loading} error={error} />
                {/* <!-- ls Switcher --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--End Listing Page Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default EmployersListV1;
