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
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel, model: row.model })
            );
            resolve(cars);
        });
    });
}

exports.getByBrand = function (brand) {
    const brands = brand.split(',');
    let params = "?";
    if (brands.length > 1) {
        for (let i = 1; i < brands.length; i++) {
            params = params.concat(", ?")
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
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel, model: row.model })
            );
            resolve(cars);
        });
    });
}

exports.getByCategoryAndBrand = function (category, brand) {
    const categories = category.split(',');
    let params = "?";
    if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
            params = params.concat(", ?")
        }
    }
    const brands = brand.split(',');
    let params2 = "?";
    if (brands.length > 1) {
        for (let i = 1; i < brands.length; i++) {
            params2 = params2.concat(", ?")
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
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel, model: row.model })
            );
            resolve(cars);
        });
    });
}

exports.getByCategory = function (category) {
    const categories = category.split(',');
    let params = "?";
    if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
            params = params.concat(", ?")
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
                ({ id: row.id, brand: row.brand, category: row.category, year: row.year, fuel: row.fuel, model: row.model })
            );
            resolve(cars);
        });
    });
}

exports.getAllBookings = function (userID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT b.id, startDate, endDate, b.category, extraDrivers, estimation,insurance,age,price,carId, userId,brand, fuel,year,model  FROM bookings b , cars c where userId=? and b.carId=c.id;"
        db.all(sql, [userID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const bookings = rows.map((row) =>
                ({ id: row.id, startDate: row.startDate, endDate: row.endDate, age: row.age, category: row.category, extraDrivers: row.extraDrivers, estimation: row.estimation, insurance: row.insurance, price: row.price, carId: row.carId, userId: row.userId, fuel: row.fuel, brand: row.brand, year: row.year, model: row.model })
            );
            resolve(bookings);
        });
    });
}

exports.removeBooking = function (id = -1, userID) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE  FROM bookings WHERE id=? and userId=?"
        db.run(sql, [id, userID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(`${id} removed`);
        })
    })
}
//selects right car for booking
exports.bookCar = function (startDate, endDate, category) {
    return new Promise((resolve, reject) => {
        const subSql1 = "SELECT carId FROM bookings WHERE DATE(startDate)<=DATE(?) AND DATE(endDate)<=DATE(?) AND DATE(endDate)>=DATE(?)" // correct order -> start,end,start
        const subSql2 = "SELECT carId FROM bookings WHERE DATE(startDate)>=DATE(?) AND DATE(endDate)<=DATE(?)" // correct order -> start,end
        const subSql3 = "SELECT carId FROM bookings WHERE DATE(startDate)>=DATE(?) AND DATE(startDate)<=DATE(?) and DATE(endDate)>=DATE(?)" // correct order -> start,end,end
        const subSql4 = "SELECT carId FROM bookings WHERE DATE(startDate)<=DATE(?) AND DATE(endDate)>=DATE(?)" // correct order -> start,end
        const sql = `SELECT id FROM cars WHERE id NOT IN (${subSql1}) and id NOT IN(${subSql2}) and id NOT IN (${subSql3}) and id NOT IN (${subSql4}) AND category=?;`;
        db.get(sql, [startDate, endDate, startDate, startDate, endDate, startDate, endDate, endDate,startDate, endDate, category], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row)
                resolve(row.id);
            else resolve(null);
        })
    })
}

exports.createBooking = function (booking) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT  INTO bookings(startDate,endDate,age,category,extraDrivers,estimation, insurance, price, carId, userId) VALUES(datetime(?),datetime(?),?,?,?,?,?,?,?,?)"
        db.run(sql, [booking.startDate.toString(), booking.endDate.toString(), booking.age, booking.category, booking.extraDrivers, booking.estimation, booking.insurance, booking.price, booking.carId, booking.userId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.LastId);
        })
    })
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

exports.updateUserBookings = function (id = -1, sum) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE USERS  SET nbookings=nbookings+? WHERE id=?;"
        db.run(sql, [sum, id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
//counts how many cars are of a given category
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
//retrieves all booking happening in same period of given one and using the same category
exports.getConcurrentBookings = function (startDate, endDate, category) {
    return new Promise((resolve, reject) => {
        const subSql1 = "SELECT id FROM bookings WHERE DATE(startDate)<=DATE(?) AND DATE(endDate)<=DATE(?) AND DATE(endDate)>=DATE(?)" // correct order -> start,end,start
        const subSql2 = "SELECT id FROM bookings WHERE DATE(startDate)>=DATE(?) AND DATE(endDate)<=DATE(?)" // correct order -> start,end
        const subSql3 = "SELECT id FROM bookings WHERE DATE(startDate)>=DATE(?) AND DATE(startDate)<=DATE(?) and DATE(endDate)>=DATE(?)" // correct order -> start,end,end
        const subSql4 = "SELECT id FROM bookings WHERE DATE(startDate)<=DATE(?) AND DATE(endDate)>=DATE(?)" // correct order -> start,end
        const sql = `SELECT * FROM bookings WHERE (id IN(${subSql1}) OR id IN(${subSql2}) OR id IN(${subSql3}) OR id IN (${subSql4})) AND category=? ;`
        db.all(sql, [startDate, endDate, startDate, startDate, endDate, startDate, endDate, endDate, startDate, endDate, category], (err, rows) => {
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
                if (bcrypt.compareSync(password, row.hash)) resolve({id: row.id,name: row.name,email: row.email,nbookings: row.nbookings});
                resolve(false);
            } else {
                resolve(false);
            }
        });
    });
}