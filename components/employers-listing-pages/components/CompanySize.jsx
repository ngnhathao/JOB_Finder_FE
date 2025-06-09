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
        <option value="50 - 100">50 - 100</option>
        <option value="100 - 150">100 - 150</option>
        <option value="200 - 250">200 - 250</option>
        <option value="300 - 350">300 - 350</option>
        <option value="500 - 1000">500 - 1000</option>
      </select>
      <span className="icon flaticon-team me-2"></span>
    </>
  );
};

export default CompanySize;
