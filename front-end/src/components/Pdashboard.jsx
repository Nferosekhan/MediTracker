import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import { BASE_URL } from '../config';export const Pdashboard = () => {
  const [data, setData] = useState(null);
  const [patientId, setPatientId] = useState(null);

  // Step 1: Get patient ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPatientId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Step 2: Only fetch data once patientId is available
  useEffect(() => {
    if (patientId) {
      axios.get(`${BASE_URL}/get_patient_dashboard.php?id=${patientId}`)
        .then(res => setData(res.data))
        .catch(err => console.error("Failed to fetch dashboard data:", err));
    }
  }, [patientId]);
  if (!data) return <p>Loading dashboard...</p>;

  const { profile, vitals } = data;

  return (
    <div className="container mt-4">
      <h2>Welcome, {profile.name}</h2>
      <div className="row card shadow-sm mt-4 p-3">
        <div className="col-12">
          <div className="p-3">
            <h5>🧍 Profile Info</h5>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Blood Group:</strong> {profile.blood_group}</p>
          </div>
        </div>
        <hr/>
        <div className="col-12">
          <div className="p-3">
            <h5>🩺 Vitals Overview</h5>
            <p><strong>Weight:</strong> {vitals?.weight || 'N/A'}</p>
            <p><strong>Height:</strong> {vitals?.height || 'N/A'}</p>
            <p><strong>BMI:</strong> {vitals?.bmi || 'N/A'}</p>
            <p><strong>Blood Pressure:</strong> {vitals?.blood_presure_systolic}/{vitals?.blood_presure_diastolic}</p>
            <p><strong>Sugar (Fasting):</strong> {vitals?.sugar_fasting_level}</p>
            <p><strong>Sugar (Post):</strong> {vitals?.sugar_postprandial_level}</p>
            <p><strong>Heart Rate:</strong> {vitals?.heart_rate} bpm</p>
            <p><strong>Temperature:</strong> {vitals?.temperature} °F</p>
          </div>
        </div>
      </div>
    </div>
  );
};