"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const JobCategorie1 = () => {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch("https://localhost:7266/api/Industry");
        const data = await res.json();
        setIndustries(data);
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <>
      {industries.map((item) => (
        <div
          className="category-block col-lg-4 col-md-6 col-sm-12"
          key={item.industryId}
        >
          <div className="inner-box">
            <div className="content">
              <span className={`icon flaticon-briefcase`}></span>
              <h4>
                <Link href="/job-list-v1">{item.industryName}</Link>
              </h4>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobCategorie1;
