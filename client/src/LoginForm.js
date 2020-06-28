import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'



function LoginForm(props) {
    const [validate, setValidate] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidate(false);
            return;
        }
        if (email.length < 5) {
            setValidate(false);
            return;
        }
        if (password.length === 0) {
            setValidate(false);
            return;
        }
        setValidate(true);
        props.login(email,password);
    }
    return <Modal show={props.show} onHide={props.handleClose} >
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validate} onSubmit={(event) => handleSubmit(event)}>
            <Modal.Body>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control value={email} type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control value={password} type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>



}


export default LoginForm;