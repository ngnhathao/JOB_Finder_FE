'use client'

import { useDispatch, useSelector } from "react-redux";
import { addCompanySize } from "../../../features/filter/employerFilterSlice";
import { useEffect, useState } from "react";

const CompanySize = () => {
    const { employerFilter } = useSelector((state) => state);
    const [getCompanySize, setCompanySize] = useState(employerFilter.companySize);
    const dispatch = useDispatch();

    // company size handler
    const companySizeHandler = (e) => {
        const value = e.target.value;
        setCompanySize(value);
        dispatch(addCompanySize(value));
    };

    // Update local state when employerFilter.companySize changes (e.g., when clearing filters)
    useEffect(() => {
        setCompanySize(employerFilter.companySize);
    }, [employerFilter.companySize]);

  return (
    <>
      <select className="form-select"
              value={getCompanySize}
              onChange={companySizeHandler}>
        <option value="">Choose Company Size</option>
        <option value="1-10">1-10 Employees</option>
        <option value="11-50">11-50 Employees</option>
        <option value="51-200">51-200 Employees</option>
        <option value="201-500">201-500 Employees</option>
        <option value="501-1000">501-1000 Employees</option>
        <option value="1001-5000">1001-5000 Employees</option>
        <option value="5000+">5000+ Employees</option>
      </select>
      <span className="icon flaticon-team me-2"></span>
    </>
  );
};

export default CompanySize;
