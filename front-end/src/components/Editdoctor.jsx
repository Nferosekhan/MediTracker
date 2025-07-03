import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { BASE_URL } from '../config';export const Editdoctor = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialization: '', degree: '',
    experience_years: '', license_number: '', working_hours: '', hid_profile_pic: ""
  });
  const [profilePic, setProfilePic] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const id = localStorage.getItem("editDoctorId");

  useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}/doctors.php?id=${id}`)
        .then(res => {
          let data = res.data;
          if (data && data.id) {
            data.hid_profile_pic = res.data.profile_pic;
            setFormData(data);
          } else {
            alert("Doctor not found");
          }
        })
        .catch(() => alert("Failed to fetch doctor data"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (profilePic) data.append("profile_pic", profilePic);
    data.append("id", id);

    try {
      const res = await axios.post(`${BASE_URL}/updatedoctor.php`, data);
      if (res.data.message) {
        alert(res.data.message);
        setActivePage("doctors");
      }
    } catch {
      alert("Failed to update doctor");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);

  return (
    <>
      <h2>Edit Doctor</h2>
      <form onSubmit={handleSubmit} style={{padding:"0px 150px"}}>
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
            <label htmlFor="specialization" className="form-label">Specialization : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Specialization" id="specialization" name="specialization" required onChange={handleChange} value={formData.specialization} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="degree" className="form-label">Degree : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Degree" id="degree" name="degree" required onChange={handleChange} value={formData.degree} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="experience_years" className="form-label">Experience : </label>
          </div>
          <div className="col-lg-6">
            <div className="input-group">
              <input type="number" className="form-control" placeholder="Enter The Experience" id="experience_years" name="experience_years" required onChange={handleChange} value={formData.experience_years} />
              <button className="btn btn-outline-secondary override-append-style" type="button">
                Years
              </button>
            </div>
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="license_number" className="form-label">License Number : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The License Number" id="license_number" name="license_number" required onChange={handleChange} value={formData.license_number} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="working_hours" className="form-label">Working Hours : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Working Hours" id="working_hours" name="working_hours" required onChange={handleChange} value={formData.working_hours} />
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
        <div className="row m-3 justify-content-center">
          <button className="btn btn-info" style={{width:"max-content"}}>Update</button>
        </div>
      </form>
    </>
  );
};