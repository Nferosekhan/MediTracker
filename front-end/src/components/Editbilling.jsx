import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BASE_URL } from '../config';export const Editbilling = ({ setActivePage }) => {
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
  const billingId = localStorage.getItem("editBillingId");

  useEffect(() => {
    axios.get(`${BASE_URL}/bills.php?id=${billingId}`)
      .then(res => setForm(res.data))
      .catch(err => alert("Failed to fetch billing details"));

    axios.get(`${BASE_URL}/patients.php`)
      .then(res => setPatients(res.data))
      .catch(err => alert("Failed to fetch patients"));
  }, [billingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };
    if (name === 'amount' || name === 'discount') {
      const amt = parseFloat(updated.amount) || 0;
      const dis = parseFloat(updated.discount) || 0;
      updated.total = (amt - dis).toFixed(2);
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      form.idval = billingId;
      const res = await axios.post(`${BASE_URL}/updatebill.php`, form);
      alert('Bill updated successfully');
      setActivePage("billing");
    } catch (err) {
      console.error(err);
      alert("Failed to update billing");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Billing</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Patient</label>
          <select name="patient_id" className="form-control" value={form.patient_id} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Service Type</label>
          <select name="service_type" className="form-control" value={form.service_type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="consultation">Consultation</option>
            <option value="lab">Lab</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Service Date</label>
          <input type="date" name="service_date" className="form-control" value={form.service_date} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Amount (₹)</label>
          <input type="number" step="0.01" name="amount" className="form-control" value={form.amount} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Discount (₹)</label>
          <input type="number" step="0.01" name="discount" className="form-control" value={form.discount} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Total (₹)</label>
          <input type="number" step="0.01" name="total" className="form-control" value={form.total} readOnly />
        </div>

        <div className="mb-3">
          <label>Payment Status</label>
          <select name="payment_status" className="form-control" value={form.payment_status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Payment Mode</label>
          <select name="payment_mode" className="form-control" value={form.payment_mode} onChange={handleChange} required>
            <option value="">Select Mode</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Transaction ID</label>
          <input type="text" name="transaction_id" className="form-control" value={form.transaction_id} onChange={handleChange} />
        </div>

        <button className="btn btn-primary">Update Billing</button>
      </form>
    </div>
  );
};