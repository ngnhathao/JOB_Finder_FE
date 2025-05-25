"use client";

import { useState, useEffect } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const TEAM_SIZE_OPTIONS = [
  { value: '', label: 'All team sizes' },
  { value: '50 - 100', label: '50 - 100' },
  { value: '100 - 150', label: '100 - 150' },
  { value: '200 - 250', label: '200 - 250' },
  { value: '300 - 350', label: '300 - 350' },
  { value: '500 - 1000', label: '500 - 1000' },
];

const FilterSidebar = ({ onFilterChange, industries, teamSizes }) => {
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [industryId, setIndustryId] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false);
            return;
        }
        if (!companyName && !location && !teamSize && !industryId) {
            fetch('/api/CompanyProfile')
                .then(res => res.json())
                .then(data => onFilterChange(data));
            return;
        }
        const params = new URLSearchParams();
        if (companyName) params.append("CompanyName", companyName);
        if (location) params.append("Location", location);
        if (teamSize) params.append("TeamSize", teamSize);
        if (industryId) params.append("IndustryId", industryId);
        fetch(`/api/CompanyProfile/filter?${params.toString()}`)
            .then(res => res.json())
            .then(data => onFilterChange(data));
    }, [companyName, location, teamSize, industryId]);

    return (
        <div className="inner-column pd-right">
            <div className="filters-outer">
                <button
                    type="button"
                    className="btn-close text-reset close-filters show-1023"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>

                <div className="filter-block">
                    <h4 className="no-underline">Search Company</h4>
                    <div className="form-group">
                        <input 
                            type="text" 
                            value={companyName} 
                            onChange={e => setCompanyName(e.target.value)} 
                            placeholder="Enter company name..." 
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="filter-block">
                    <h4 className="no-underline">Location</h4>
                    <div className="form-group">
                        <input 
                            type="text" 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Enter location..." 
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="filter-block">
                    <h4 className="no-underline">Team Size</h4>
                    <div className="form-group">
                        <select
                          value={teamSize}
                          onChange={e => setTeamSize(e.target.value)}
                          className="form-control"
                        >
                          {TEAM_SIZE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                    </div>
                </div>

                <div className="filter-block">
                    <h4 className="no-underline">Industry</h4>
                    <div className="form-group">
                        <select 
                            value={industryId} 
                            onChange={e => setIndustryId(e.target.value)} 
                            className="form-control"
                        >
                            <option value="">All industries</option>
                            {industries.map(ind => (
                                <option key={ind.industryId} value={ind.industryId}>{ind.industryName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <style jsx>{`
                    .filters-outer {
                        background: #f4f6fb;
                        padding: 25px;
                        border-radius: 8px;
                        border: 1px solid #e0e0e0;
                    }

                    .filter-block {
                        margin-bottom: 25px;
                        position: relative;
                    }

                    .filter-block:last-child {
                        margin-bottom: 0;
                    }

                    .filter-block h4 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #232360;
                        margin-bottom: 15px;
                        position: relative;
                        padding-bottom: 10px;
                    }

                    .filter-block h4:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 40px;
                        height: 2px;
                        background: #2557a7;
                    }

                    .filter-block h4.no-underline:after {
                        display: none;
                    }

                    .form-group {
                        margin-bottom: 0;
                    }

                    .form-control {
                        height: 45px;
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                        padding: 8px 15px;
                        font-size: 14px;
                        color: #232360;
                        background: #fff;
                        transition: all 0.3s ease;
                        width: 100%;
                    }

                    .form-control:hover {
                        border-color: #2557a7;
                    }

                    .form-control:focus {
                        border-color: #2557a7;
                        box-shadow: 0 0 0 2px rgba(37,87,167,0.1);
                        outline: none;
                    }

                    .form-control::placeholder {
                        color: #9aa0a6;
                    }

                    select.form-control {
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23232360' d='M6 8.825L1.175 4 2.05 3.125 6 7.075 9.95 3.125 10.825 4z'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 15px center;
                        padding-right: 35px;
                        cursor: pointer;
                    }

                    .btn-close {
                        position: absolute;
                        right: 15px;
                        top: 15px;
                        padding: 0;
                        background: transparent;
                        border: none;
                        color: #232360;
                        opacity: 0.7;
                        transition: opacity 0.3s ease;
                    }

                    .btn-close:hover {
                        opacity: 1;
                    }

                    @media (max-width: 1023px) {
                        .filters-outer {
                            padding: 20px;
                        }
                    }

                    .range-slider-one {
                        padding: 0 10px;
                    }

                    .range-slider {
                        position: relative;
                        width: 100%;
                        height: 4px;
                        background: #e0e0e0;
                        border-radius: 2px;
                        margin: 20px 0;
                    }

                    .range-slider__range {
                        position: absolute;
                        height: 100%;
                        background: #2557a7;
                        border-radius: 2px;
                        transition: width 0.2s ease;
                    }

                    .range-slider__input {
                        position: absolute;
                        width: 100%;
                        height: 4px;
                        top: 0;
                        left: 0;
                        opacity: 0;
                        cursor: pointer;
                        -webkit-appearance: none;
                    }

                    .range-slider__input::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 16px;
                        height: 16px;
                        background: #2557a7;
                        border-radius: 50%;
                        cursor: pointer;
                        margin-top: -6px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .range-slider__input::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        background: #2557a7;
                        border-radius: 50%;
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .input-outer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 10px;
                    }

                    .team-size-amount {
                        font-size: 14px;
                        color: #232360;
                        font-weight: 500;
                    }

                    .team-size-amount .amount {
                        color: #2557a7;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default FilterSidebar;
