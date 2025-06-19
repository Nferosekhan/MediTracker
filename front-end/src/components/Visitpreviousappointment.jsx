import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
export const Visitpreviousappointment = ({ setActivePage }) => {
  const [appointment, setAppointment] = useState(null);

  const appointmentId = localStorage.getItem("visitappointmentId");

  useEffect(() => {
    axios
      .get(`http://localhost/meditracksystem/api/get_appointment_details.php?id=${appointmentId}`)
      .then((res) => {
        const data = res.data;
        if (data) {
          setAppointment(data);
        }
      });
  }, [appointmentId]);

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Visit Summary</h2>

      <div className="mb-3">
        <label><strong>Summary</strong></label>
        <p className="form-control-plaintext">{appointment.summary || "Not available"}</p>
      </div>

      <div className="mb-3">
        <label><strong>Diagnosis</strong></label>
        <p className="form-control-plaintext">{appointment.diagnosis || "Not available"}</p>
      </div>

      <div className="mb-3">
        <label><strong>Prescription File</strong></label><br />
        {appointment.prescription_file ? (
          <>
            <p className="text-muted">File: {appointment.prescription_file}</p>
            <a className="btn btn-primary" href={`http://localhost/meditracksystem/uploads/${appointment.prescription_file}`} download={appointment.prescription_file} target="_blank" rel="noopener noreferrer">
              Download Prescription
            </a>
          </>
        ) : (
          <p>No file uploaded.</p>
        )}
      </div>

      <hr />
      <h4>Reminder Details</h4>

      <div className="row">
        <div className="col-md-4 mb-2">
          <label><strong>Type</strong></label>
          <p className="form-control-plaintext">{appointment.type || "-"}</p>
        </div>

        <div className="col-md-4 mb-2">
          <label><strong>Date & Time</strong></label>
          <p className="form-control-plaintext">{moment(appointment.trigger_time).format('DD-MM-YYYY hh:mm:ss A') || "-"}</p>
        </div>

        <div className="col-md-4 mb-2">
          <label><strong>Method</strong></label>
          <p className="form-control-plaintext">{appointment.method || "-"}</p>
        </div>

        <div className="col-md-4 mb-2">
          <label><strong>Message</strong></label>
          <p className="form-control-plaintext">{appointment.message || "-"}</p>
        </div>

        <div className="col-md-4 mb-2">
          <label><strong>Status</strong></label>
          <p className="form-control-plaintext">{appointment.status || "-"}</p>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => setActivePage("previousappointments")}>
        Back to Previous Appointments
      </button>
    </div>
  );
};