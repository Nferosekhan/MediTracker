import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
export const Ddashboard = ({ doctorId }) => {
  const UPLOAD_BASE_URL = window.location.hostname === "localhost" ? "http://localhost/meditracksystem/uploads" : "http://dctcontrichy.com/meditrack/uploads";
  const [data, setData] = useState([]);
  const fetData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors.php?id=${doctorId}`);
      setData(res.data);
    }
    catch (err) {
      alert("Error fetching data");
    }
  };
  useEffect(() => {
    fetData();
  }, []);
  return (
    <>
      <h1>Welcome {data.name}</h1>
      <div className="card p-4 text-center" style={{ maxWidth: '400px',alignItems:"center" }}>
        <img src={data.profile_pic ? `${UPLOAD_BASE_URL}/${data.profile_pic?.replace("../uploads/", "")}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIEwBCA8nqoMAC9G3yqn1x5h6qo9puVDqqsbWxhptzoF4AIFJWK5z8ZcI2IlSlv-Pl-tk&usqp=CAU"} alt="Doctor Profile" className="rounded-circle mb-3" style={{ width: "120px", height: "120px", objectFit: "cover", border: "2px solid #007bff" }} />
        <h5 className="mb-1">{data.degree}</h5>
        <p className="text-muted">{data.specialization}</p>
      </div>
    </>
  );
};