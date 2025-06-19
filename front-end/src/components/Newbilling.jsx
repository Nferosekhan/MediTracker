import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Newbilling = ({ setActivePage }) => {
  const [form, setForm] = useState({
    patient_id: '',
    service_type: '',
    service_date: '',
    amount: '',
    discount: '',
    total: '',
    payment_status: '',
    payment_mode: '',
    transaction_id: ''
  });

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/meditracksystem/api/patients.php")
      .then(res => setPatients(res.data))
      .catch(() => alert("Failed to fetch patients"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'amount' || name === 'discount') {
      const amount = parseFloat(updatedForm.amount) || 0;
      const discount = parseFloat(updatedForm.discount) || 0;
      updatedForm.total = (amount - discount).toFixed(2);
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost/meditracksystem/api/newbill.php', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Bill added successfully");
      setActivePage("billing");
    } catch (err) {
      console.error(err);
      alert("Failed to add billing record");
    }
  };

  return (
    <div className="container mt-4">
      <h2>New Billing Entry</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Patient</label>
          <select name="patient_id" className="form-control" onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Service Type</label>
          <select name="service_type" className="form-control" onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="consultation">Consultation</option>
            <option value="lab">Lab</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Service Date</label>
          <input type="date" name="service_date" className="form-control" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Amount (₹)</label>
          <input type="number" step="0.01" name="amount" className="form-control" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Discount (₹)</label>
          <input type="number" step="0.01" name="discount" className="form-control" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Total (₹)</label>
          <input type="number" step="0.01" name="total" className="form-control" value={form.total} readOnly required />
        </div>

        <div className="mb-3">
          <label>Payment Status</label>
          <select name="payment_status" className="form-control" onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Payment Mode</label>
          <select name="payment_mode" className="form-control" onChange={handleChange} required>
            <option value="">Select Mode</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Transaction ID</label>
          <input type="text" name="transaction_id" className="form-control" placeholder="Enter transaction ID" onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-success">Save Billing</button>
      </form>
    </div>
  );
};