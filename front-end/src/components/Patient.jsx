import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGauge, faCalendarAlt, faCalendarCheck, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import {Header} from './Header';
import {Footer} from './Footer';
import { Pdashboard } from './Pdashboard';
import { Appointment } from './Appointment';
import { History } from './History';
import { Previousappointments } from './Previousappointments';
import { Visitpreviousappointment } from './Visitpreviousappointment';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../config';export const Patient = () => {
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
      case 'appoinment': return <Appointment setActivePage={setActivePage} />;
      case 'history': return <History setActivePage={setActivePage} />;
      case 'visitpreviousappointment': return <Visitpreviousappointment setActivePage={setActivePage} />;
      case 'previousappointments': return <Previousappointments setActivePage={setActivePage} patientId={patientId} />;
      default: return <Pdashboard />;
    }
 };
 const [patientId, setPatientId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rememberme = localStorage.getItem('rememberme');
    const usertype = localStorage.getItem('usertype');
    if ((!token || token==null) || (rememberme==null || rememberme=='0') || (usertype==null || usertype!="patients")) {
      navigate('/logout');
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id;
        setPatientId(id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    if (location.state?.page) {
      setActivePage(location.state.page);
    }
  }, [location.state]);
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
            <a href="#" onClick={() => setActivePage("previousappointments")}>
              <FontAwesomeIcon icon={faCalendarCheck} /> {isOpen && 'Previous Appoinments'}
            </a>
           </li>
           <li>
            <a href="#" onClick={() => setActivePage("appoinment")}>
              <FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Appoinment'}
            </a>
           </li>
           <li>
            <a href="#" onClick={() => setActivePage("history")}>
              <FontAwesomeIcon icon={faFileMedical} /> {isOpen && 'History'}
            </a>
           </li>
          </ul>
        </div>
        <div className="content">
          {/*Main*/}
          <main className="card card-body">
            {renderContent()}
          </main>
          {/*Main*/}
        </div>
      </div>
      <Footer/>
    </>
  );
};