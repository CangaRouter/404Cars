const express = require('express');
const morgan = require("morgan");
const moment = require("moment");
const DBManager = require("./DBmanager.js");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const BASEAPI = "/api";
const PORT = 3001;
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
const bookingErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Invalid booking parameters' }] };
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
        .then((user) => {
            if (user) {
                const token = jsonwebtoken.sign({ userID: user.id }, jwtSecret, { expiresIn: expireTime });
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.json(user);
            }
            else {
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid credentials' }]
                })
            }
        })
        .catch((err) => new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj)));
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

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.get(BASEAPI + "/bookings", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.getAllBookings(userID)
        .then((bookings) => res.json(bookings))
        .catch((err) => res.status(503).json(dbErrorObj));
})

app.post(BASEAPI + "/bookings", (req, res) => {
    if (moment.parseZone(req.body.startDate).isSameOrBefore(moment.parseZone(req.body.endDate))) {
        if (req.body.category !== 'A' && req.body.category !== 'B' && req.body.category !== 'C' && req.body.category !== 'D' && req.body.category !== 'E') {
            res.status(403).json(bookingErrorObj);
            return;
        }
        if (req.body.estimation !== "Less than 50 KM/Day" && req.body.estimation !== "Less than 150 KM/Day" && req.body.estimation !== "Unlimited KM/Day") {
            res.status(403).json(bookingErrorObj);
            return;
        }
        if (!req.body.age || (req.body.age < 18 || req.body.age > 200)) {
            res.status(403).json(bookingErrorObj);
            return;
        }
        if (req.body.extraDrivers < 0 || req.body.extraDrivers > 5) {
            res.status(403).json(bookingErrorObj);
            return;
        }
        const userID = req.user && req.user.userID;
        DBManager.bookCar(req.body.startDate, req.body.endDate, req.body.category)
            .then((carId) => {
                if (carId) {
                    DBManager.createBooking({
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        category: req.body.category,
                        extraDrivers: req.body.extraDrivers || 0,
                        estimation: req.body.estimation,
                        insurance: req.body.insurance,
                        age: req.body.age,
                        price: req.body.price,
                        carId: carId,
                        userId: userID,
                    }).then(() => DBManager.updateUserBookings(userID, +1).then(() =>
                        res.end()
                    ).catch((err) => { console.log(err); res.status(503).json(dbErrorObj) }))
                        .catch((err) => { console.log(err); res.status(503).json(dbErrorObj) })
                } else {
                    res.status(503).json({ errors: [{ 'param': 'Server', 'msg': 'Car is no longer avaiable' }] })
                }
            }).catch((err) => { console.log(err); res.status(503).json(dbErrorObj) });
    } else {
        res.status(403).json(bookingErrorObj);
    }
});


app.post(BASEAPI + "/price", (req, res) => {
    if (moment.parseZone(req.body.startDate).isAfter(moment.parseZone(req.body.endDate))) {
        res.status(403).json(bookingErrorObj);
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
            res.status(403).json(bookingErrorObj);
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
            res.status(403).json(bookingErrorObj);
            return;
    }
    if (!req.body.age || (req.body.age < 18 || req.body.age > 200)) {
        res.status(403).json(bookingErrorObj); return;
    }
    if (req.body.age > 65)
        price = price * 1.1;
    if (req.body.age < 25)
        price = price * 1.05;

    if (req.body.extraDrivers < 0 || req.body.extraDrivers > 5) {
        res.status(403).json(bookingErrorObj);
        return;
    }
    if (req.body.extraDrivers > 0)
        price = price * 1.15;
    if (req.body.insurance)
        price = price * 1.2
    const userID = req.user && req.user.userID;

    DBManager.getUser(userID).then((user) => {
        DBManager.countCars(req.body.category).then((carCount) => {
            DBManager.getConcurrentBookings(req.body.startDate, req.body.endDate, req.body.category)
                .then((bookings) => {
                    if (carCount - bookings.length <= 0) {
                        price = "not avaiable"
                        res.json(price);
                        return;
                    }
                    if (bookings.length / carCount > 0.89) price = price * 1.1;
                    if (user.nbookings >= 3) price = price * 0.9;
                    let duration = moment.parseZone(req.body.endDate).diff(moment.parseZone(req.body.startDate), 'days');
                    price = price * (duration + 1);
                    price = Number.parseFloat(price).toFixed(2);
                    res.json(price);
                })
                .catch((err) => { console.log(err); res.status(503).json(dbErrorObj) });
        })
            .catch((err) => { console.log(err); res.status(503).json(dbErrorObj) });
    })
        .catch((err) => { console.log(err); res.status(503).json(dbErrorObj) });
});

app.post(BASEAPI + "/card", [
    check('cardHolder').isString().isLength({ min: 1 }),
    check('cardNumber').isLength({ min: 16, max: 16 }),
    check('cardCCV').isLength({ min: 3, max: 16 }),
    check('cardExpiration').exists()
], (req, res) => {
    const valids = validationResult(req);
    if (!valids.isEmpty()||moment.parseZone(req.body.cardExpiration).isBefore(moment().local())) {
        return res.status(422).json({ errors: valids.array() });
    }

    res.json(true)
});


app.delete(BASEAPI + "/bookings/:bookingid", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.removeBooking(req.params.bookingid, userID)
        .then((message) => DBManager.updateUserBookings(userID, -1).then(() =>
            res.json(message)
        ).catch((err) => res.status(503).json(dbErrorObj)))
        .catch((err) => res.status(503).json(dbErrorObj));
})


app.get(BASEAPI + "/user", (req, res) => {
    const userID = req.user && req.user.userID;
    DBManager.getUser(userID)
        .then((user) => res.json(user))
        .catch((err) => res.status(503).json(dbErrorObj));
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));