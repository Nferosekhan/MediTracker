import React, { useEffect, useState } from "react";
import axios from "axios";

import { BASE_URL } from '../config';export const Appointments = ({ setActivePage }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments.php`);
      setAppointments(res.data);
    }
    catch (err) {
      alert("Error fetching appointments");
    }
  };

  const handleVisit = (id,patient_name) => {
    localStorage.setItem("visitAppointmentId", id);
    localStorage.setItem("patientName", patient_name);
    setActivePage("visit");
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="mb-3">
        <h1>
          Appointments
        </h1>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center" }}>No appointments found</td></tr>
          ) : (
            currentAppointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{appt.patient_name}</td>
                <td>{appt.doctor_name}</td>
                <td>{appt.appointment_date}</td>
                <td>{appt.status}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleVisit(appt.id,appt.patient_name)}>
                    Visit
                  </button>
                </td>
              </tr>
            ))
          )}
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
    </>
  );
};