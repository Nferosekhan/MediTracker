import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";

import { BASE_URL } from '../config';export const Editpatient = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    name: '', dob: '', age: '', gender: '', phone: '', email: '', password: '',
    address: '', blood_group: '', emergency_contact: '', hid_profile_pic: '',
    blood_presure_systolic: '', blood_presure_diastolic: '', sugar_fasting_level: '',
    sugar_postprandial_level: '', weight: '', height: '', heart_rate: '', temperature: '', bmi: '', bmi_status: '', bmi_suggestion: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const toggleVisibility = () => setShowPassword(!showPassword);
  const id = localStorage.getItem("editPatientId");

  useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}/patients.php?id=${id}`)
        .then(res => {
          let data = res.data;
          if (data && data.id) {
            data.hid_profile_pic = data.profile_pic;
            setFormData(data);
            const token = localStorage.getItem('token');
            if (token) {
              try {
                const decoded = jwtDecode(token);
                const id = decoded.id;
                setDoctorId(id);
              }
              catch (err) {
                console.error("Invalid token", err);
              }
            }
          } else {
            alert("Patient not found");
          }
        })
        .catch(() => alert("Failed to fetch patient data"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (profilePic) data.append("profile_pic", profilePic);
    data.append("id", id);
    data.append('doctor_id', doctorId);

    try {
      const res = await axios.post(`${BASE_URL}/updatepatient.php`, data);
      if (res.data.message) {
        alert(res.data.message);
        setActivePage("patients");
      }
    } catch {
      alert("Failed to update patient");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    if (name === 'dob') {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        updatedData.age = age >= 0 ? age : '';
      }
      if (name === 'weight' || name === 'height') {
        const weight = parseFloat(name === 'weight' ? value : updatedData.weight);
        const heightCm = parseFloat(name === 'height' ? value : updatedData.height);

        if (!isNaN(weight) && !isNaN(heightCm) && heightCm > 0) {
          const heightM = heightCm / 100;
          const bmi = (weight / (heightM * heightM)).toFixed(2);
          updatedData.bmi = bmi;

          let bmiStatus = '';
          let suggestion = '';

          const bmiVal = parseFloat(bmi);
          if (bmiVal < 18.5) {
            bmiStatus = 'Underweight';
            suggestion = 'Eat healthy, build strength 💪';
          }
          else if (bmiVal < 24.9) {
            bmiStatus = 'Normal';
            suggestion = 'Great job! Maintain your fitness ✅';
          }
          else if (bmiVal < 29.9) {
            bmiStatus = 'Overweight';
            suggestion = 'Consider light workouts and healthy eating 🍎';
          }
          else {
            bmiStatus = 'Obese';
            suggestion = 'Focus on fitness and consult a nutritionist 🏥';
          }

          updatedData.bmi_status = bmiStatus;
          updatedData.bmi_suggestion = suggestion;
        }
        else {
          updatedData.bmi = '';
          updatedData.bmi_status = '';
          updatedData.bmi_suggestion = '';
        }
      }
      setFormData(updatedData);
    };

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);

  const fields = [
    { field: 'blood_presure_systolic', label: 'Blood Pressure Systolic' },
    { field: 'blood_presure_diastolic', label: 'Blood Pressure Diastolic' },
    { field: 'sugar_fasting_level', label: 'Sugar Fasting Level' },
    { field: 'sugar_postprandial_level', label: 'Sugar Postprandial Level' },
    { field: 'weight', label: 'Weight' },
    { field: 'height', label: 'Height' },
    { field: 'heart_rate', label: 'Heart Rate' },
    { field: 'temperature', label: 'Temperature' },
    { field: 'bmi', label: 'BMI', readOnly: true }
  ];

  const units = {
    blood_presure_systolic: 'mmHg',
    blood_presure_diastolic: 'mmHg',
    sugar_fasting_level: 'mg/dL',
    sugar_postprandial_level: 'mg/dL',
    weight: 'kg',
    height: 'cm',
    heart_rate: 'bpm',
    temperature: '°F',
    bmi: 'kg/m²'
  };

  return (
    <>
      <h2>Edit Patient</h2>
      <form onSubmit={handleSubmit} style={{ padding: "0px 150px" }}>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="name" className="form-label">Name : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Name" id="name" name="name" required onChange={handleChange} value={formData.name} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="dob" className="form-label">D.O.B : </label>
          </div>
          <div className="col-lg-6">
            <input type="date" className="form-control" placeholder="Enter The D.O.B" id="dob" name="dob" required onChange={handleChange} value={formData.dob} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="age" className="form-label">Age : </label>
          </div>
          <div className="col-lg-6">
            <input type="number" className="form-control" placeholder="Enter The Age" id="age" name="age" required onChange={handleChange} value={formData.age} readOnly={true} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="male" className="form-label">Gender : </label>
          </div>
          <div className="col-lg-6">
            <div className="row m-3">
              <div className="col-lg-4">
                <label htmlFor="male" className="form-label"><input type="radio" className="form-input" id="male" value="male" name="gender" required onChange={handleChange} checked={formData.gender === "male"} /> Male</label>
              </div>
              <div className="col-lg-4">
                <label htmlFor="female" className="form-label"><input type="radio" className="form-input" id="female" value="female" name="gender" required onChange={handleChange} checked={formData.gender === "female"} /> Female</label>
              </div>
              <div className="col-lg-4">
                <label htmlFor="others" className="form-label"><input type="radio" className="form-input" id="others" value="others" name="gender" required onChange={handleChange} checked={formData.gender === "others"} /> Others</label>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="phone" className="form-label">Phone : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Phone" id="phone" name="phone" required onChange={handleChange} value={formData.phone} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="email" className="form-label">Email : </label>
          </div>
          <div className="col-lg-6">
            <input type="email" className="form-control" placeholder="Enter The Email" id="email" name="email" required onChange={handleChange} value={formData.email} />
          </div>
        </div>
        <div className="row m-3" style={{display:"none"}}>
          <div className="col-lg-6">
            <label htmlFor="password" className="form-label">Password : </label>
          </div>
          <div className="col-lg-6">
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Enter The Password" id="password" name="password" required onChange={handleChange} value={formData.password} />
              <button className="btn btn-outline-secondary override-append-style" type="button" onClick={toggleVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="address" className="form-label">Address : </label>
          </div>
          <div className="col-lg-6">
            <textarea className="form-control" placeholder="Enter The Address" id="address" name="address" required onChange={handleChange} value={formData.address}></textarea>
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="blood_group" className="form-label">Blood Group : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Blood Group" id="blood_group" name="blood_group" required onChange={handleChange} value={formData.blood_group} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="emergency_contact" className="form-label">Emergency Contact : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Emergency Contact" id="emergency_contact" name="emergency_contact" required onChange={handleChange} value={formData.emergency_contact} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="profile_pic" className="form-label">Profile Pic : </label>
          </div>
          <div className="col-lg-6">
            <input type="file" accept="image/*" className="form-control" id="profile_pic" name="profile_pic" onChange={handleFileChange} />
            <input type="hidden" name="hid_profile_pic" value={formData.hid_profile_pic || ""} onChange={handleChange} />
          </div>
        </div>
        <hr />
        <h4>Vitals</h4>
        {fields.map(({ field, label, readOnly }) => (
          <div className="row m-3" key={field}>
            <div className="col-lg-6">
              <label htmlFor={field} className="form-label">{label}:</label>
            </div>
            <div className="col-lg-6">
              <div className="input-group">
                <input type="number" step="any" className="form-control" placeholder={`Enter ${label}`} id={field} name={field} value={formData[field]} onChange={handleChange} readOnly={readOnly}/>
                <span className="input-group-text">{units[field]}</span>
              </div>
            </div>
          </div>
        ))}

        {formData.bmi_status && (
          <div className="mt-2" style={{textAlign:"center",color: formData.bmi_status === 'Underweight' ? '#f39c12' : formData.bmi_status === 'Normal' ? '#28a745' : formData.bmi_status === 'Overweight' ? '#ffc107' : '#dc3545'}}>
            <strong>Status:</strong> {formData.bmi_status}<br />
            <small>{formData.bmi_suggestion}</small>
          </div>
        )}

        <div className="row m-3 justify-content-center">
          <button className="btn btn-info" style={{ width: "max-content" }}>Update</button>
        </div>
      </form>
    </>
  );
};