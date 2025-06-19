import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from 'moment';

export const Appointment = ({ setActivePage }) => {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [existingAppointment, setExistingAppointment] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
    patient_id: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPatientId(decoded.id);
        setFormData((prev) => ({ ...prev, patient_id: decoded.id }));
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    axios
      .get("http://localhost/meditracksystem/api/getdoctors.php")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost/meditracksystem/api/checkappointment.php?patient_id=${patientId}`)
        .then((res) => {
          console.log("Res", res.data.appointment);
          if (res.data && res.data.appointment) {
            setExistingAppointment(res.data.appointment);
          }
        })
        .catch((err) => console.error("Error checking existing appointment:", err));
    }
  }, [patientId]);

  useEffect(() => {
    if (formData.doctor_id) {
      axios
        .get(`http://localhost/meditracksystem/api/getschedule.php?doctor_id=${formData.doctor_id}`)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("Error fetching schedule:", err));
    }
  }, [formData.doctor_id]);

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

    const appointmentDateTime = `${formData.date} ${formData.time}:00`;
    const dataToSend = {
      ...formData,
      appointment_date: appointmentDateTime,
    };
    delete dataToSend.date;
    delete dataToSend.time;

    try {
      const res = await axios.post(
        "http://localhost/meditracksystem/api/bookappointment.php",
        dataToSend
      );

      if (res.data.success) {
        alert(res.data.message);
        setFormData({
          doctor_id: "",
          date: "",
          time: "",
          reason: "",
          notes: "",
          patient_id: patientId,
        });
        setAvailableTimes([]);
        setBookedSlots([]);
        setExistingAppointment({
          ...dataToSend,
          doctor_name: doctors.find((d) => d.id === formData.doctor_id)?.name,
          specialization: doctors.find((d) => d.id === formData.doctor_id)?.specialization,
          date: formData.date,
          time: formData.time,
        });
      } else if (res.data.suggested_time) {
        const suggested = new Date(res.data.suggested_time);
        const suggestedTimeOnly = suggested.toTimeString().substring(0, 5);
        const userConfirmed = window.confirm(
          `This slot is full.\n\nNext available: ${suggestedTimeOnly}.\n\nDo you want to book it?`
        );

        if (userConfirmed) {
          setFormData((prev) => ({
            ...prev,
            time: suggestedTimeOnly,
            date: suggested.toISOString().split("T")[0],
          }));
          setTimeout(() => {
            document.getElementById("submitAppointment").click();
          }, 300);
        }
      } else {
        alert(res.data.message || "Booking failed.");
        setActivePage("appoinment");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed due to an error.");
    }
  };

  const downloadAsImage = (appt, index, apptname) => {
    const element = document.getElementById(`appointmentDetails-${index}`);
    const buttons = element.querySelectorAll(".download-btn");
    buttons.forEach(btn => btn.style.display = "none");
    html2canvas(element).then((canvas) => {
      buttons.forEach(btn => btn.style.display = "");
      const link = document.createElement("a");
      link.download = `appointment-${apptname}-${index + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const downloadAsPDF = (appt, index, apptname) => {
    const element = document.getElementById(`appointmentDetails-${index}`);
    const buttons = element.querySelectorAll(".download-btn");
    buttons.forEach(btn => btn.style.display = "none");

    html2canvas(element, { scale: 2 }).then((canvas) => {
      buttons.forEach(btn => btn.style.display = "");
      const imgData = canvas.toDataURL("image/png");
      const pxToMm = (px) => px * 0.264583;
      const pdfWidth = pxToMm(canvas.width);
      const pdfHeight = pxToMm(canvas.height);

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'l' : 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`appointment-${apptname}-${index + 1}.pdf`);
    });
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="container mt-4">
    {existingAppointment && Array.isArray(existingAppointment) && existingAppointment.length > 0 ? (
      <div id="appointmentDetails">
        <h2>Existing Appointments</h2>
        {existingAppointment.map((appt, index) => (
          <div key={index} className="mb-3 p-3 border rounded" id={`appointmentDetails-${index}`}>
            <p><strong>Doctor:</strong> Dr. {appt.name}</p>
            <p><strong>Specialization:</strong> {appt.specialization}</p>
            <p><strong>Date:</strong> {moment(appt.appointment_date).format('DD-MM-YYYY hh:mm:ss A')}</p>
            <p><strong>Reason:</strong> {appt.reason}</p>
            <p><strong>Notes:</strong> {appt.notes}</p>

            <button className="download-btn btn btn-success me-2" onClick={() => downloadAsPDF(appt, index, appt.name)}>Download PDF</button>
            <button className="download-btn btn btn-info" onClick={() => downloadAsImage(appt, index, appt.name)}>Download Image</button>
          </div>
        ))}
      </div>
    ) : (
        <>
          <h2>Book Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Choose Doctor</label>
              <select name="doctor_id" className="form-control" value={formData.doctor_id} onChange={handleChange} required>
                <option value="">Select</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-2">
              <label>Date</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} min={minDateStr} required />
            </div>

            <div className="form-group mt-2">
              <label>Time</label>
              <select name="time" className="form-control" value={formData.time} onChange={handleChange} required>
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
              <label>Reason for Visit</label>
              <textarea name="reason" className="form-control" value={formData.reason} onChange={handleChange} required />
            </div>

            <div className="form-group mt-2">
              <label>Notes</label>
              <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} required />
            </div>

            <button id="submitAppointment" className="btn btn-primary mt-3" type="submit">
              Book Appointment
            </button>
          </form>
        </>
      )}
    </div>
  );
};