import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const Schedule = ({ setActivePage }) => {
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const [doctorId, setDoctorId] = useState(null);
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(day => ({
      day,
      available: false,
      startTime: "",
      endTime: "",
      maxPatients: ""
    }))
  );

  const fetchSchedule = async (id) => {
    try {
      const res = await axios.get(`http://localhost/meditracksystem/api/getschedule.php?doctor_id=${id}`);
      const serverData = res.data;
      const updatedSchedule = daysOfWeek.map(day => {
        const match = serverData.find(s => s.day === day.toLowerCase());
        return match
          ? {
              day,
              available: true,
              startTime: match.start_time,
              endTime: match.end_time,
              maxPatients: match.max_patients
            }
          : {
              day,
              available: false,
              startTime: "",
              endTime: "",
              maxPatients: ""
            };
      });
      setSchedule(updatedSchedule);
    } catch (err) {
      console.error("Error fetching schedule", err);
    }
  };

  const handleToggle = index => {
    const newSchedule = [...schedule];
    newSchedule[index].available = !newSchedule[index].available;
    setSchedule(newSchedule);
  };

  const handleTimeChange = (index, type, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][type] = value;
    setSchedule(newSchedule);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSchedule();
  };

  const saveSchedule = async () => {
    try {
      const dataToSave = schedule
        .filter(slot => slot.available)
        .map(slot => ({
          doctor_id: doctorId,
          day: slot.day.toLowerCase(),
          start_time: slot.startTime,
          end_time: slot.endTime,
          max_patients: slot.maxPatients || 0
        }));
      await axios.post("http://localhost/meditracksystem/api/updateschedule.php", dataToSave, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Schedule updated successfully");
    } catch (err) {
      alert("Error saving schedule");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id;
        setDoctorId(id);
        fetchSchedule(id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <>
      <div>
        <h2>Weekly Schedule</h2>
        <form onSubmit={handleSubmit}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Day</th>
                <th>Available</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Max Patients</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, index) => (
                <tr key={slot.day}>
                  <td>{slot.day}</td>
                  <td>
                    <input className="form-input" type="checkbox" checked={slot.available} onChange={() => handleToggle(index)}
                    />
                  </td>
                  <td>
                    <input className="form-control" type="time" required={slot.available} value={slot.startTime} disabled={!slot.available} onChange={e => handleTimeChange(index, "startTime", e.target.value)}
                    />
                  </td>
                  <td>
                    <input className="form-control" type="time" required={slot.available} value={slot.endTime} disabled={!slot.available} onChange={e => handleTimeChange(index, "endTime", e.target.value)}
                    />
                  </td>
                  <td>
                    <input className="form-control" type="number" min="1" required={slot.available} value={slot.maxPatients} disabled={!slot.available} onChange={e => handleTimeChange(index, "maxPatients", e.target.value)} placeholder="Max"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-primary">
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </>
  );
};