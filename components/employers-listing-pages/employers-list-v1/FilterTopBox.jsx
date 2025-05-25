'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FilterTopBox = (props) => {
  const { companies, loading, error } = props;
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetch("/api/Industry").then(res => {
      if (!res.ok) throw new Error("Failed to fetch industries");
      return res.json();
    })
      .then((industriesData) => {
        setIndustries(industriesData);
      })
      .catch((err) => {
        // Có thể set error cho industry nếu muốn
      });
  }, []);

  const industryMap = industries.reduce((acc, industry) => {
    acc[industry.industryId] = industry.industryName;
    return acc;
  }, {});

  // Lấy danh sách team size duy nhất
  const teamSizes = Array.from(new Set(companies.map(c => c.teamSize).filter(Boolean)));

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (loading) return <div className="loading-message">Đang tải dữ liệu...</div>;
  if (!companies || companies.length === 0) return <div>Không có công ty nào phù hợp</div>;

  return (
    <div className="companies-list">
      {companies.map((company) => (
        <div className="company-block-three" key={company.userId}>
          <div className="inner-box">
            <button className="bookmark-btn" title="Lưu công ty">
              <span className="flaticon-bookmark"></span>
            </button>
            <div className="content">
              <div className="content-inner">
                <span className="company-logo">
                  <Image
                    width={60}
                    height={60}
                    src={company.urlCompanyLogo || company.imageLogoLgr || '/images/resource/company-6.png'}
                    alt={company.companyName}
                  />
                </span>
                <div className="company-info-block">
                  <h4>
                    <Link href={`/employers-single-v1/${company.userId}`}>
                      {company.companyName}
                    </Link>
                  </h4>
                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-map-locator"></span> {company.location}
                    </li>
                    <li>
                      <span className="icon flaticon-briefcase"></span> {industryMap[company.industryId] || `Industry #${company.industryId}`}
                    </li>
                    <li>
                      <span className="fa fa-users" style={{ marginRight: 4 }}></span>
                      {company.teamSize || "Not specified"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .loading-message {
          text-align: center;
          padding: 1rem;
          font-size: 1.1rem;
        }

        .companies-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .company-block-three {
          width: 100%;
        }

        .inner-box {
          border: 1px solid #f0f0f0;
          padding: 24px;
          border-radius: 16px;
          transition: border 0.3s, box-shadow 0.3s;
          position: relative;
          background: #fff;
          box-shadow: 0 2px 12px rgba(30, 34, 40, 0.06);
          display: flex;
          align-items: center;
        }

        .inner-box:hover {
          border-color: #b3c6ff;
          box-shadow: 0 6px 24px rgba(30, 34, 40, 0.10);
        }

        .bookmark-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f4f6fb;
          border: none;
          font-size: 17px;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
          color: #232360;
          box-shadow: 0 2px 8px rgba(30, 34, 40, 0.04);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bookmark-btn .flaticon-bookmark:before {
          color: #232323 !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: inline-block !important;
          transition: color 0.18s;
        }

        .bookmark-btn:hover {
          background: #ececec;
          color: #232360;
          box-shadow: 0 4px 16px rgba(30, 34, 40, 0.10);
          transform: scale(1.04);
        }

        .bookmark-btn:hover .flaticon-bookmark:before {
          color: #232323 !important;
        }

        .content-inner {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }

        .company-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          min-height: 60px;
          max-width: 60px;
          max-height: 60px;
          background: #f4f6fb;
          border-radius: 50%;
          overflow: hidden;
        }
        .company-logo img {
          border-radius: 50%;
          object-fit: contain;
          width: 60px;
          height: 60px;
        }

        .company-info-block {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .company-info-block h4 {
          margin: 0;
          font-weight: 700;
          font-size: 1.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #232360;
        }

        .job-info {
          display: flex;
          gap: 18px;
          padding: 0;
          margin: 0;
          list-style: none;
          flex-wrap: wrap;
        }
        .job-info li {
          display: flex;
          align-items: center;
          font-size: 1rem;
          color: #6b7280;
          white-space: nowrap;
        }
        .job-info .icon, .job-info .fa {
          margin-right: 6px;
          font-size: 1.08em;
          color: #a0aec0;
        }

        @media (max-width: 700px) {
          .inner-box {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
          }
          .content-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .company-logo {
            margin-bottom: 8px;
          }
          .company-info-block h4 {
            font-size: 1.05rem;
          }
          .job-info {
            gap: 8px;
            font-size: 0.97rem;
          }
        }

        .company-block-three .bookmark-btn {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .company-block-three h4 {
          font-size: 18px;
          color: #202124;
          font-weight: 500;
          line-height: 26px;
          margin-bottom: 3px;
        }
      `}</style>
    </div>
  );
};

export default FilterTopBox;
