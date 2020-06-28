import React from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import moment from 'moment';


function HistoryCell(props) {
  return <span>
    <Container fluid>
      <Row className="my-2">
      <Col>
      <Image src={`./${props.booking.car.brand}.jpg`}  fluid rounded />
        </Col>
        <Col >
        <h5><b>Car info</b></h5>
          <p><b>
       Brand: {props.booking.car.brand} <br />
       Model: {props.booking.car.model}<br />
       Year: {props.booking.car.year} <br />
       Fuel: {props.booking.car.fuel}<br />
       Category: {props.booking.category}<br />
       </b></p>
        </Col>
        <Col xs={4}>
        <h5><b>Rental info</b></h5>
          <p><b>
       From: {moment.parseZone(props.booking.startDate).format('l')}<br /> 
       To: {moment.parseZone(props.booking.endDate).format('l')}<br />
       Driver's age: {props.booking.age}<br />
       Number of Drivers: {props.booking.extraDrivers+1}<br />
       Estimated KM/day: {props.booking.estimation}<br />
       Extra Insurance:  {props.booking.insurance? "Yes" : "No"}<br />
       Price: {props.booking.price}€
       </b></p>
        </Col>
        <Col className="my-2">
         {moment.parseZone(props.booking.startDate).isAfter(moment().local()) && <Button variant="danger" id="cancelButton" className="my-5" onClick={()=>props.openModal(props.booking)} >Cancel Reservation</Button>}
        </Col>
      </Row>
    </Container>
  </span>


}

export default HistoryCell;