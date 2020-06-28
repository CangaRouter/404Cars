import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'


function MyNavbar(props) {

    return <div>
        <Container fluid className="navbarContainer">
            <Row>
                <Navbar fixed="top" className="myNavbar">
                    <Col className="brand" xs={2} >
                        <Navbar.Brand href="/home"><h1 className="white"><b><u>404</u></b>Cars</h1></Navbar.Brand>
                        <Navbar.Toggle />
                    </Col>
                    <Col className="slope" xs={1}>
                    </Col>
                    <Route path="/home">
                        <Col className="filtri" >
                            <DropdownButton alignRight id="dropdown-basic-button" title="Category">
                                {props.categories && props.categories.map((category, index) => <Dropdown.Item key={index} onClick={() => props.listaFiltriCategoria.filter(fil => fil === category).length === 0 && props.setListaFiltriCategoria([...props.listaFiltriCategoria, category])}>{category}</Dropdown.Item>)}
                            </DropdownButton>
                        </Col>
                        <Col>
                            {props.listaFiltriCategoria && props.listaFiltriCategoria.map((filtro, index) => <h6 key={index} className="filtro" onClick={() => props.setListaFiltriCategoria(props.listaFiltriCategoria.filter(fil => fil !== filtro))}>X {filtro}</h6>)}
                            {props.listaFiltriBrand && props.listaFiltriBrand.map((filtro, index) => <h6 key={index} className="filtro" onClick={() => props.setListaFiltriBrand(props.listaFiltriBrand.filter(fil => fil !== filtro))}>X {filtro}</h6>)}
                        </Col>
                        <Col className="filtri">
                            <DropdownButton alignRight id="dropdown-basic-button" title="Brand">
                                {props.brands && props.brands.map((brand, index) => <Dropdown.Item key={index} onClick={() => props.listaFiltriBrand.filter(fil => fil === brand).length === 0 && props.setListaFiltriBrand([...props.listaFiltriBrand, brand])}>{brand}</Dropdown.Item>)}
                            </DropdownButton>
                        </Col>
                    </Route>

                    <Route path="/booking">
                        {!props.loggedUser && <Redirect exact to="/home" />}
                        <Col md={6} className="center-block text-center">
                            <h1 ><b >Make a reservation</b></h1>
                        </Col>
                    </Route>

                    <Route path="/confirmation">
                        <Col md={6} className="center-block text-center">
                            <h1 ><b >Make a reservation</b></h1>
                        </Col>
                    </Route>

                    <Route path="/history">
                        <Col md={6} className="center-block text-center">
                            <h1 ><b >{props.loggedUser && props.loggedUser.name} booking history</b></h1>
                        </Col>
                    </Route>

                    <Route path="/about">
                        <Col md={6} className="center-block text-center">
                            <h1 ><b >About me</b></h1>
                        </Col>
                    </Route>

                    <Col className="slope2" xs={1}>
                    </Col>
                    <Col className="user" xs={2}>
                        <Navbar.Collapse className="my-2 align-center">
                            {!props.loggedUser && <span className="mr-1 linkify white" onClick={() => props.showLogin()} >Login</span>}
                            {props.loggedUser && <div className="text-left"><Link className="mr-1 white" to={"/history"}>My History</Link> <Link className="mr-1 white" to={"/booking"}>Booking</Link>
                            </div>}

                            {!props.loggedUser && <div className="text-center"> <svg onClick={() => props.showLogin()} className="bi bi-person-circle ml-3 linkify" width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                                <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                            </svg> </div>}
                            {props.loggedUser && <div className="text-center">
                                <svg onClick={() => props.logout()} width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-door-open ml-3 linkify" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M1 15.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM11.5 2H11V1h.5A1.5 1.5 0 0 1 13 2.5V15h-1V2.5a.5.5 0 0 0-.5-.5z" />
                                    <path fillRule="evenodd" d="M10.828.122A.5.5 0 0 1 11 .5V15h-1V1.077l-6 .857V15H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117z" />
                                    <path d="M8 9c0 .552.224 1 .5 1s.5-.448.5-1-.224-1-.5-1-.5.448-.5 1z" />
                                </svg>
                                <div className="ml-3 white">{props.loggedUser.name}</div></div>}


                        </Navbar.Collapse>
                    </Col>
                </Navbar>
            </Row>
        </Container>
    </div>


}

export default MyNavbar;
