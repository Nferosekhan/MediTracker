import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BASE_URL } from '../config';export const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 5;

  useEffect(() => {
    axios.get(`${BASE_URL}/get_prescriptions.php`)
      .then(res => setPrescriptions(res.data));
  }, []);

  const indexOfLast = currentPage * prescriptionsPerPage;
  const indexOfFirst = indexOfLast - prescriptionsPerPage;
  const currentPrescriptions = prescriptions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(prescriptions.length / prescriptionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <h2>📝 E-Prescriptions</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {currentPrescriptions.map(p => (
            <tr key={p.id}>
              <td>{p.patient_name}</td>
              <td>{p.doctor_name}</td>
              <td>{
                    new Date(p.visit_date).getTime() === 0
                      ? 'Upcoming'
                      : new Date(p.visit_date).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).replace(',', '').replace(/\//g, '-')
                  }
              </td>
              <td>
                {p.prescription_file ? (
                  <a href={`${window.location.hostname === "localhost" ? "http://localhost/meditracksystem/uploads" : "http://dctcontrichy.com/meditrack/uploads"}/prescriptions/${p.prescription_file}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    View PDF
                  </a>
                ) : 'Not Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

    </div>
  );
};