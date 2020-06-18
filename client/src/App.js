import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './MyNavbar.js';
import MyBody from './MyBody.js';
import MyFooter from './MyFooter.js';
import LoginForm from './LoginForm.js';
import BookingForm from './BookingForm.js';
import { Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return <Route path="/">
    <Switch>
      <Route path="/booking">
      <MyNavbar showLogin={handleShow} />
        <BookingForm />
      </Route>
      <Route path="/home" >
        <MyNavbar showLogin={handleShow} />
        <MyBody />
        <MyFooter />
      </Route>
      <Route exact path="/about">
      </Route>
      <Route path="/*">
        <Redirect exact to="/home" />
      </Route>
    </Switch>
    <LoginForm show={show} handleClose={handleClose} handleShow={handleShow} />
  </Route>
}

export default withRouter(App);
