"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/header/DashboardHeader";
import DashboardAdminSidebar from "@/components/header/DashboardAdminSidebar";
import BreadCrumb from "@/components/dashboard-pages/BreadCrumb";
import Image from "next/image";

const API_URL = "https://localhost:7266/api/User";

const UserDetailPage = () => {
  const params = useParams();
  const userId = params.userId;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  // Fake data bổ sung cho các trường còn thiếu
  const fakeUser = {
    ...user,
    about: user.about || "Hello my name is Nicole Wells and web developer from Portland. In pharetra orci dignissim, blandit mi semper, ultricies diam. Suspendisse malesuada suscipit nunc non volutpat. Sed porta nulla id orci laoreet tempor non consequat enim.",
    videoUrl: user.videoUrl || "https://www.youtube.com/embed/tgbNymZ7vqY",
    gallery: user.gallery || [
      "https://placehold.co/190x167", "https://placehold.co/190x167", "https://placehold.co/190x167"
    ],
    education: user.education || [
      { degree: "Bachelors in Fine Arts", year: "2012-2014", school: "Modern College" }
    ],
    experience: user.experience || "0-2 Years",
    age: user.age || "28-33 Years",
    currentSalary: user.currentSalary || "11K - 15K",
    expectedSalary: user.expectedSalary || "26K - 30K",
    gender: user.gender || "Female",
    language: user.language || "English, German, Spanish",
    educationLevel: user.educationLevel || "Master Degree",
    social: user.social || { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
    professionalSkills: user.professionalSkills || ["app", "administrative", "android", "wordpress", "design", "react"],
    contact: user.contact || { email: user.email, phone: user.phone }
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      <DashboardHeader />
      <DashboardAdminSidebar />
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <Image width={90} height={90} src={fakeUser.avatar || "/images/resource/default-avatar.png"} alt="avatar" />
                  </figure>
                  <h4 className="name">{fakeUser.fullName}</h4>
                  <ul className="candidate-info">
                    <li className="designation">{fakeUser.role}</li>
                    <li><span className="icon flaticon-map-locator"></span> {fakeUser.phone}</li>
                    <li><span className="icon flaticon-money"></span> {fakeUser.currentSalary} / hour</li>
                    <li><span className="icon flaticon-clock"></span> Member Since, Aug 19, 2020</li>
                  </ul>
                  <ul className="post-tags">
                    {Array.isArray(fakeUser.skills) ? fakeUser.skills.map((val, i) => <li key={i}>{val}</li>) : fakeUser.skills}
                  </ul>
                </div>
                <div className="btn-box">
                  {fakeUser.cvUrl && (
                    <a className="theme-btn btn-style-one" href={fakeUser.cvUrl} target="_blank" rel="noopener noreferrer">Download CV</a>
                  )}
                  <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* About, Video, Gallery, Education, Sidebar */}
        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <div className="video-outer">
                    <h4>Candidates About</h4>
                    <div style={{marginBottom: 16}}>
                      <iframe width="100%" height="380" src={fakeUser.videoUrl} title="About Video" allowFullScreen />
                    </div>
                  </div>
                  <p>{fakeUser.about}</p>
                  {/* Gallery */}
                  <div className="portfolio-outer">
                    <div className="row">
                      {fakeUser.gallery.map((img, idx) => (
                        <div className="col-md-3" key={idx}>
                          <img src={img} alt="gallery" width={190} height={167} style={{marginBottom: 8}} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Education */}
                  <div className="mt-4">
                    <h4>Education</h4>
                    {fakeUser.education.map((edu, idx) => (
                      <div key={idx}>
                        <b>{edu.degree}</b> <span>({edu.year})</span>
                        <div>{edu.school}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Sidebar */}
              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li><i className="icon icon-calendar"></i><h5>Experience:</h5><span>{fakeUser.experience}</span></li>
                        <li><i className="icon icon-expiry"></i><h5>Age:</h5><span>{fakeUser.age}</span></li>
                        <li><i className="icon icon-rate"></i><h5>Current Salary:</h5><span>{fakeUser.currentSalary}</span></li>
                        <li><i className="icon icon-salary"></i><h5>Expected Salary:</h5><span>{fakeUser.expectedSalary}</span></li>
                        <li><i className="icon icon-gender"></i><h5>Gender:</h5><span>{fakeUser.gender}</span></li>
                        <li><i className="icon icon-language"></i><h5>Language:</h5><span>{fakeUser.language}</span></li>
                        <li><i className="icon icon-education"></i><h5>Education Level:</h5><span>{fakeUser.educationLevel}</span></li>
                      </ul>
                    </div>
                  </div>
                  {/* Social */}
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <div>Social media</div>
                      <div>
                        <a href={fakeUser.social.facebook}><i className="fab fa-facebook"></i></a>
                        <a href={fakeUser.social.twitter}><i className="fab fa-twitter"></i></a>
                        <a href={fakeUser.social.linkedin}><i className="fab fa-linkedin"></i></a>
                        <a href={fakeUser.social.instagram}><i className="fab fa-instagram"></i></a>
                      </div>
                    </div>
                  </div>
                  {/* Professional Skills */}
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <div>Professional Skills</div>
                      <div>
                        {fakeUser.professionalSkills.map((skill, idx) => (
                          <span key={idx} className="badge bg-secondary m-1">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <div>Contact Us</div>
                      <div>Email: {fakeUser.contact.email}</div>
                      <div>Phone: {fakeUser.contact.phone}</div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDetailPage; 