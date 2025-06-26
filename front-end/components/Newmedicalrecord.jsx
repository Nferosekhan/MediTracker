import React, { useState } from 'react';
import axios from 'axios';

import { BASE_URL } from '../config';export const Newmedicalrecord = ({ setActivePage }) => {
  const [form, setForm] = useState({
    title: '',
    record_type: '',
    record_date: '',
    description: ''
  });

  const [recordFile, setRecordFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setRecordFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      data.append(key, val);
    });
    data.append("patient_id", localStorage.getItem("addNewRecord"));
    localStorage.removeItem("addNewRecord")
    if (recordFile) data.append("record_file", recordFile);

    try {
      const res = await axios.post(`${BASE_URL}/newmedicalrecord.php`, data);
      alert(res.data.message || "Record added.");
      setActivePage("medicalrecords");
    } catch (err) {
      alert("Error saving record.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>New Medical Record</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Title</label>
          <input type="text" name="title" className="form-control" onChange={handleChange} required placeholder="Enter the title" />
        </div>

        <div className="mb-3">
          <label>Record Type</label>
          <select name="record_type" className="form-control" onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="scan">Scan</option>
            <option value="lab">Lab</option>
            <option value="prescription">Prescription</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Record Date</label>
          <input type="date" name="record_date" className="form-control" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Upload File</label>
          <input type="file" name="record_file" className="form-control" onChange={handleFileChange} required />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" onChange={handleChange} required placeholder="Enter the Description" ></textarea>
        </div>

        <button type="submit" className="btn btn-success">Add Record</button>
      </form>
    </div>
  );
};