import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './MyNavbar.js';
import MyBody from './MyBody.js';
import MyFooter from './MyFooter.js';
import LoginForm from './LoginForm.js';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


function App() {

  const serverPrice=(booking)=>{
    setPrice(5);
  }
  const checkCard=(cardInfo)=>{
      setCardConfirmation(true);
  }
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(null);
  const [cardConfirmation, setCardConfirmation]=useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return <Route path="/">
      <MyNavbar showLogin={handleShow} />
        <MyNavbar showLogin={handleShow} />
        <MyBody price={price} setPrice={setPrice} serverPrice= {serverPrice} checkCard={checkCard} cardConfirmation={cardConfirmation}/>
        <MyFooter />
      <Route path="/*">
        <Redirect exact to="/home" />
      </Route>
    <LoginForm show={show} handleClose={handleClose} handleShow={handleShow} />
  </Route>
}

export default withRouter(App);
