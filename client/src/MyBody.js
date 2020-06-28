import React from 'react';
import CarList from './CarList.js';
import BookingForm from './BookingForm.js';
import ConfirmationPage from './ConfirmationPage.js';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron'


import History from './History.js'

function MyBody(props) {
  return <Switch>
    <Route path="/home">
      <CarList cars={props.cars}/>
    </Route>
    <Route path="/booking">
      <BookingForm requestBooking={props.requestBooking} price={props.price} setPrice={props.setPrice} serverPrice={props.serverPrice} cardConfirmation={props.cardConfirmation} checkCard={props.checkCard}/>
    </Route>
    <Route path="/confirmation">
      <ConfirmationPage bookingResult={props.bookingResult}/>
    </Route>
    <Route path="/history">
      <History cancelBooking={props.cancelBooking} bookings={props.bookings}/>
    </Route>
    <Route path="/about">
    <Jumbotron >
    <h1>Marco Giulio Pappalardo</h1>
    <h1>s277867 <i>at</i> studenti <i>dot</i> polito <i>dot</i> it</h1>
    <p>
      <Link to="/home"><Button variant="dark">Back home</Button></Link>
    </p>
  </Jumbotron>
    </Route>
  </Switch>
}

export default MyBody;