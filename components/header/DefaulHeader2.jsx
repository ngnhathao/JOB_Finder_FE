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
  const [userName, setUserName] = useState('My Account');
  const [avatar, setAvatar] = useState("/images/resource/candidate-1.png");

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

    if (typeof window !== 'undefined') {
        const userString = localStorage.getItem('user');
        console.log('User string from localStorage (DefaulHeader2):', userString);
        if (userString) {
            const userObj = JSON.parse(userString);
            console.log('Parsed user object (DefaulHeader2):', userObj);
            if (userObj.fullName) setUserName(userObj.fullName);
            else if (userObj.name) setUserName(userObj.name);

            if (userObj.avatar) {
                console.log('Found user avatar URL (localStorage.avatar):', userObj.avatar);
                setAvatar(userObj.avatar);
            } else if (userObj.image) {
                console.log('Found user image URL (localStorage.image):', userObj.image);
                setAvatar(userObj.image);
            } else {
                console.log('No user avatar/image URL found in localStorage user object.');
            }
        } else {
            console.log('No user data found in localStorage (DefaulHeader2).');
        }
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

    if (token && userRole) {
        if (!isLoggedIn || role !== userRole) {
            dispatch(setLoginState({ isLoggedIn: true, user: userName, role: userRole }));
        }
    } else {
        if (isLoggedIn) {
            dispatch(clearLoginState());
            setUserName('My Account');
            setAvatar("/images/resource/candidate-1.png");
        }
    }
  }, [isLoggedIn, role, dispatch]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      const Cookies = require('js-cookie');
      Cookies.remove('token', { path: '/' });
      Cookies.remove('role', { path: '/' });
      Cookies.remove('name', { path: '/' });
      Cookies.remove('token', { path: '/', domain: 'localhost' });
      Cookies.remove('role', { path: '/', domain: 'localhost' });
      Cookies.remove('name', { path: '/', domain: 'localhost' });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      console.log('LOGOUT CALLED: cookies and localStorage removed');
    }
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
                      src={avatar}
                      className="thumb"
                    />
                    <span className="name">{userName}</span>
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
                      src={avatar}
                      className="thumb"
                    />
                    <span className="name">{userName}</span>
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
                      src={avatar}
                      className="thumb"
                    />
                    <span className="name">{userName}</span>
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
