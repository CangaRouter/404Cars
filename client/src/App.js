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
  const [loginError, setLoginError] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // during start up reassociate states
  // checking if the user is authenticated (asking server to look for jwt cookie)
  // if the user is authenticated load all bookings (the "effect" of useEffect);
  // then download all categories and brands present in server (actually categories could be fixed)
  // dynamic categories allow easier further expansions 
  // at last download all cars to display (empty filterlists are passed)
  const setup = () => {
    setLoginError(false);

    setListaFiltriBrand([]);

    setListaFiltriCategoria([]);


    API.isAuthenticated().then((user) => {
      setLoggedUser(user);
    }).catch((err) => {
      setLoggedUser(null);
    });
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

  // asking the server to calculate price based on current bookings situation
  const serverPrice = (booking) => {
    API.calculatePrice(booking).then((price) => setPrice(price))
      .catch(() =>
        setPrice(null));
  }
  // asking the server to verify correctness of credit card info (STUB API)
  const checkCard = (cardInfo) => {
    API.checkCard(cardInfo).then((cardConfirmation) => setCardConfirmation(cardConfirmation))
      .catch(() =>
        setCardConfirmation(false));
  }
  // login method providing server with email and password
  // saving user info as an object inside loggedUser
  // loginError needed to display alert in login modal
  const login = (email, password) => {
    API.userLogin(email, password).then((user) => {
      handleClose();
      setLoggedUser(user);
      setLoginError(false);
    }).catch(() =>
      setLoginError(true)
    )
  }
  // ask the server to take its cookie back, we are done with it
  const logout = () => {
    API.userLogout()
      .then(setLoggedUser(null))
  }

  // controlled by useEffect this method queries the DB every time the filters are modified
  const applyFilters = () => {
    API.getCars(listaFiltriBrand, listaFiltriCategoria).then(cars => setCars(cars))
  }

  // this method is called after a price is settled for a reservation, sends all the booking info to server
  const requestBooking = (booking) => {
    API.addBooking(booking).then(() => {
      setBookingResult("Confirmed");
      setPrice(null);
      setCardConfirmation(null);
      getBookings();
    }
    ).catch((err) =>
      setBookingResult(err.msg)
    );
  }

  // send to server an id to be deleted from bookings table
  const cancelBooking = (id) => {
    API.deleteBooking(id)
      .then(() => getBookings())
      .catch(() => getBookings());
  }
  //  retrieves bookings from DB to be displayed
  const getBookings = () => {
    if (loggedUser) {
      API.getBookings().then((bookings) => {
        bookings.sort((b1, b2) =>
          moment.parseZone(b1.startDate).isAfter(moment.parseZone(b2.startDate)));
        setBookingList(bookings);
      })
        .catch(setBookingList([]))
    }
  }

  useEffect(setup, []); // setup to perform once
  useEffect(getBookings, [loggedUser]); //if user change also the bookings change
  useEffect(applyFilters, [listaFiltriBrand, listaFiltriCategoria]); // to dynamically update car list

  //routing is actually managed at lower level, this allows the bigger parts of the page
  // to combine themselves more dinamically
  return <Route path="/">
    <MyNavbar logout={logout} loggedUser={loggedUser} showLogin={handleShow} listaFiltriCategoria={listaFiltriCategoria} listaFiltriBrand={listaFiltriBrand} setListaFiltriCategoria={setListaFiltriCategoria} setListaFiltriBrand={setListaFiltriBrand} brands={brands} categories={categories} />
    <MyBody cancelBooking={cancelBooking} bookings={bookingList} bookingResult={bookingResult} requestBooking={requestBooking} price={price} setPrice={setPrice} serverPrice={serverPrice} checkCard={checkCard} cardConfirmation={cardConfirmation} cars={cars} />
    <MyFooter />
    <Route path="/*">
      <Redirect exact to="/home" />
    </Route>
    <LoginForm error={loginError} show={show} handleClose={handleClose} handleShow={handleShow} login={login} user={loggedUser} />
  </Route>
}

export default withRouter(App);
