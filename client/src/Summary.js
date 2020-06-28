import React from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';


function Summary(props) {
  return <Modal show={props.open} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Cancel Reservation?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h3>Summary</h3>
      <Table responsive="sm">
        <tbody>
          <tr>
            <td> Dates: </td>
            <td>{props.booking.startDate && moment.parseZone(props.booking.startDate).format('l')} –– {props.booking.endDate && moment.parseZone(props.booking.endDate).format('l')}</td>
          </tr>
          <tr>
            <td>  Category: </td>
            <td>{props.booking.category && props.booking.category}</td>
          </tr>
          <tr>
            <td>  Divers's age: </td>
            <td>{(props.booking.age && props.booking.age)}</td>
          </tr>
          <tr>
            <td>   Extra Drivers: </td>
            <td>{props.booking.extraDrivers && props.booking.extraDrivers}</td>
          </tr>
          <tr>
            <td>    Estimated Km/Day: </td>
            <td>{props.booking.estimation && props.booking.estimation}</td>
          </tr>
          <tr>
            <td>    Extra insurance: </td>
            <td>{props.booking.insurance ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </Table>

      <h5 >Price: {props.booking.price}€ </h5></Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.handleClose}>
        Close
   </Button>
      <Button variant="danger" onClick={() => { props.cancelBooking(props.booking.id); props.handleClose() }}>
        Cancel Booking
   </Button>
    </Modal.Footer>
  </Modal>
}
export default Summary;