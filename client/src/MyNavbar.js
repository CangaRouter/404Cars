import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';
import {Route} from 'react-router-dom';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'


function MyNavbar(props) {
 let [listaFiltriCategoria,setListaFiltriCategoria]=useState([]); 
 let [listaFiltriBrand,setListaFiltriBrand]=useState([]);  
    return <div>
    <Container fluid className="navbarContainer">
        <Row>
            <Navbar  fixed="top" className="myNavbar">
                <Col  className="brand"  xs={2} >
                    <Navbar.Brand href="/home"><h1 class="white"><b><u>404</u></b>Cars</h1></Navbar.Brand>
                    <Navbar.Toggle />
                </Col>
                <Col className="slope" xs={1}>
                </Col>
                <Route path="/home">
                <Col className="filtri" >
              
                    <DropdownButton  alignRight id="dropdown-basic-button" title="Category">
                        <Dropdown.Item onClick={()=>listaFiltriCategoria.filter(fil=>fil==="Action").length===0 && setListaFiltriCategoria([...listaFiltriCategoria,"Action"])}>Action</Dropdown.Item>
                    </DropdownButton>
                    </Col>
                    <Col>
                    {listaFiltriCategoria.map((filtro,index)=><h6 key={index} className="filtro" onClick={()=>setListaFiltriCategoria(listaFiltriCategoria.filter(fil=>fil!==filtro))}>X {filtro}</h6>)}
                    {listaFiltriBrand.map((filtro,index)=><h6 key={index} className="filtro" onClick={()=>setListaFiltriBrand(listaFiltriBrand.filter(fil=>fil!==filtro))}>X {filtro}</h6>)}
                    </Col>
                    <Col className="filtri">
                    <DropdownButton alignRight id="dropdown-basic-button" title="Brand">
                        <Dropdown.Item onClick={()=>listaFiltriBrand.filter(fil=>fil==="Action").length===0 && setListaFiltriBrand([...listaFiltriBrand,"Action"])}>Action</Dropdown.Item>
                    </DropdownButton>
                </Col>
                </Route>

                <Route path="/booking">
                    <Col md={6}  className="center-block text-center">
                    <h1 ><b >Make a reservation</b></h1>
                    </Col>
                    </Route>
                    
                <Col className="slope2" xs={1}>
                </Col>
                <Col className="user" xs={2}>
                    <Navbar.Collapse className="justify-content-center my-3 ">
                        <text className="mr-1 linkify white" onClick={() => props.showLogin()} >Login</text>
                            <Link className="mr-1 white" to={"/booking"} >booking</Link> 
                        <svg class="bi bi-person-circle ml-4" width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                            <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                        </svg>
                    </Navbar.Collapse>
                </Col>
            </Navbar>
        </Row>
    </Container>
    </div>


}

export default MyNavbar;
