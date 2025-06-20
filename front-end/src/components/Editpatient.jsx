import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export const Editpatient = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    name: '', dob: '', age: '', gender: '', phone: '', email: '', password: '',
    address: '', blood_group: '', emergency_contact: '', hid_profile_pic: '',
    blood_presure_systolic: '', blood_presure_diastolic: '', sugar_fasting_level: '',
    sugar_postprandial_level: '', weight: '', height: '', heart_rate: '', temperature: '', bmi: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => setShowPassword(!showPassword);
  const id = localStorage.getItem("editPatientId");

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost/meditracksystem/api/patients.php?id=${id}`)
        .then(res => {
          let data = res.data;
          if (data && data.id) {
            data.hid_profile_pic = data.profile_pic;
            setFormData(data);
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

    try {
      const res = await axios.post('http://localhost/meditracksystem/api/updatepatient.php', data);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);

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
            <input type="number" className="form-control" placeholder="Enter The Age" id="age" name="age" required onChange={handleChange} value={formData.age} />
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
            <input type="file" className="form-control" id="profile_pic" name="profile_pic" onChange={handleFileChange} />
            <input type="hidden" name="hid_profile_pic" value={formData.hid_profile_pic || ""} onChange={handleChange} />
          </div>
        </div>
        <hr />
        <h4>Vitals</h4>
        {[
          ['blood_presure_systolic', 'Blood Pressure Systolic'],
          ['blood_presure_diastolic', 'Blood Pressure Diastolic'],
          ['sugar_fasting_level', 'Sugar Fasting Level'],
          ['sugar_postprandial_level', 'Sugar Postprandial Level'],
          ['weight', 'Weight'],
          ['height', 'Height'],
          ['heart_rate', 'Heart Rate'],
          ['temperature', 'Temperature'],
          ['bmi', 'BMI'],
        ].map(([field, label]) => (
          <div className="row m-3" key={field}>
            <div className="col-lg-6">
              <label htmlFor={field} className="form-label">{label} :</label>
            </div>
            <div className="col-lg-6">
              <input type="text" className="form-control" placeholder={`Enter ${label}`} id={field} name={field} value={formData[field]} onChange={handleChange} />
            </div>
          </div>
        ))}

        <div className="row m-3 justify-content-center">
          <button className="btn btn-info" style={{ width: "max-content" }}>Update</button>
        </div>
      </form>
    </>
  );
};