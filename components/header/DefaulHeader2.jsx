'use client'

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { clearLoginState, setLoginState } from '@/features/auth/authSlice';
import { authService } from "@/services/authService";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";

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
                  src={require("@/public/images/jobfinder-logo.png").default || "/images/jobfinder-logo.png"}
                  alt="JobFinder logo"
                  title="JobFinder"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/images/logo.svg"; }}
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
              <span>Hi, {user || role} ({role})</span>
              {role === 'Employer' && (
                <Link href="/employers-dashboard/dashboard" className="theme-btn btn-style-three ml-2">
                  Dashboard Employer
                </Link>
              )}
              {role === 'User' && (
                <Link href="/candidates-dashboard/dashboard" className="theme-btn btn-style-three ml-2">
                  Dashboard Candidate
                </Link>
              )}
              {role === 'Admin' && (
                <Link href="/admin-dashboard" className="theme-btn btn-style-three ml-2">
                  Dashboard Admin
                </Link>
              )}
              <button onClick={handleLogout} className="theme-btn btn-style-three ml-2">
                Logout
              </button>
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
