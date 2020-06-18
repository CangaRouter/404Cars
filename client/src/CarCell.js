import React from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
function CarCell() {
  return <div>
    <Image src="./ferrari.jpg" fluid rounded />
    <Container fluid>
      <Row>
        <Col >
          <p><b>Modello: bella <br />
       Brand: Ferrari <br />
       Year: 2020 <br />
       Fuel: Diesel<br />
       Category: A</b></p>
        </Col>
        <Col >
          <h4 className="green" >From 50€/Day</h4>
          <h4 className="red">Avaiable from 24/12/2020</h4>
        </Col>
      </Row>
    </Container>
  </div>


}

export default CarCell;