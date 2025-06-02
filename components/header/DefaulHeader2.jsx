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
import adminMenuData from "../../data/adminMenuData";



const DefaulHeader2 = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [navbar, setNavbar] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'My Account',
    avatar: "/images/resource/candidate-1.png"
  });

  const { isLoggedIn, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const changeBackground = () => {
    if (typeof window !== 'undefined' && window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  // Chỉ chạy một lần khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", changeBackground);
    }

    // Kiểm tra và cập nhật trạng thái đăng nhập
    const token = authService.getToken();
    const userRole = authService.getRole();
    const userString = localStorage.getItem('user');

    if (token && userRole && userString) {
      try {
        const userObj = JSON.parse(userString);
        const userName = userObj.fullName || userObj.name || 'My Account';
        const userAvatar = userObj.avatar || userObj.image || "/images/resource/candidate-1.png";

        // Cập nhật Redux state
        dispatch(setLoginState({ 
          isLoggedIn: true, 
          user: userName, 
          role: userRole 
        }));

        // Cập nhật local state
        setUserInfo({
          name: userName,
          avatar: userAvatar
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", changeBackground);
      }
    };
  }, []); // Empty dependency array

  // Chỉ cập nhật UI khi có thay đổi từ Redux state
  useEffect(() => {
    if (isLoggedIn && user) {
      setUserInfo(prev => ({
        ...prev,
        name: user
      }));  
    } else if (!isLoggedIn) {
      setUserInfo({
        name: 'My Account',
        avatar: "/images/resource/candidate-1.png"
      });
    }
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu authentication
    authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Cập nhật state
    dispatch(clearLoginState());
    setUserInfo({
      name: 'My Account',
      avatar: "/images/resource/candidate-1.png"
    });

    // Chuyển hướng về trang chủ
    window.location.href = '/';
  };

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      handleLogout();
    }
  };

  return (
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="main-box">
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

          <HeaderNavContent />
        </div>

        <div className="outer-box">
          {isLoggedIn ? (
            <div className="logged-in-info">
              {role === 'Company' && (
                <div className="dropdown dashboard-option">
                  <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image
                      alt="avatar"
                      width={50}
                      height={50}
                      src={userInfo.avatar}
                      className="thumb"
                    />
                    <span className="name">{userInfo.name}</span>
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
              {role === 'Candidate' && (
                <div className="dropdown dashboard-option">
                  <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image
                      alt="avatar"
                      width={50}
                      height={50}
                      src={userInfo.avatar}
                      className="thumb"
                    />
                    <span className="name">{userInfo.name}</span>
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
                <div className="dropdown dashboard-option">
                  <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image
                      alt="avatar"
                      width={50}
                      height={50}
                      src={userInfo.avatar}
                      className="thumb"
                    />
                    <span className="name">{userInfo.name}</span>
                  </a>
                  <ul className="dropdown-menu">
                    {adminMenuData.map((item) => (
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
            </div>
          ) : (
            <>
              <Link href="/candidates-dashboard/cv-manager" className="upload-cv">
                Upload your CV
              </Link>
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
