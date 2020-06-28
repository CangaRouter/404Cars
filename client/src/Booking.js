
class Booking{
    constructor(id, startDate, endDate, age, category,  extraDrivers, estimation,  insurance, price, carID, userID ){
        if(id){
            this.id=id;
        }
        this.startDate=startDate;
        this.endDate=endDate;
        this.age=age;
        this.category=category;
        this.extraDrivers=extraDrivers;
        this.estimation=estimation;
        this.insurance=insurance;
        this.price=price;
        this.carID=carID;
        this.userID=userID;
    }

}

export default Booking;