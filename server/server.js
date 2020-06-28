const express = require('express');
const morgan = require("morgan");
const moment = require("moment");
const DBManager = require("./DBmanager.js");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const BASEAPI = "/api";
const PORT = 3001;
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
const bookingErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Invalid parameters' }] };
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Unauthorized' }] };
app = new express();
app.use(morgan("short"));
app.use(express.json());

const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.secret;
const expireTime = 3600 * 24 * 7;
app.use(express.static("client"));



app.post(BASEAPI + "/login", (req, res) => {
    DBManager.checkPassword(req.body.username, req.body.password)
        .then((exist) => {
            if (exist) {
                const token = jsonwebtoken.sign({ userID: exist.id }, jwtSecret, { expiresIn: expireTime });
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: expireTime });
                res.json(exist);
            }
            else {
                () => new Promise((resolve) => {
                    setTimeout(resolve, 1000)
                }).then(
                    () => res.status(401).end()
                )
            }
        })
        .catch((err) => res.status(503).json(dbErrorObj));
})

app.get(BASEAPI + "/cars", (req, res) => {
    if (req.query.category && req.query.brand) {
        DBManager.getByCategoryAndBrand(req.query.category, req.query.brand)
            .then((cars) => res.json(cars))
            .catch((err) => res.status(503).json(dbErrorObj));
    } else if (req.query.category) {
        DBManager.getByCategory(req.query.category)
            .then((cars) => res.json(cars))
            .catch((err) => res.status(503).json(dbErrorObj));
    }
    else if (req.query.brand) {
        DBManager.getByBrand(req.query.brand)
            .then((cars) => res.json(cars))
            .catch((err) => res.status(503).json(dbErrorObj));
    } else {
        DBManager.getAllCars()
            .then((cars) => res.json(cars))
            .catch((err) => res.status(503).json(dbErrorObj));
    }
})

app.get(BASEAPI + "/allcategories", (req, res) => {
    DBManager.getCategories()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(503).json(dbErrorObj));
})
app.get(BASEAPI + "/allbrands", (req, res) => {
    DBManager.getBrands()
        .then((brands) => { res.json(brands) })
        .catch((err) => res.status(503).json(dbErrorObj));
})


app.use(cookieParser());




app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

app.get(BASEAPI + "/bookings", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.getAllBookings(userID)
        .then((bookings) => res.json(bookings))
        .catch((err) => res.status(503).json(dbErrorObj));
})

app.post(BASEAPI + "/bookings", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.createBooking({
        id: req.body.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        age: req.body.age,
        category: req.body.category,
        extraDrivers: req.body.extraDrivers,
        estimation: req.body.estimation,
        insurance: req.body.insurance,
        user_id: userID,
    }).then((result) => res.end())
        .catch((err) => res.status(503).json(dbErrorObj));
});


app.post(BASEAPI + "/price", (req, res) => {
    if(moment(req.body.startDate).isAfter(moment(req.body.endDate))){
        res.status(405).json(bookingErrorObj);
            return;
    }
    let price = 0;
    switch (req.body.category) {
        case 'A': price = 80;
            break;
        case 'B': price = 70;
            break;
        case 'C': price = 60;
            break;
        case 'D': price = 50;
            break;
        case 'E': price = 40;
            break;
        default:
            res.status(405).json(bookingErrorObj);
            return;
    }
    switch (req.body.estimation) {
        case "Less than 50 KM/Day": price = price * 0.95
            break;
        case "Less than 150 KM/Day":
            break;
        case "Unlimited KM/Day": price = price * 1.05
            break;
        default:
            res.status(405).json(bookingErrorObj);
            return;
    }
    if (!req.body.age || (req.body.age < 0 || req.body.age > 200)) {
        res.status(405).json(bookingErrorObj); return;
    }
    if (req.body.age > 65)
        price = price * 1.1;
    if (req.body.age < 25)
        price = price * 1.05;

    if (req.body.extraDrivers < 0 || req.body.extraDrivers > 5) {
        res.status(405).json(bookingErrorObj);
        return;
    }
    if (req.body.extraDrivers > 0)
        price=price*1.15;
    if(req.body.insurance)
        price=price*1.2
   const userID = req.user && req.user.userID;

    DBManager.getUser(userID).then((user) => {
    DBManager.countCars(req.body.category).then((carCount) => {
        DBManager.getConcurrentBookings(req.body.startDate, req.body.endDate, req.body.category)
        .then((bookings) => {
            if (carCount - bookings.length === 0) {
                price = "not avaiable"
                res.json(price);
                return;
            }
            if(bookings.length/carCount>0.89) price=price*1.1;
            if(user.nbookings>=3) price=price*0.9;
            price= Math.round(price);
            let duration=moment(req.body.endDate).diff(moment(req.body.startDate),'days');
            price=price*(duration+1);
            res.json(price);
        })
        .catch((err) => { console.log(err);res.status(503).json(dbErrorObj)});
    })
        .catch((err) => {console.log(err); res.status(503).json(dbErrorObj)});
    })
        .catch((err) => {console.log(err); res.status(503).json(dbErrorObj)});
});

app.post(BASEAPI + "/card", (req, res) => {
    if (req.body.cardNumber.length !== 16) res.json(false);
    if (req.body.cardHolder.length === 0) res.json(false);
    if (req.body.cardCCV.length != 3) res.json(false);
    if (moment(req.body.cardExpiration).isBefore(moment())) res.json(false);
    res.json(true)
});


app.delete(BASEAPI + "/bookings/:bookingid", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.removeBooking(req.params.bookingid, userId)
        .then((message) => res.json(message))
        .catch((err) => res.status(503).json(dbErrorObj));
})


app.get(BASEAPI + "/user", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.getUser(userID)
        .then((user) => res.json(user))
        .catch((err) => res.status(503).json(dbErrorObj));
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));