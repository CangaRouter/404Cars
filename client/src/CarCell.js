import React from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
function CarCell(props) {
  let price=0;
  switch(props.car.category){
    case 'A': price=80;
    break;
    case 'B': price=70;
    break;
    case 'C': price=60;
    break;
    case 'D': price=50;
    break;
    case 'E': price=40;
    break;
    default:
  }
  return <div>
    <Image src={`./${props.car.brand}.jpg`}  fluid rounded />
    <Container fluid>
      <Row className="my-2">
        <Col >
          <p><b>
       Brand: {props.car.brand} <br />
       Year: {props.car.year} <br />
       Fuel: {props.car.fuel}<br />
       Category: {props.car.category}</b></p>
        </Col>
        <Col >
          <h4 className="green" >From {price}€/Day</h4>
          <h4 className="red">Avaiable from 24/12/2020</h4>
        </Col>
      </Row>
    </Container>
  </div>


}

export default CarCell;