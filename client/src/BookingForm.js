import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment';


function BookingForm() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [age, setAge] = useState(null);
    const [category, setCategory] = useState(null);
    const [extraDrivers, setExtraDrivers] = useState(0);
    const [estimation, setEstimation] = useState(0);
    const [insurance, setInsurance] = useState(null);
    const [validated, setValidated] = useState(false);

    const startDateChange = (event) => {
        event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      if(moment(event.target.value).isBefore(moment())){
          setValidated(false);
      }else{
      setValidated(true);
      }
    };

    return <Container fluid>
        <Row>
            <Col md={{span : "auto", offset: 3}}>
                <Form method="POST"  validated={validated} onSubmit={(event) => this.handleSubmit(event)}>
                    <Form.Row >
                        <Form.Group as={Col} controlId="startingDate" >
                            <Form.Label>Starting Date</Form.Label>
                            <Form.Control  required type="date" min={moment().format("YYYY-MM-DD")} placeholder="Select a date" onChange={(event) => setStartDate(moment(event.target.value))}  />
                        </Form.Group>
                        <Form.Group as={Col} controlId="endingDate">
                            <Form.Label>Ending Date</Form.Label>
                            <Form.Control  required type="date" min={ (startDate && startDate.format("YYYY-MM-DD") )|| moment().format("YYYY-MM-DD")}  placeholder="Select a date" onChange={(event) => setEndDate(moment(event.target.value))} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row >
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label className="mr-2" for="inlineFormCustomSelectPref">
                                Car Category
                                 </Form.Label>
                            <Form.Control required onChange={(event) => setCategory(event.target.value)}
                                as="select"
                                className=" mr-sm-2"
                                id="inlineFormCustomSelectPref"
                                custom>
                                <option value="" selected>Choose...</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} controlId="driverAge">
                            <Form.Label>Driver's Age</Form.Label>
                            <Form.Control required type="number" max="200" onChange={(event) => setAge(event.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label className="mr-2" for="inlineFormCustomSelectPref">
                                Extra Drivers
                                 </Form.Label>
                            <Form.Control onChange={(event) => setExtraDrivers(event.target.value)}
                                as="select"
                                className=" mr-sm-2"
                                id="inlineFormCustomSelectPref"
                                custom >
                                <option selected>0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="3">4</option>
                                <option value="3">5</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="formGridState">
                        <Form.Label for="inlineFormCustomSelectPref">
                            Estimated KM/Day
                                 </Form.Label>
                        <Form.Control required onChange={(event) => setEstimation(event.target.value)}
                            as="select"
                            id="inlineFormCustomSelectPref"
                            custom>
                            <option value="" selected>Choose...</option>
                            <option value="Less than 50 KM/Day">Less than 50 KM/Day</option>
                            <option value="Less than 150 KM/Day">Less than 150 KM/Day</option>
                            <option value="Unlimited KM/Day">Unlimited KM/Day</option>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        <Col>
                    <Form.Check  onChange={(event) => setInsurance(event.target.value)}
                        type="checkbox"
                        className="my-1 mr-sm-2"
                        id="customControlInline"
                        label="Extra Insurance"
                        custom
                    />
                    </Col>
                    <Col>
                    <h4 className="my-1"> <b>TOTAL:</b></h4>
                    </Col>
                    </Row>
                    <h4  className="my-1"> <b>Credit card details</b></h4> 
                    <Form.Group controlId="formGridState">
                        <Form.Label for="inlineFormCustomSelectPref">
                            Card holder full name
                                 </Form.Label>
                        <Form.Control required type="text" placeholder="Type card holder name...">
                        </Form.Control>
                    </Form.Group>
                    <Form.Row>
                    <Form.Group as={Col} controlId="driverAge">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control required type="number" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="driverAge">
                            <Form.Label>Expiration date</Form.Label>
                            <Form.Control required type="date" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                        <Form.Label for="inlineFormCustomSelectPref">
                            CCV
                                 </Form.Label>
                        <Form.Control required type="number" max="999">
                        </Form.Control>
                    </Form.Group>
                        </Form.Row>
                    <Col className="text-right" >
                        <Button variant="primary" id="confirmButton" type="submit" >
                            Confirm Booking
                      </Button>
                    </Col>
                </Form>
            </Col>
        </Row>
    </Container>
}


export default BookingForm;