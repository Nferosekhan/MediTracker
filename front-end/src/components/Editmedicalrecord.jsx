import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from '../config';export const Editmedicalrecord = ({ setActivePage }) => {
  const [form, setForm] = useState({
    title: '',
    record_type: '',
    record_date: '',
    description: '',
    hid_file: ''
  });
  const [recordFile, setRecordFile] = useState(null);

  const recordId = localStorage.getItem("editRecordId");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/medicalrecords.php?id=${recordId}`)
      .then((res) => {
        if (res.data && res.data.id) {
          setForm({
            id: res.data.id,
            title: res.data.title || '',
            record_type: res.data.record_type || '',
            record_date: res.data.record_date || '',
            description: res.data.description || '',
            hid_file: res.data.record_file || ''
          });
        }
      });
  }, [recordId]);

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
    data.append('id', recordId);
    if (recordFile) data.append('record_file', recordFile);

    try {
      const res = await axios.post(
        `${BASE_URL}/updatemedicalrecord.php`,
        data
      );
      alert(res.data.message || "Record updated.");
      setActivePage("medicalrecords");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Medical Record</h2>
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <div className="mb-3">
          <label>Title</label>
          <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required placeholder="Enter the title" />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select className="form-control" name="record_type" value={form.record_type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="scan">Scan</option>
            <option value="lab">Lab</option>
            <option value="prescription">Prescription</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Record Date</label>
          <input type="date" className="form-control" name="record_date" value={form.record_date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Upload File</label>
          {form.hid_file && (
            <p className="text-muted">Current File: <em>{form.hid_file}</em></p>
          )}
          <input type="file" className="form-control" name="record_file" onChange={handleFileChange} />
          <input type="hidden" name="hid_file" value={form.hid_file} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Enter the Description"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Update Record</button>
      </form>
    </div>
  );
};