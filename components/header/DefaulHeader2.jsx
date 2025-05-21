'use client'

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { clearLoginState, setLoginState } from '@/features/auth/authSlice';
import { authService } from "@/services/authService";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import employerMenuData from "../../data/employerMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import candidatesMenuData from "../../data/candidatesMenuData";


const DefaulHeader2 = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [navbar, setNavbar] = useState(false);

  const { isLoggedIn, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const changeBackground = () => {
    if (typeof window !== 'undefined' && window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", changeBackground);
    }

    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener("scroll", changeBackground);
        }
    };
  }, []);

  useEffect(() => {
    const token = authService.getToken();
    const userRole = authService.getRole();
    const userName = authService.getName();

    if (token && userRole) {
        if (!isLoggedIn || role !== userRole || user !== userName) {
            dispatch(setLoginState({ isLoggedIn: true, user: userName, role: userRole }));
        }
    } else {
        if (isLoggedIn) {
            dispatch(clearLoginState());
        }
    }
  }, [isLoggedIn, role, user, dispatch]);

  const handleLogout = () => {
    authService.logout();
    dispatch(clearLoginState());
    router.push('/');
  };

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      handleLogout();
    }
  };

  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image
                  width={154}
                  height={50}
                  src="/images/logo.svg"
                  alt="brand"
                />
              </Link>
            </div>
          </div>
          {/* End .logo-box */}

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        <div className="outer-box">
          {/* Render nút hoặc thông tin tùy thuộc trạng thái đăng nhập */}
          {isLoggedIn ? (
            <div className="logged-in-info">
              {role === 'Employer' && (
                <div className="dropdown dashboard-option">
                  <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image
                      alt="avatar"
                      width={50}
                      height={50}
                      src="/images/resource/company-6.png"
                      className="thumb"
                    />
                    <span className="name">{user || 'My Account'}</span>
                  </a>
                  <ul className="dropdown-menu">
                    {employerMenuData.map((item) => (
                      <li
                        className={`${
                          isActiveLink(item.routePath, pathname)
                            ? "active"
                            : ""
                        } mb-1`}
                        key={item.id}
                      >
                        {item.isLogout ? (
                          <a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick(item); }}>
                            <i className={`la ${item.icon}`}></i>{" "}
                            {item.name}
                          </a>
                        ) : (
                          <Link href={item.routePath}>
                            <i className={`la ${item.icon}`}></i>{" "}
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* {role === 'User' && (
                <Link href="/candidates-dashboard/dashboard" className="theme-btn btn-style-three ml-2">
                  Dashboard Candidate
                </Link>
              )} */}
              {role === 'User' && (
                <div className="dropdown dashboard-option">
                  <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image
                      alt="avatar"
                      width={50}
                      height={50}
                      src="/images/resource/company-6.png"
                      className="thumb"
                    />
                    <span className="name">{user || 'My Account'}</span>
                  </a>
                  <ul className="dropdown-menu">
                    {candidatesMenuData.map((item) => (
                      <li
                        className={`${
                          isActiveLink(item.routePath, pathname)
                            ? "active"
                            : ""
                        } mb-1`}
                        key={item.id}
                      >
                        {item.isLogout ? (
                          <a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick(item); }}>
                            <i className={`la ${item.icon}`}></i>{" "}
                            {item.name}
                          </a>
                        ) : (
                          <Link href={item.routePath}>
                            <i className={`la ${item.icon}`}></i>{" "}
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {role === 'Admin' && (
                <Link href="/admin-dashboard" className="theme-btn btn-style-three ml-2">
                  Dashboard Admin
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* <!-- Add Listing --> */}
              <Link href="/candidates-dashboard/cv-manager" className="upload-cv">
                Upload your CV
              </Link>
              {/* <!-- Login/Register --> */}
              <div className="btn-box">
                <a
                  href="#"
                  className="theme-btn btn-style-three call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Login / Register
                </a>
                <Link
                  href="/employers-dashboard/post-jobs"
                  className="theme-btn btn-style-one"
                >
                  Job Post
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader2;
