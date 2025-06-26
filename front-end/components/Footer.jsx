import reactLogo from '../assets/react.svg'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../config';export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
     <footer>
      <nav className="navbar fixed-bottom p-3">
        <p style={{textAlign:"center",width:"100%",marginBottom:"0px"}}>
          <FontAwesomeIcon icon={faCopyright} /> {year} Meditrack. All rights reserved.
        </p>
      </nav>
     </footer>
    </>
  );
};