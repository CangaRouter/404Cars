import React from 'react';
import CarList from './CarList.js';
import BookingForm from './BookingForm.js';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

function MyBody(props) {
  return <Switch>
    <Route path="/home">
      <CarList/>
    </Route>
    <Route path="/booking">
      <BookingForm price={props.price} setPrice={props.setPrice} serverPrice={props.serverPrice} cardConfirmation={props.cardConfirmation} checkCard={props.checkCard}/>
    </Route>
  </Switch>
}

export default MyBody;