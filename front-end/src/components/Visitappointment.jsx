import React, { useEffect, useState } from "react";
import axios from "axios";

export const Visitappointment = ({ setActivePage }) => {
  const [appointment, setAppointment] = useState(null);
  const [summary, setSummary] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");

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
        console.log(data);
        setAppointment(data);

        if (data.summary) setSummary(data.summary);
        if (data.diagnosis) setDiagnosis(data.diagnosis);
        if (data.prescription_file) setExistingFileName(data.prescription_file);

        if (data.trigger_time) setReminderTime(data.trigger_time);
        if (data.message) setReminderMessage(data.message);
        if (data.method) setReminderMethod(data.method);
        if (data.status) setStatus(data.status);
        if (data.type) setReminderType(data.type);
      });
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("appointment_id", appointmentId);
    formData.append("patient_id", appointment.patient_id);
    formData.append("doctor_id", appointment.doctor_id);
    formData.append("visit_date", new Date().toISOString().split("T")[0]);
    formData.append("summary", summary);
    formData.append("diagnosis", diagnosis);

    if (prescriptionFile) {
      formData.append("prescription_file", prescriptionFile);
    }

    formData.append("reminder_type", reminderType);
    formData.append("reminder_message", reminderMessage);
    formData.append("reminder_time", reminderTime);
    formData.append("reminder_method", reminderMethod);
    formData.append("status", status);

    const res = await axios.post("http://localhost/meditracksystem/api/save_visit.php", formData);
    console.log(res.data);
    setActivePage("appointments");
  };

  if (!appointment) return <p>Loading...</p>;

  return (
  <>
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

        <div className="mb-3">
          <label>Upload Prescription File</label>
          {existingFileName && (
            <p className="text-muted mb-1">Existing file: <em>{existingFileName}</em></p>
          )}
          <input type="file" className="form-control" onChange={(e) => setPrescriptionFile(e.target.files[0])} required={!existingFileName} />
        </div>

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
          Save Visit
        </button>
      </form>
    </div>
  </>
  );
};