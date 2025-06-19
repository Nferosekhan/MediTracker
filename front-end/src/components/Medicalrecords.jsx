import React, { useState, useEffect } from "react";
import axios from "axios";

export const Medicalrecords = ({ setActivePage }) => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost/meditracksystem/api/medicalrecords.php");
      setRecords(res.data);
    } catch (err) {
      alert("Error fetching records");
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem("editRecordId", id);
    setActivePage("editmedicalrecord");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const res = await axios.post(
          "http://localhost/meditracksystem/api/deletemedicalrecord.php",
          { id },
          { headers: { "Content-Type": "application/json" } }
        );
        fetchRecords();
        alert(res.data.message);
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="mb-3">
        <h1>
          Medical Records
        </h1>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Id</th>
            <th>Title</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            currentRecords.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.id}</td>
                <td>{rec.patient_id}</td>
                <td>{rec.title}</td>
                <td>{rec.record_type}</td>
                <td>{rec.record_date}</td>
                <td>{rec.description}</td>
                <td>
                  {rec.record_file ? (
                    <a href={`http://localhost/meditracksystem/uploads/${rec.record_file}`} target="_blank" rel="noreferrer">
                      View File
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button className="btn btn-info m-1" onClick={() => handleEdit(rec.id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger m-1" onClick={() => handleDelete(rec.id)}>
                    Delete
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
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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