import React from 'react';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'





function ConfirmationPage(props) {
    return <Jumbotron className={props.bookingResult==="Confirmed"? "green": "red"}>
    <h1>{props.bookingResult==="Confirmed"? "Booking Registered!": `There was an error with this booking ${props.bookingResult&&props.bookingResult}`}</h1>
    <p>
      <Link to="/home"><Button variant="primary">Back home</Button></Link>
    </p>
  </Jumbotron>
      
}

export default ConfirmationPage;