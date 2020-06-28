import React, {useState} from 'react';
import HistoryCell from './HistoryCell.js';
import ListGroup from 'react-bootstrap/ListGroup'
import Summary from './Summary.js';


function History(props) {

    const [modalOpen, setModalOpen]=useState(false);
    const [booking,setBooking]=useState("");
    const openModal=(booking)=>{
        setBooking(booking);
        setModalOpen(true);
    }

    const handleClose=()=>{
        setModalOpen(false);
    }

    return <main className="below-nav">
        <ListGroup variant="flush">
            {props.bookings.map((booking, index) => <ListGroup.Item key={index} className="booking"><HistoryCell openModal={openModal} booking={booking} /></ListGroup.Item>)}
        </ListGroup>
        <Summary cancelBooking={props.cancelBooking} booking={booking} open={modalOpen} handleClose={handleClose}/>
    </main>

}

export default History;