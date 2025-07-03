import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../config';
export const Patienthistory = ({ setActivePage }) => {
	const [histories, setHistories] = useState([]);
	const [patientName, setPatientName] = useState("");
	const id = localStorage.getItem("editPatientId");
	const patientname = localStorage.getItem("editPatientName");
	useEffect(() => {
	  setPatientName(patientname);
	  axios.post(`${BASE_URL}/patienthistory.php`, { id }, {
	    headers: { "Content-Type": "application/json" }
	  }).then(res => {
	    if (Array.isArray(res.data)) {
	      setHistories(res.data);
	    } else {
	      console.error("Expected array but got:", res.data);
	      setHistories([]);
	    }
	  }).catch(err => {
	    console.error("Failed to fetch history", err);
	    setHistories([]);
	  });
	}, []);
	const [currentPage, setCurrentPage] = useState(1);
   const historyPerPage = 5;

   const indexOfLastHistory = currentPage * historyPerPage;
   const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
   const currentHistories = histories.slice(indexOfFirstHistory, indexOfLastHistory);
   const totalPages = Math.ceil(histories.length / historyPerPage);

   const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
   };
  return (
    <>
    	<div className="mb-3">
        <h1>
          {patientName}
       </h1>
    	</div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Systolic BP</th>
            <th>Diastolic BP</th>
            <th>Sugar Fasting Level</th>
            <th>Sugar Postprandial Level</th>
            <th>Weight</th>
            <th>Height</th>
            <th>Heart Rate</th>
            <th>Temperature</th>
            <th>BMI</th>
          </tr>
        </thead>
        <tbody>
          {currentHistories.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign:"center"}}>No History Found</td></tr>
            ) : (
              currentHistories.map(history => (
                <tr key={history.id}>
                  <td>{history.doctor_name}</td>
                  <td>{moment(history.created_on).format("DD-MM-YYYY h:mm:ss A")}</td>
                  <td>{history.blood_presure_systolic}</td>
                  <td>{history.blood_presure_diastolic}</td>
                  <td>{history.sugar_fasting_level}</td>
                  <td>{history.sugar_postprandial_level}</td>
                  <td>{history.weight}</td>
                  <td>{history.height}</td>
                  <td>{history.heart_rate}</td>
                  <td>{history.temperature}</td>
                  <td>{history.bmi}</td>
                </tr>
              ))
            )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};