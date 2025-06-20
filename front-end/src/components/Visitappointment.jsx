import React, { useEffect, useState } from "react";
import axios from "axios";

export const Visitappointment = ({ setActivePage }) => {
  const [appointment, setAppointment] = useState(null);
  const [summary, setSummary] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptionPath, setPrescriptionPath] = useState("");

  const [reminderType, setReminderType] = useState("medicine");
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMethod, setReminderMethod] = useState("email");
  const [status, setStatus] = useState("upcoming");

  const appointmentId = localStorage.getItem("visitAppointmentId");

  useEffect(() => {
    axios
      .get(`http://localhost/meditracksystem/api/get_appointment_details.php?id=${appointmentId}`)
      .then((res) => {
        const data = res.data;
        if (!data) return;
        setAppointment(data);

        if (data.summary) setSummary(data.summary);
        if (data.diagnosis) setDiagnosis(data.diagnosis);
        if (data.prescription_file) setPrescriptionPath(data.prescription_file);

        if (data.trigger_time) setReminderTime(data.trigger_time);
        if (data.message) setReminderMessage(data.message);
        if (data.method) setReminderMethod(data.method);
        if (data.status) setStatus(data.status);
        if (data.type) setReminderType(data.type);
      });
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      appointment_id: appointmentId,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      visit_date: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', '').replace(/\//g, '-'),
      summary,
      diagnosis,
      reminder_type: reminderType,
      reminder_message: reminderMessage,
      reminder_time: reminderTime,
      reminder_method: reminderMethod,
      status
    };

    const res = await axios.post("http://localhost/meditracksystem/api/save_visit.php", form);
    if (res.data.prescription_file) {
      setPrescriptionPath(res.data.prescription_file);
    }
    setActivePage("appointments");
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Prescription - {appointment.patient_name}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Summary</label>
          <textarea className="form-control" value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Diagnosis</label>
          <textarea className="form-control" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
        </div>

        {prescriptionPath && (
          <div className="mb-3">
            <label>Generated Prescription</label><br />
            <a href={`http://localhost/meditracksystem/uploads/prescriptions/${prescriptionPath}`} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </div>
        )}

        <hr />
        <h4>Reminder</h4>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Type</label>
            <select className="form-control" value={reminderType} onChange={(e) => setReminderType(e.target.value)} required >
              <option value="medicine">Medicine</option>
              <option value="appointment">Appointment</option>
              <option value="test">Test</option>
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <label>Date & Time</label>
            <input type="datetime-local" className="form-control" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} required />
          </div>

          <div className="col-md-4 mb-2">
            <label>Method</label>
            <select className="form-control" value={reminderMethod} onChange={(e) => setReminderMethod(e.target.value)} required >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <label>Message</label>
            <input type="text" className="form-control" value={reminderMessage} onChange={(e) => setReminderMessage(e.target.value)} required />
          </div>

          <div className="col-md-4 mb-2">
            <label>Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)} required >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <button className="btn btn-success mt-3" type="submit">
          Save Visit & Generate PDF
        </button>
      </form>
    </div>
  );
};