import React, { useEffect, useState } from "react";
import axios from "axios";

import { BASE_URL } from '../config';export const Billing = ({ setActivePage }) => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bills.php`);
      setRecords(res.data);
    } catch (err) {
      alert("Error fetching billing records");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    localStorage.setItem("editBillingId", id);
    setActivePage("editbilling");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.post(`${BASE_URL}/deletebill.php`, { id });
      fetchData();
    }
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <>
      <h2>
        Billing Records
        <button className="btn btn-primary float-end" onClick={() => setActivePage("newbilling")}>Add Billing</button>
      </h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Id</th>
            <th>Type</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Status</th>
            <th>Mode</th>
            <th>Txn ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length === 0 ? (
            <tr><td colSpan="11">No billing found</td></tr>
          ) : (
            currentRecords.map(record => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.patient_id}</td>
                <td>{record.service_type}</td>
                <td>{record.service_date}</td>
                <td>{record.amount}</td>
                <td>{record.discount}</td>
                <td>{record.total}</td>
                <td>{record.payment_status}</td>
                <td>{record.payment_mode}</td>
                <td>{record.transaction_id}</td>
                <td>
                  <button className="btn btn-info btn-sm m-1" onClick={() => handleEdit(record.id)}>Edit</button>
                  <button className="btn btn-danger btn-sm m-1" onClick={() => handleDelete(record.id)}>Delete</button>
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
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};