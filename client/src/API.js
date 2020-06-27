import Booking from './Booking,js';
import Car from './Car.js'
const baseURL = "/api";

async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getCars(filter) {
    let url = "/cars";
    if(filter){
        const queryParams = "?filter=" + filter;
        url += queryParams;
    }
    const response = await fetch(baseURL + url);
    const carsJson = await response.json();
    if(response.ok){
        return carsJson.map((c) => new Car(c.id,c.brand,c.category, c.fuel,c.year));
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getBookings() {
    let url = "/bookings";

    const response = await fetch(baseURL + url);
    const bookingJson = await response.json();
    if(response.ok){
        return bookingJson.map((b) => new Booking(b.id,b.startDate,b.endDate, b.age,b.category,b.extraDrivers, b.estimation, b.insurance));
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function addBooking(booking) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/booking", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function calculatePrice(booking) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/booking", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        }).then( (response) => {
            if(response.ok) {
                response.json().then((price) => {
                    resolve(price);
                });
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}



async function deleteBooking(bookingId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/bookings/" + bookingId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: email, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

const API = { isAuthenticated,getCars, calculatePrice, getBookings,addBooking, deleteBooking, userLogin, userLogout} ;
export default API;
