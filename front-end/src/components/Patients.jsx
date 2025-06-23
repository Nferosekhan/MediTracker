import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';export const Patients = ({ setActivePage }) => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const handleEdit = (id) => {
    localStorage.setItem("editPatientId", id);
    setActivePage("editpatient");
  };
  const handleAddRecords = (id) => {
    localStorage.setItem("addNewRecord", id);
    setActivePage("newmedicalrecord");
  };
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/patients.php`);
      setPatients(res.data);
    } catch (err) {
      alert("Error fetching patients");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const res = await axios.post(`${BASE_URL}/deletepatient.php`, { id }, { headers: { "Content-Type": "application/json" } });
        fetchPatients();
        alert(res.data.message);
      } catch (err) {
        alert("Error deleting patient");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await axios.post(
        `${BASE_URL}/updatestatus.php`,
        { id, status: updatedStatus, type: "patient" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.message === "Successfully Updated") {
        fetchPatients();
      } else {
        console.error("Failed to update status:", res.data);
        alert("Status update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="mb-3">
        <h1>
          Patients
          <button className="btn btn-primary" onClick={() => setActivePage("newpatient")} style={{float:"right"}}>
            New Patient
          </button>
        </h1>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Blood Group</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign:"center"}}>No patients found</td></tr>
            ) : (
              currentPatients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.blood_group}</td>
                  <td>{patient.address}</td>
                  <td>
                    <button className="btn m-1 btn-info" onClick={() => handleEdit(patient.id)}>
                      Edit
                    </button>
                    &nbsp;
                    <button className="btn m-1 btn-info" onClick={() => handleAddRecords(patient.id)}>
                      Add Records
                    </button>
                    &nbsp;
                    <button className={`btn m-1 ${patient.status === 'active' ? 'btn-warning' : 'btn-success'}`} onClick={() => handleStatusToggle(patient.id, patient.status)}>
                      {patient.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    &nbsp;
                    <button className="btn m-1 btn-danger" onClick={() => handleDelete(patient.id)}>Delete</button>
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