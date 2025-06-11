"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobService } from "../../../../../services/jobService";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobApplicants(jobId);
        setApplicants(response);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  if (loading) {
    return <div className="text-center py-5">Loading applicants...</div>;
  }

  if (!jobId) {
    return <div className="text-center py-5">No job selected</div>;
  }

  if (applicants.length === 0) {
    return <div className="text-center py-5">No applicants found for this job</div>;
  }

  return (
    <>
      {applicants.map((applicant) => (
        <div
          className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
          key={applicant.id}
        >
          <div className="inner-box">
            <div className="content">
              <figure className="image">
                <Image
                  width={90}
                  height={90}
                  src={applicant.avatar || "/images/resource/candidate-1.png"}
                  alt={applicant.name}
                />
              </figure>
              <h4 className="name">
                <Link href={`/candidates-single-v1/${applicant.id}`}>
                  {applicant.name}
                </Link>
              </h4>

              <ul className="candidate-info">
                <li className="designation">{applicant.designation}</li>
                <li>
                  <span className="icon flaticon-map-locator"></span>{" "}
                  {applicant.location}
                </li>
                <li>
                  <span className="icon flaticon-money"></span> $
                  {applicant.hourlyRate} / hour
                </li>
              </ul>

              <ul className="post-tags">
                {applicant.tags?.map((tag, i) => (
                  <li key={i}>
                    <a href="#">{tag}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="option-box">
              <ul className="option-list">
                <li>
                  <button data-text="View Application">
                    <span className="la la-eye"></span>
                  </button>
                </li>
                <li>
                  <button 
                    data-text="Approve Application"
                    className={applicant.status === 'approved' ? 'approved' : ''}
                  >
                    <span className="la la-check"></span>
                  </button>
                </li>
                <li>
                  <button 
                    data-text="Reject Application"
                    className={applicant.status === 'rejected' ? 'rejected' : ''}
                  >
                    <span className="la la-times-circle"></span>
                  </button>
                </li>
                <li>
                  <button data-text="Delete Application">
                    <span className="la la-trash"></span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Applicants;
