import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
export const Adashboard = ({doctorCount, patientCount}) => {
  return (
    <>
      <div className="dashboard-container">
		    <h2><FontAwesomeIcon icon={faGauge} /> Dashboard</h2>
		    <div className="stats">
		      <div className="stat-card doctor-card">
		        <h3>Total Doctors</h3>
		        <p>{doctorCount}</p>
		      </div>
		      <div className="stat-card patient-card">
		        <h3>Total Patients</h3>
		        <p>{patientCount}</p>
		      </div>
		    </div>
	   </div>
    </>
  );
};