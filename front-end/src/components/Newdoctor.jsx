import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
export const Newdoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',email: '',password: '',specialization: '',degree: '',experience_years: '',license_number: '',working_hours: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);
  const handleFileChange = e => setProfilePic(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    if (profilePic) data.append("profile_pic", profilePic);

    try {
      const res = await axios.post('http://localhost/meditracksystem/api/newdoctor.php', data);
      if(res.data.message=="Doctor created successfully"){
        alert(res.data.message);
        navigate('/admin', { state: { page: 'doctors' } });
      }
      else{
        alert(res.data.message);
      }
    }
    catch (err) {
      alert('Error saving data');
    }
  };
  return (
    <>
      <h2>New Doctor</h2>
      <form onSubmit={handleSubmit} style={{padding:"0px 150px"}}>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="name" className="form-label">Name : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Name" id="name" name="name" required onChange={handleChange} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="email" className="form-label">Email : </label>
          </div>
          <div className="col-lg-6">
            <input type="email" className="form-control" placeholder="Enter The Email" id="email" name="email" required onChange={handleChange} />
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
          <div className="col-lg-6">
            <label htmlFor="specialization" className="form-label">Specialization : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Specialization" id="specialization" name="specialization" required onChange={handleChange} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="degree" className="form-label">Degree : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Degree" id="degree" name="degree" required onChange={handleChange} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="experience_years" className="form-label">Experience : </label>
          </div>
          <div className="col-lg-6">
            <div className="input-group">
              <input type="number" className="form-control" placeholder="Enter The Experience" id="experience_years" name="experience_years" required onChange={handleChange} />
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
            <input type="text" className="form-control" placeholder="Enter The License Number" id="license_number" name="license_number" required onChange={handleChange} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="working_hours" className="form-label">Working Hours : </label>
          </div>
          <div className="col-lg-6">
            <input type="text" className="form-control" placeholder="Enter The Working Hours" id="working_hours" name="working_hours" required onChange={handleChange} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-6">
            <label htmlFor="profile_pic" className="form-label">Profile Pic : </label>
          </div>
          <div className="col-lg-6">
            <input type="file" className="form-control" id="profile_pic" name="profile_pic" required onChange={handleFileChange} />
          </div>
        </div>
        <div className="row m-3 justify-content-center">
          <button className="btn btn-info" style={{width:"max-content"}}>Submit</button>
        </div>
      </form>
    </>
  );
};