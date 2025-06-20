import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGauge, faUserMd, faUserInjured, faNotesMedical, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import {Header} from './Header';
import {Footer} from './Footer';
import { Doctors } from './Doctors';
import { Newdoctor } from './Newdoctor';
import { Editdoctor } from './Editdoctor';
import { Patients } from './Patients';
import { Newpatient } from './Newpatient';
import { Editpatient } from './Editpatient';
import { Medicalrecords } from './Medicalrecords';
import { Newmedicalrecord } from './Newmedicalrecord';
import { Editmedicalrecord } from './Editmedicalrecord';
import { Billing } from './Billing';
import { Newbilling } from './Newbilling';
import { Editbilling } from './Editbilling';
import { Adashboard } from './Adashboard';
import { OfflineAppointmentForm } from './OfflineAppointmentForm';
import { AdminPrescriptions } from './AdminPrescriptions';
import { useNavigate, useLocation } from 'react-router-dom';


export const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
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

    axios.get('http://localhost/meditracksystem/api/total_count.php')
      .then(res => {
        setDoctorCount(res.data.total_doctors);
        setPatientCount(res.data.total_patients);
      })
      .catch(err => console.error('Error fetching doctors count:', err));

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const renderContent = () => {
    switch (activePage) {
      case 'doctors': return <Doctors setActivePage={setActivePage} />;
      case 'newdoctor': return <Newdoctor setActivePage={setActivePage} />;
      case 'editdoctor': return <Editdoctor setActivePage={setActivePage} />;
      case 'patients': return <Patients setActivePage={setActivePage} />;
      case 'newpatient': return <Newpatient setActivePage={setActivePage} />;
      case 'editpatient': return <Editpatient setActivePage={setActivePage} />;
      case 'medicalrecords': return <Medicalrecords setActivePage={setActivePage} />;
      case 'newmedicalrecord': return <Newmedicalrecord setActivePage={setActivePage} />;
      case 'editmedicalrecord': return <Editmedicalrecord setActivePage={setActivePage} />;
      case 'billing': return <Billing setActivePage={setActivePage} />;
      case 'newbilling': return <Newbilling setActivePage={setActivePage} />;
      case 'editbilling': return <Editbilling setActivePage={setActivePage} />;
      case 'offlineappointment': return <OfflineAppointmentForm setActivePage={setActivePage} />;
      case 'prescriptions': return <AdminPrescriptions setActivePage={setActivePage} />;
      default: return <Adashboard doctorCount={doctorCount} patientCount={patientCount} />;
    }
 };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rememberme = localStorage.getItem('rememberme');
    const usertype = localStorage.getItem('usertype');
    if (!token && rememberme=='0' && usertype!="admin") {
      navigate('/');
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
         	<a href="#" onClick={() => setActivePage("doctors")}>
         		<FontAwesomeIcon icon={faUserMd} /> {isOpen && 'Doctors'}
         	</a>
         </li>
         <li>
         	<a href="#" onClick={() => setActivePage("patients")}>
         		<FontAwesomeIcon icon={faUserInjured} /> {isOpen && 'Patients'}
         	</a>
         </li>
         <li>
          <a href="#" onClick={() => setActivePage("medicalrecords")}>
            <FontAwesomeIcon icon={faNotesMedical} /> {isOpen && 'Medical Records'}
          </a>
         </li>
         <li>
          <a href="#" onClick={() => setActivePage("billing")}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} /> {isOpen && 'Billing'}
          </a>
         </li>
         <li>
          <a href="#" onClick={() => setActivePage("offlineappointment")}>
            <FontAwesomeIcon icon={faNotesMedical} /> {isOpen && 'Offline Appointments'}
          </a>
         </li>
         <li>
          <a href="#" onClick={() => setActivePage("prescriptions")}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} /> {isOpen && 'E-Prescriptions'}
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