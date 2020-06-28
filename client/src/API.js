import Booking from './Booking.js';
import Car from './Car.js'
const baseURL = "/api";

async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getCars(brands, categories) {
    let url = "/cars";
    if (brands.length > 0) {
        url += "/?brand=" + brands;
    }
    if (brands.length > 0 && categories.length > 0) {
        url += "&category=" + categories;
    } else if (categories.length > 0) {
        url += "/?category=" + categories;
    }
    const response = await fetch(baseURL + url)
    const carsJson = await response.json();
    if (response.ok) {
        return carsJson.map((c) => new Car(c.id, c.brand, c.category, c.fuel, c.year, c.model));
    } else {
        let err = { status: response.status, errObj: carsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getCategories() {
    let url = "/allcategories";
    const response = await fetch(baseURL + url);
    const categoriesJson = await response.json();
    if (response.ok) {
        return categoriesJson;
    } else {
        let err = { status: response.status, errObj: categoriesJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getBrands() {
    let url = "/allbrands";
    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if (response.ok) {
        return brandsJson;
    } else {
        let err = { status: response.status, errObj: brandsJson };
        throw err;  // An object with the error coming from the server
    }
}



async function getBookings() {
    let url = "/bookings";
    const response = await fetch(baseURL + url);
    const bookingJson = await response.json();
    if (response.ok) {
        return bookingJson.map((b) => new Booking(b.id, b.startDate, b.endDate, b.age, b.category, b.extraDrivers, b.estimation, b.insurance, b.price, new Car(b.carId, b.brand, b.category, b.fuel, b.year, b.model), b.userId));
    } else {
        let err = { status: response.status, errObj: bookingJson };
        throw err;  // An object with the error coming from the server
    }
}

async function addBooking(booking) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/bookings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        }).then((response) => {
            if (response.ok) {
                resolve(true);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function calculatePrice(booking) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/price", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        }).then((response) => {
            if (response.ok) {
                response.json().then((price) => {
                    resolve(price);
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

async function checkCard(cardInfo) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/card", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardInfo),
        }).then((response) => {
            if (response.ok) {
                response.json().then((confirmation) => {
                    resolve(confirmation);
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



async function deleteBooking(bookingId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/bookings/" + bookingId, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(true);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
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

const API = { isAuthenticated, getCars, getCategories, getBrands, calculatePrice, checkCard, getBookings, addBooking, deleteBooking, userLogin, userLogout };
export default API;
