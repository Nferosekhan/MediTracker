import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';export const Doctors = ({ setActivePage }) => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const handleEdit = (id) => {
    localStorage.setItem("editDoctorId", id);
    setActivePage("editdoctor");
  };
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors.php`);
      setDoctors(res.data);
    } catch (err) {
      alert("Error fetching doctors");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const res = await axios.post(`${BASE_URL}/deletedoctor.php`, { id }, { headers: { "Content-Type": "application/json" } });
        fetchDoctors();
        alert(res.data.message);
      } catch (err) {
        alert("Error deleting doctor");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await axios.post(
        `${BASE_URL}/updatestatus.php`,
        { id, status: updatedStatus, type: "doctor" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.message === "Successfully Updated") {
        fetchDoctors();
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
    fetchDoctors();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="mb-3">
        <h1>
        	Doctors
        	<button className="btn btn-primary" onClick={() => setActivePage("newdoctor")} style={{float:"right"}}>
          	New Doctor
        	</button>
      	</h1>
      </div>
      <table className="table table-bordered">
      	<thead>
      		<tr>
      			<th>Id</th>
      			<th>Name</th>
      			<th>Email</th>
      			<th>Specialization</th>
      			<th>Degree</th>
      			<th>Experience</th>
      			<th>License</th>
      			<th>Action</th>
      		</tr>
      	</thead>
      	<tbody>
      		{currentDoctors.length === 0 ? (
	            <tr><td colSpan={8} style={{textAlign:"center"}}>No doctors found</td></tr>
	          ) : (
	            currentDoctors.map(doctor => (
	              <tr key={doctor.id}>
	                <td>{doctor.id}</td>
	                <td>{doctor.name}</td>
	                <td>{doctor.email}</td>
	                <td>{doctor.specialization}</td>
	                <td>{doctor.degree}</td>
	                <td>{doctor.experience_years}</td>
	                <td>{doctor.license_number}</td>
	                <td>
	                  <button className="btn m-1 btn-info" onClick={() => handleEdit(doctor.id)}>
                      Edit
                    </button>
	                  &nbsp;
                    <button className={`btn m-1 ${doctor.status === 'active' ? 'btn-warning' : 'btn-success'}`} onClick={() => handleStatusToggle(doctor.id, doctor.status)}>
                      {doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    &nbsp;
	                  <button className="btn m-1 btn-danger" onClick={() => handleDelete(doctor.id)}>Delete</button>
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