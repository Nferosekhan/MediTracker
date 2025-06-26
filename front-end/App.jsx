import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import {Login} from './components/Login';
import {Admin} from './components/Admin';
import {Doctor} from './components/Doctor';
import {Newdoctor} from './components/Newdoctor';
import {Editdoctor} from './components/Editdoctor';
import {Patient} from './components/Patient';
import {Newpatient} from './components/Newpatient';
import {Editpatient} from './components/Editpatient';
import { OfflineAppointmentForm } from './components/OfflineAppointmentForm';
import { AdminPrescriptions } from './components/AdminPrescriptions';
import {Logout} from './components/Logout';

function App() {

  return (
    <>
      <Router basename="/meditrack">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
