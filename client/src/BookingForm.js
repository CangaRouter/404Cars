import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';


function BookingForm(props) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [age, setAge] = useState(null);
    const [category, setCategory] = useState(null);
    const [extraDrivers, setExtraDrivers] = useState(0);
    const [estimation, setEstimation] = useState(0);
    const [insurance, setInsurance] = useState(false);
    const [validated, setValidated] = useState(false);
    const [cardNumber, setCardNumber] = useState(0);
    const [cardHolder, setCardHolder] = useState(null);
    const [cardExpiration, setCardExpiration] = useState(null);
    const [cardCCV, setCardCCV] = useState(0);


    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        if (props.price === null) {
            setValidated(false);
            return;
        }
        if (props.cardConfirmation === false) {
            setValidated(false);
            return;
        }
        setValidated(true);
    }

    const checkCard= ()=>{
        if(cardNumber.length===16){
            if(cardHolder===null || cardHolder==="") return;
            if(cardCCV.length!==3) return;
            if(cardExpiration.isBefore(moment())) return;
            props.checkCard({cardNumber: cardNumber, cardCCV: cardCCV, cardExpiration: cardExpiration, cardHolder: cardHolder});
        }
    }


    const priceCalc = () => {
        if (endDate && startDate && endDate.isAfter(startDate) && startDate.isAfter(moment())) {
            switch (category) {
                case "A":
                    break;
                case "B":
                    break;
                case "C":
                    break;
                case "D":
                    break;
                case "E":
                    break;
                default:
                    props.setPrice(null);
                    return;
            }
            switch (estimation) {
                case "Less than 50 KM/Day":
                    break;
                case "Less than 150 KM/Day":
                    break;
                case "Unlimited KM/Day":
                    break;
                default:
                    props.setPrice(null);
                    return;
            }
            if (!age || (age < 0 || age > 200)) { props.setPrice(null); return; }
            if (extraDrivers < 0 || extraDrivers > 5) { props.setPrice(null); return; }
            console.log({ startDate: startDate, endDate: endDate, age: age, category: category, extraDrivers: extraDrivers, estimation: estimation, insurance: insurance })
            props.serverPrice({ startDate: startDate, endDate: endDate, age: age, category: category, extraDrivers: extraDrivers, estimation: estimation, insurance: insurance })
            return;
        }
        props.setPrice(null);
    };
    useEffect(priceCalc, [startDate, endDate, age, category, extraDrivers, estimation, insurance])
    useEffect(checkCard,[cardCCV, cardExpiration, cardHolder, cardNumber])

    return <Container fluid>
        <Row>
            <Col md={{ span: "auto", offset: 3 }}>
                <Form method="POST" noValidate validated={validated} onSubmit={(event) => handleSubmit(event)}>
                    <Form.Row >
                        <Form.Group as={Col} controlId="startingDate" >
                            <Form.Label>Starting Date</Form.Label>
                            <Form.Control required type="date" min={moment().format("YYYY-MM-DD")} placeholder="Select a date" value={(startDate && startDate.format("YYYY-MM-DD")) || ""} onChange={(event) => setStartDate(moment(event.target.value))} />
                            <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="endingDate">
                            <Form.Label>Ending Date</Form.Label>
                            <Form.Control required type="date" min={(startDate && startDate.format("YYYY-MM-DD")) || moment().format("YYYY-MM-DD")} value={(endDate && endDate.format("YYYY-MM-DD")) || ""} placeholder="Select a date" onChange={(event) => setEndDate(moment(event.target.value))} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row >
                        <Form.Group as={Col} >
                            <Form.Label className="mr-2" htmlFor="category">
                                Car Category
                                 </Form.Label>
                            <Form.Control required onChange={(event) => setCategory(event.target.value)}
                                as="select"
                                className=" mr-sm-2"
                                id="category"
                                custom>
                                <option value="" >Choose...</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="driverAge">Driver's Age</Form.Label>
                            <Form.Control required type="number" max="200" onChange={(event) => setAge(event.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className="mr-2" htmlFor="extraDrivers" >
                                Extra Drivers
                                 </Form.Label>
                            <Form.Control value={extraDrivers} onChange={(event) => setExtraDrivers(event.target.value)}
                                as="select"
                                className=" mr-sm-2"
                                id="extraDrivers"
                                custom >
                                <option >0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group >
                        <Form.Label htmlFor="estimation">
                            Estimated KM/Day
                                 </Form.Label>
                        <Form.Control required onChange={(event) => setEstimation(event.target.value)}
                            as="select"
                            id="estimation"
                            custom>
                            <option value="" >Choose...</option>
                            <option value="Less than 50 KM/Day">Less than 50 KM/Day</option>
                            <option value="Less than 150 KM/Day">Less than 150 KM/Day</option>
                            <option value="Unlimited KM/Day">Unlimited KM/Day</option>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Check value={insurance} onClick={() => setInsurance(!insurance)}
                                type="checkbox"
                                className="my-1 mr-sm-2"
                                id="insurance"
                                label="Extra Insurance"
                                custom
                            />
                        </Col>
                        <Col>
                            <h4 className="my-1"> <b>TOTAL: {props.price}</b></h4>
                        </Col>
                    </Row>
                    <h4 className="my-1"> <b>Credit card details</b></h4>
                    <Form.Group >
                        <Form.Label htmlFor="holderName">
                            Card holder full name
                                 </Form.Label>
                        <Form.Control required value={cardHolder} type="text" placeholder="Type card holder name..." onChange={(event) => setCardHolder(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control value={cardNumber} required type="number"  max="9999999999999999" onChange={(event) => setCardNumber(event.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>Expiration date</Form.Label>
                            <Form.Control value={(cardExpiration && cardExpiration.format("YYYY-MM-DD")) || ""} required type="date" min={moment().format("YYYY-MM-DD")} onChange={(event) => setCardExpiration(moment(event.target.value))} />
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label htmlFor="ccv">
                                CCV
                                 </Form.Label>
                            <Form.Control value={cardCCV} required type="number"  max="999" onChange={(event) => setCardCCV(event.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        {props.cardConfirmation === false && <Alert  variant="danger">
                        Card not valid</Alert>}
                    </Form.Row>
                    <Col className="text-right" >
                        <Button variant="primary" id="confirmButton" type="submit" disabled={props.price == null || props.cardConfirmation!=true ? true : false}>
                            Confirm Booking
                      </Button>
                    </Col>
                   
                </Form>
            </Col>
        </Row>
    </Container>
}

export default BookingForm;