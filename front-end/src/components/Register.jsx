import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <div class="card card-body justify-content-center">
      	<h3 className="text-center mb-4">Register</h3>
      	<form>
      		<div className="row m-3">
      			<div className="col-lg-6">
      				<label htmlFor="username" className="form-label">Username : </label>
      			</div>
      			<div className="col-lg-6">
      				<input type="email" className="form-control" placeholder="Enter The Username" id="username" name="username" />
      			</div>
      		</div>
      		<div className="row m-3">
      			<div className="col-lg-6">
      				<label htmlFor="password" className="form-label">Password : </label>
      			</div>
      			<div className="col-lg-6">
      				<div className="input-group">
				        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter The Password" id="password" name="password" />
				        <button className="btn btn-outline-secondary" type="button" onClick={toggleVisibility}>
				          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
				        </button>
				      </div>
      			</div>
      		</div>
      		<div className="row justify-content-center m-3">
      			<button type="submit" className="btn btn-primary" style={{width:"50%"}}>Register</button>
      		</div>
      		<div className="row justify-content-center m-3">
      			<span>Already have an account? </span><Link to={'/'}>Login</Link>
      		</div>	
      	</form>
      </div>
    </>
  );
};