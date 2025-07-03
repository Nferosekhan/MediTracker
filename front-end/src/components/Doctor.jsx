import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGauge, faCalendarAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import {Header} from './Header';
import {Footer} from './Footer';
import { Ddashboard } from './Ddashboard';
import { Schedule } from './Schedule';
import { Appointments } from './Appointments';
import { Visitappointment } from './Visitappointment';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../config';export const Doctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 991) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const renderContent = () => {
    switch (activePage) {
      case 'schedule': return <Schedule setActivePage={setActivePage} />;
      case 'appoinments': return <Appointments setActivePage={setActivePage} />;
      case 'visit': return <Visitappointment setActivePage={setActivePage} />;
      default: return <Ddashboard doctorId={doctorId} />;
    }
 };
 const [doctorId, setDoctorId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rememberme = localStorage.getItem('rememberme');
    const usertype = localStorage.getItem('usertype');
    if ((!token || token==null) || (rememberme==null || rememberme=='0') || (usertype==null || usertype!="doctors")) {
      navigate('/logout');
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id;
        setDoctorId(id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    if (location.state?.page) {
      setActivePage(location.state.page);
    }
     const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.state]);
  const [showContent, setShowContent] = useState(false);
  return (
    <>
      <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="sidebar-wrapper">
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
          <ul className="nav-links">
            <li>
              <a href="#" onClick={() => setActivePage("dashboard")}>
                <FontAwesomeIcon icon={faGauge} /> {isOpen && 'Dashboard'}
              </a>
            </li>
           <li>
            <a href="#" onClick={() => setActivePage("schedule")}>
              <FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Schedule'}
            </a>
           </li>
           <li>
            <a href="#" onClick={() => setActivePage("appoinments")}>
              <FontAwesomeIcon icon={faCalendarCheck} /> {isOpen && 'Appoinments'}
            </a>
           </li>
          </ul>
        </div>
        <div className="content">
          {/*Main*/}
          <main className="card card-body">
            {showContent ? renderContent() : <p className="text-center">Loading content...</p>}
          </main>
          {/*Main*/}
        </div>
      </div>
      <Footer/>
    </>
  );
};