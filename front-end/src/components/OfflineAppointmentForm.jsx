import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";

export const OfflineAppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    date: "",
    time: "",
    reason: "",
  });

  useEffect(() => {
    axios.get("http://localhost/meditracksystem/api/getdoctors.php")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error loading doctors", err));

    axios.get("http://localhost/meditracksystem/api/patients.php")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error loading patients", err));
  }, []);

  useEffect(() => {
    if (formData.doctor_id) {
      axios
        .get(`http://localhost/meditracksystem/api/getschedule.php?doctor_id=${formData.doctor_id}`)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("Error fetching schedule:", err));
    }
  }, [formData.doctor_id]);

  useEffect(() => {
    if (formData.patient_id) {
      axios.get(`http://localhost/meditracksystem/api/checkappointment.php?patient_id=${formData.patient_id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data && Array.isArray(res.data.appointment) && res.data.appointment.length > 0) {
            const appt = res.data.appointment[0];
            setFormData({
              doctor_id: appt.doctor_id,
              patient_id: appt.patient_id,
              date: moment(appt.appointment_date).format("YYYY-MM-DD"),
              time: moment(appt.appointment_date).format("HH:mm"),
              reason: appt.reason,
            });
          }
        })
        .catch((err) => console.error("Error checking appointment:", err));
    }
  }, [formData.patient_id]);

    useEffect(() => {
      if (formData.date && schedules.length > 0 && formData.doctor_id) {
        const selectedDay = new Date(formData.date).toLocaleDateString("en-US", {
          weekday: "long",
        }).toLowerCase();

        const daySlot = schedules.find((s) => s.day === selectedDay);

        if (!daySlot) {
          setAvailableTimes([]);
          return;
        }

        const times = [];
        let current = new Date(`2024-01-01T${daySlot.start_time}`);
        const end = new Date(`2024-01-01T${daySlot.end_time}`);

        while (current <= end) {
          times.push(current.toTimeString().substring(0, 5));
          current.setMinutes(current.getMinutes() + 5);
        }

        setAvailableTimes(times);

        axios
          .get(`http://localhost/meditracksystem/api/getbookedslots.php?doctor_id=${formData.doctor_id}&date=${formData.date}`)
          .then((res) => {
            const booked = res.data.map((slot) => slot.time.substring(0, 5));
            setBookedSlots(booked);
          });
      }
    }, [formData.date, schedules]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointment_date = `${formData.date} ${formData.time}:00`;

    const payload = {
      doctor_id: formData.doctor_id,
      patient_id: formData.patient_id,
      appointment_date,
      reason: formData.reason,
    };

    try {
      const url = "http://localhost/meditracksystem/api/admin_create_offline_appointment.php";

      const res = await axios.post(url, payload);

      if (res.data.success) {
        setMessage(res.data.message);
      } else {
        setMessage(res.data.message || "Operation failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Request failed due to an error.");
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4">
      <h2>Offline Appointment Booking</h2>
      {message && <div className="alert alert-info mt-2">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="form-group">
            <label>Patient</label>
            <select name="patient_id" className="form-control" onChange={handleChange} required>
              <option value="">Select</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group mt-2">
            <label>Doctor</label>
            <select name="doctor_id" className="form-control" onChange={handleChange} required>
              <option value="">Select</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div className="form-group mt-2">
            <label>Date</label>
            <input type="date" name="date" className="form-control" onChange={handleChange} min={minDate} required />
          </div>

          <div className="form-group mt-2">
            <label><strong>Time</strong></label>
            <select
              name="time"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {availableTimes.length > 0 ? (
                availableTimes.map((t) => (
                  <option key={t} value={t} disabled={bookedSlots.includes(t)}>
                    {t} {bookedSlots.includes(t) ? "(Booked)" : ""}
                  </option>
                ))
              ) : (
                <option disabled>No available slots</option>
              )}
            </select>
          </div>

          <div className="form-group mt-2">
            <label>Reason</label>
            <textarea name="reason" className="form-control" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Book Appointment
          </button>
        </form>
    </div>
  );
};
