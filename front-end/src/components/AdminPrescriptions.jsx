import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BASE_URL } from '../config';export const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/get_prescriptions.php`)
      .then(res => setPrescriptions(res.data));
  }, []);

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
          {prescriptions.map(p => (
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
                  <a
                    href={`http://localhost/meditracksystem/uploads/prescriptions/${p.prescription_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    View PDF
                  </a>
                ) : 'Not Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};