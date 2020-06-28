"use strict";


const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");
const db = new sqlite.Database("./bookingsDB.db");

exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT(category)  FROM cars;"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(row => row.category));
        });
    });
}

exports.getBrands = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT(brand)  FROM cars;"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(row => row.brand));
        });
    });
}

exports.getAllCars = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM cars;"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((row) =>
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel })
            );
            resolve(cars);
        });
    });
}

exports.getByBrand = function (brand) {
    const brands=brand.split(',');
    let params = "?";
    if (brands.length > 1) {
        for(let i = 1; i < brands.length; i++) {
            params=params.concat(", ?")
          }
    }
    return new Promise((resolve, reject) => {
        const sql = `SELECT *  FROM cars where brand IN (${params}) ;`
        db.all(sql, brands, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((row) =>
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel })
            );
            resolve(cars);
        });
    });
}

exports.getByCategoryAndBrand = function (category, brand) {
    const categories=category.split(',');
    let params = "?";
    if (categories.length > 1) {
        for(let i = 1; i < categories.length; i++) {
            params=params.concat(", ?")
          }
    }
    const brands=brand.split(',');
    let params2 = "?";
    if (brands.length > 1) {
        for(let i = 1; i < brands.length; i++) {
            params2=params2.concat(", ?")
          }
    }
    return new Promise((resolve, reject) => {
        const sql = `SELECT *  FROM cars where brand IN (${params2}) AND category IN  (${params});`
        db.all(sql, [...brands, ...categories], (err, rows) => {
            if (err) {

                reject(err);
                return;
            }
            const cars = rows.map((row) =>
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel })
            );
            resolve(cars);
        });
    });
}

exports.getByCategory = function (category) {
    const categories=category.split(',');
    let params = "?";
    if (categories.length > 1) {
        for(let i = 1; i < categories.length; i++) {
            params=params.concat(", ?")
          }
    }
    return new Promise((resolve, reject) => {
        const sql = `SELECT *  FROM cars where category IN (${params});`
        db.all(sql, categories, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((row) =>
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel })
            );
            resolve(cars);
        });
    });
}

exports.getAllBookings = function (userID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM bookings where userId=?;"
        db.all(sql, [userID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const bookings = rows.map((row) =>
                ({ id: row.id, startDate: row.startDate, endDate: row.endDate, age: row.age, category: row.category, extraDrivers: row.extraDrivers, estimation: row.estimation, insurance: row.insurance, price: price, carId: carId, userId: userId })
            );
            resolve(bookings);
        });
    });
}

exports.removeBooking = function (id = -1) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE  FROM bookings WHERE id=?"
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(`${id} removed`);
        })
    })
}

exports.createBooking = function (booking, userID) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT  INTO bookings(startDate,endDate,age,category,extraDrivers,estimation, insurance, price, carId, userId) VALUES(datetime(?),datetime(?),?,?,?,?,?,?,?,?)"
        db.run(sql, [booking.startDate.toString(), booking.endDate.toString(), booking.age, booking.category, booking.extraDrivers, booking.estimation, booking.insurance, booking.price, booking.carId, userID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.LastId);
        })
    })
}

exports.getPrice = function (booking, userID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM bookings where userId=?;"
        db.all(sql, [userID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const bookings = rows.map((row) =>
                ({ id: row.id, startDate: row.startDate, endDate: row.endDate, age: row.age, category: row.category, extraDrivers: row.extraDrivers, estimation: row.estimation, insurance: row.insurance, price: row.price, carId: row.carId, userId: row.userId })
            );
            resolve(bookings);
        });
    });
}

exports.getUser = function (id = -1) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM users WHERE id=?;"
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                const user = { id: row.id, name: row.name, email: row.email, hash: row.hash, bookings: row.nbookings };
                resolve(user);
            } else {
                resolve({});
            }
        });
    });
}

exports.countCars = function (category) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*)  FROM cars where category=?;`
        db.get(sql, [category], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows['COUNT(*)']);
        });
    });
}

exports.getConcurrentBookings =function (startDate, endDate, category){
    return new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM bookings WHERE (DATE(startDate)<DATE(?) AND DATE(endDate)<DATE(?) AND DATE(endDate)>DATE(?) OR DATE(startDate)>DATE(?) AND DATE(endDate)<DATE(?) OR DATE(startDate)>DATE(?) AND DATE(startDate)<DATE(?) and DATE(endDate)>DATE(?)) AND category=? ;"
        db.all(sql, [startDate,endDate,startDate,startDate,endDate,startDate,endDate,endDate,category], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const bookings = rows.map((row) =>
                ({ id: row.id, startDate: row.startDate, endDate: row.endDate, age: row.age, category: row.category, extraDrivers: row.extraDrivers, estimation: row.estimation, insurance: row.insurance, price: row.price, rcarId: row.carId, userId: row.userId })
            );
            resolve(bookings);
        });
    })
}

exports.checkPassword = function (user = null, password = null) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM users WHERE email=? ;"
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                if (bcrypt.compareSync(password, row.hash)) resolve(row);
                resolve(false);
            } else {
                resolve(false);
            }
        });
    });
}