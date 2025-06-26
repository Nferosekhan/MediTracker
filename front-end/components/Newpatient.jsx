import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { BASE_URL } from '../config';export const Newpatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', dob: '', age: '', gender: '', phone: '', email: '', password: '', address: '', blood_group: '', emergency_contact: '', blood_presure_systolic: '', blood_presure_diastolic: '', sugar_fasting_level: '', sugar_postprandial_level: '', weight: '', height: '', heart_rate: '', temperature: '', bmi: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const toggleVisibility = () => setShowPassword(!showPassword);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      } else {
        console.log(res.data);
      }
    } catch (err) {
      alert('Error saving data');
    }
  };

  return (
    <>
      <h2>New Patient</h2>
      <form onSubmit={handleSubmit} style={{ padding: "0px 150px" }}>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'D.O.B', name: 'dob', type: 'date' },
          { label: 'Age', name: 'age', type: 'number' },
          { label: 'Phone', name: 'phone', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Address', name: 'address', type: 'textarea' },
          { label: 'Blood Group', name: 'blood_group', type: 'text' },
          { label: 'Emergency Contact', name: 'emergency_contact', type: 'text' },
        ].map(({ label, name, type }) => (
          <div className="row m-3" key={name}>
            <div className="col-lg-6"><label htmlFor={name} className="form-label">{label}:</label></div>
            <div className="col-lg-6">
              {type === 'textarea' ? (
                <textarea className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} />
              ) : (
                <input type={type} className="form-control" id={name} name={name} required onChange={handleChange} placeholder={`Enter ${label}`} />
              )}
            </div>
          </div>
        ))}

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
          <div className="col-lg-6"><label htmlFor="profile_pic" className="form-label">Profile Pic:</label></div>
          <div className="col-lg-6">
            <input type="file" className="form-control" id="profile_pic" name="profile_pic" required onChange={handleFileChange} />
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
          { label: 'BMI', name: 'bmi' }
        ].map(({ label, name }) => (
          <div className="row m-3" key={name}>
            <div className="col-lg-6"><label htmlFor={name} className="form-label">{label}:</label></div>
            <div className="col-lg-6">
              <input type="text" placeholder={`Enter ${label}`} required className="form-control" id={name} name={name} onChange={handleChange} />
            </div>
          </div>
        ))}

        <div className="row m-3 justify-content-center">
          <button className="btn btn-info" style={{ width: "max-content" }}>Submit</button>
        </div>
      </form>
    </>
  );
};