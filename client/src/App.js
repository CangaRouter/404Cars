import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './MyNavbar.js';
import MyBody from './MyBody.js';
import MyFooter from './MyFooter.js';
import LoginForm from './LoginForm.js';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import API from './API.js';


function App() {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(null);
  const [cardConfirmation, setCardConfirmation] = useState(null);
  const [listaFiltriCategoria, setListaFiltriCategoria] = useState([]);
  const [listaFiltriBrand, setListaFiltriBrand] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [bookingResult, setBookingResult] = useState("");
  const [bookingList, setBookingList] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setup = () => {
    API.isAuthenticated().then((user) => {
      setLoggedUser(user);
    }).catch((err) => {
      setLoggedUser(null);
    });
    setListaFiltriBrand([]);
    setListaFiltriCategoria([]);
    API.getCategories().then((categories) => setCategories(categories)).catch((err) => {
      setCategories([]);
    });
    API.getBrands().then((brands) => setBrands(brands)).catch((err) => {
      setBrands([]);
    });
    API.getCars(listaFiltriBrand, listaFiltriCategoria).then(cars => setCars(cars)).catch((err) => {
      setCars([]);
    });
  }

  const serverPrice = (booking) => {
    API.calculatePrice(booking).then((price) => setPrice(price)).catch(() =>
      setPrice(null));
  }

  const checkCard = (cardInfo) => {
    API.checkCard(cardInfo).then((cardConfirmation) => setCardConfirmation(cardConfirmation)).catch(() =>
      setCardConfirmation(false));
  }

  const login = (email, password) => {
    return new Promise((resolve,reject)=>{
      API.userLogin(email, password).then((user) => {
      setLoggedUser(user);
      resolve(true);
      handleClose();
    })
      .catch(
        reject(false)
      )
       
    });
   
    
  }

  const applyFilters = () => {
    API.getCars(listaFiltriBrand, listaFiltriCategoria).then(cars => setCars(cars))
  }

  const requestBooking = (booking) => {
    API.addBooking(booking).then(()=>{
      setBookingResult("Confirmed");
      setPrice(null);
      setCardConfirmation(null);
      getBookings();
    }
    ).catch((err) => {
      setBookingResult(err.msg);
    });
  }

  const cancelBooking=(id)=>{
    API.deleteBooking(id)
    .then(()=>getBookings())
    .catch(()=>getBookings());
  }
  const getBookings = () => {
    API.getBookings().then((bookings) => {
      bookings.sort((b1, b2) =>
        moment(b1.startDate).isBefore(moment(b2.startDate)));
      setBookingList(bookings);
    })
      .catch(setBookingList([]))
  }
  useEffect(setup, []);
  useEffect(getBookings, [loggedUser]);
  useEffect(applyFilters, [listaFiltriBrand, listaFiltriCategoria]);

  return <Route path="/">
    <MyNavbar loggedUser={loggedUser} showLogin={handleShow} listaFiltriCategoria={listaFiltriCategoria} listaFiltriBrand={listaFiltriBrand} setListaFiltriCategoria={setListaFiltriCategoria} setListaFiltriBrand={setListaFiltriBrand} brands={brands} categories={categories} />
    <MyBody cancelBooking={cancelBooking} bookings={bookingList} bookingResult={bookingResult} requestBooking={requestBooking} price={price} setPrice={setPrice} serverPrice={serverPrice} checkCard={checkCard} cardConfirmation={cardConfirmation} cars={cars} />
    <MyFooter />
    <Route path="/*">
      <Redirect exact to="/home" />
    </Route>
    <LoginForm show={show} handleClose={handleClose} handleShow={handleShow} login={login} user={loggedUser} />
  </Route>
}

export default withRouter(App);
