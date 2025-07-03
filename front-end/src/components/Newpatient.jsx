import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { BASE_URL } from '../config';export const Newpatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', dob: '', age: '', gender: '', phone: '', email: '', password: '', address: '', blood_group: '', emergency_contact: '', blood_presure_systolic: '', blood_presure_diastolic: '', sugar_fasting_level: '', sugar_postprandial_level: '', weight: '', height: '', heart_rate: '', temperature: '', bmi: '', bmi_status: '', bmi_suggestion: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const toggleVisibility = () => setShowPassword(!showPassword);

  const handleChange = e => {
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

  const handleFileChange = e => setProfilePic(e.target.files[0]);

  useEffect(() => {
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
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    if (profilePic) {
      data.append("profile_pic", profilePic);
    }

    data.append('doctor_id', doctorId);

    try {
      const res = await axios.post(`${BASE_URL}/newpatient.php`, data);
      if (res.data.message === "Patient created successfully") {
        alert(res.data.message);
        navigate('/admin', { state: { page: 'patients' } });
      }
      else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Error saving data');
    }
  };

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
      <h2>New Patient</h2>
      <form onSubmit={handleSubmit} style={{ padding: "0px 150px" }}>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'D.O.B', name: 'dob', type: 'date' },
          { label: 'Age', name: 'age', type: 'number', readOnly: true },
          { label: 'Email', name: 'email', type: 'email' },
        ].map(({ label, name, type, readOnly }) => (
          <div className="row m-3" key={name}>
            <div className="col-lg-6"><label htmlFor={name} className="form-label">{label}:</label></div>
            <div className="col-lg-6">
              {type === 'textarea' ? (
                <textarea className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} />
              ) : (
                <input type={type} className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} readOnly={readOnly} value={formData[name]} />
              )}
            </div>
          </div>
        ))}
        
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="password" className="form-label">Password : </label>
          </div>
          <div className="col-lg-6">
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Enter The Password" id="password" name="password" required onChange={handleChange} />
              <button className="btn btn-outline-secondary override-append-style" type="button" onClick={toggleVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>

        <div className="row m-3">
          <div className="col-lg-6"><label className="form-label">Gender:</label></div>
          <div className="col-lg-6 row">
            {['male', 'female', 'others'].map(g => (
              <div className="col-lg-4" key={g}>
                <label><input type="radio" value={g} name="gender" required onChange={handleChange} /> {g[0].toUpperCase() + g.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        {[
          { label: 'Phone', name: 'phone', type: 'text' },
          { label: 'Address', name: 'address', type: 'textarea' },
          { label: 'Blood Group', name: 'blood_group', type: 'text' },
          { label: 'Emergency Contact', name: 'emergency_contact', type: 'text' },
        ].map(({ label, name, type, readOnly }) => (
          <div className="row m-3" key={name}>
            <div className="col-lg-6"><label htmlFor={name} className="form-label">{label}:</label></div>
            <div className="col-lg-6">
              {type === 'textarea' ? (
                <textarea className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} />
              ) : (
                <input type={type} className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} readOnly={readOnly} value={formData[name]} />
              )}
            </div>
          </div>
        ))}

        <div className="row m-3">
          <div className="col-lg-6"><label htmlFor="profile_pic" className="form-label">Profile Pic:</label></div>
          <div className="col-lg-6">
            <input type="file" accept="image/*" className="form-control" id="profile_pic" name="profile_pic" onChange={handleFileChange} />
          </div>
        </div>
        <hr/>
        <h5 className="mt-4 mb-2">Vitals</h5>
        {[
          { label: 'Systolic BP', name: 'blood_presure_systolic' },
          { label: 'Diastolic BP', name: 'blood_presure_diastolic' },
          { label: 'Sugar Fasting Level', name: 'sugar_fasting_level' },
          { label: 'Sugar Postprandial Level', name: 'sugar_postprandial_level' },
          { label: 'Weight', name: 'weight' },
          { label: 'Height', name: 'height' },
          { label: 'Heart Rate', name: 'heart_rate' },
          { label: 'Temperature', name: 'temperature' },
          { label: 'BMI', name: 'bmi', readOnly: true }
        ].map(({ label, name, readOnly }) => (
          <div className="row m-3" key={name}>
            <div className="col-lg-6"><label htmlFor={name} className="form-label">{label}:</label></div>
            <div className="col-lg-6">
              <div className="input-group">
                <input type="number" step="any" placeholder={`Enter ${label}`} required className="form-control" id={name} name={name} onChange={handleChange} readOnly={readOnly} value={formData[name]} />
                <button className="btn btn-outline-secondary override-append-style" type="button">{units[name]}</button>
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
          <button className="btn btn-info" style={{ width: "max-content" }}>Submit</button>
        </div>
      </form>
    </>
  );
};