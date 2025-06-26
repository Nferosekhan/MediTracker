import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';export const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', password: '', usertype: '', rememberme: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === "rememberme") {
      setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    try {
      const res = await axios.post(`${BASE_URL}/login.php`, data);
      if(res.data.message=="Login successful"){
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('rememberme', res.data.rememberme);
        localStorage.setItem('usertype', res.data.usertype);
        localStorage.setItem('name', res.data.name);
        if(res.data.usertype=="admin"){
          navigate('/admin');
        }
        else if(res.data.usertype=="doctors"){
          navigate('/doctor');
        }
        else if(res.data.usertype=="patients"){
          navigate('/patient');
        }
      }
      else{
        console.log("Something Went Wrong",res.data.message);
      }
    }
    catch (err) {
      alert('Error saving data');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);
  useEffect(() => {
    const root = document.getElementById("root");
    root.style.display = "flex";
    root.style.justifyContent = "center";

    const token = localStorage.getItem('token');
    const rememberme = localStorage.getItem('rememberme');
    const usertype = localStorage.getItem('usertype');
    if(usertype=="admin" && token && rememberme=='1'){
      navigate('/admin');
    }
    else if(usertype=="doctors" && token && rememberme=='1'){
      navigate('/doctor');
    }
    else if(usertype=="patients" && token && rememberme=='1'){
      navigate('/patient');
    }

    return () => {
      root.style.display = "";
      root.style.justifyContent = "";
    };
  }, []);
  return (
    <>
      <div className="col-6 justify-content-center">
        <div className="card card-body justify-content-center" style={{textAlign:"center"}}>
        	<h3 className="text-center mb-4">Login</h3>
        	<form onSubmit={handleSubmit}>
        		<div className="row m-3">
        			<div className="col-lg-6">
        				<label htmlFor="username" className="form-label">Username : </label>
        			</div>
        			<div className="col-lg-6">
        				<input type="email" className="form-control" placeholder="Enter The Username" id="username" name="username" required onChange={handleChange} />
        			</div>
        		</div>
        		<div className="row m-3">
        			<div className="col-lg-6">
        				<label htmlFor="password" className="form-label">Password : </label>
        			</div>
        			<div className="col-lg-6">
        				<div className="input-group">
  				        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter The Password" id="password" name="password" required onChange={handleChange} />
  				        <button className="btn btn-outline-secondary override-append-style" type="button" onClick={toggleVisibility}>
  				          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
  				        </button>
  				      </div>
        			</div>
        		</div>
        		<div className="row m-3">
        			<div className="col-lg-6">
        				<label htmlFor="admin" className="form-label">User Type : </label>
        			</div>
        			<div className="col-lg-6">
                <div className="row m-3">
                  <div className="col-lg-4">
            				<label htmlFor="admin" className="form-label"><input type="radio" className="form-input" id="admin" value="admin" name="usertype" required onChange={handleChange} /> Admin</label>
                  </div>
                  <div className="col-lg-4">
            				<label htmlFor="doctors" className="form-label"><input type="radio" className="form-input" id="doctors" value="doctors" name="usertype" required onChange={handleChange} /> Doctor</label>
                  </div>
                  <div className="col-lg-4">
            				<label htmlFor="patients" className="form-label"><input type="radio" className="form-input" id="patients" value="patients" name="usertype" required onChange={handleChange} /> Patient</label>
                  </div>
                </div>
        			</div>
        		</div>
            <div className="row m-3">
              <label htmlFor="rememberme">
                <input type="checkbox" name="rememberme" id="rememberme" onChange={handleChange} required /> Remember Me
              </label><br />
            </div>
        		<div className="row justify-content-center m-3">
        			<button type="submit" className="btn btn-primary" style={{width:"50%"}}>Login</button>
        		</div>
        		{/*<div className="row justify-content-center m-3">
        			<span>New to here? </span><Link to={'/register'}>Register</Link>
        		</div>*/}
        	</form>
        </div>
      </div>
    </>
  );
};