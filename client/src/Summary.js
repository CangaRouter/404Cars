import React from 'react';
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'


function PaymentSummary(props){
return <Modal>
 <Modal.Header closeButton>
   <Modal.Title>Modal heading</Modal.Title>
 </Modal.Header>
 <Modal.Body>
<h3>Summary</h3>
<Table responsive="sm">
    <tbody>
        <tr>
            <td> Days: </td>
            <td>{(startDate && endDate && endDate.isAfter(startDate)) && endDate.dayOfYear() - startDate.dayOfYear()}</td>
        </tr>
        <tr>
            <td>  Category: </td>
            <td>{category && category}</td>
        </tr>
        <tr>
            <td>  Divers's age: </td>
            <td>{(age && age > 0 && age < 201) && age - 0}</td>
        </tr>
        <tr>
            <td>   Extra Drivers: </td>
            <td>{extraDrivers && extraDrivers}</td>
        </tr>
        <tr>
            <td>    Estimated Km/Day: </td>
            <td>{estimation && estimation}</td>
        </tr>
        <tr>
            <td>    Extra insurance: </td>
            <td>{insurance ? "Yes" : "No"}</td>
        </tr>
    </tbody>
</Table>

<h4 className="green">Price: </h4></Modal.Body>
 <Modal.Footer>
   <Button variant="secondary" onClick={handleClose}>
     Close
   </Button>
   <Button variant="primary" onClick={handleClose}>
     Save Changes
   </Button>
 </Modal.Footer>
</Modal>
}
export default PaymentSummary;