import React from 'react';
import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'





function MyFooter() {
    return <footer class="footer mt-auto py-3">
        <Container fluid>
            <Row>
                <Col md={{ offset: 5 }}>
                    <Link to={"/about"} className="ml-5" >About me</Link>
                </Col>
            </Row>
            <Row>
                <Col md={{ offset: 5 }}  >
                    <text className="text-muted "><i>©Web Application I Exam</i></text>
                </Col>
            </Row>
        </Container>
    </footer>
}

export default MyFooter;