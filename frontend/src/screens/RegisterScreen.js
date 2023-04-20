import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { Form, Button, Container, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
// import Header from "../components/Header";
import { login } from "../actions/userActions";

const RegisterScreen = ({ match, location, history }) => {

  const alpid = match.params.id

  const [name, setName] = useState(alpid);
  const [email, setEmail] = useState(alpid);
  const [password, setPassword] = useState(alpid);
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push("/brand");
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();       

    const check = document.getElementById('myInput')
    if(check.value !== "6F89PY78G") {
      setMessage("Wrong ALP Number");
    }

    else {
      dispatch(register(name, email, password));
      dispatch(login(email, password));
    }
  };
  window.onload = () => {
    const myInput = document.getElementById("myInput");
    myInput.onpaste = (e) => e.preventDefault();
  };

  return (
    <>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to={`/login/${name}`}>
              <Navbar.Brand>Survey</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Container>
        </Navbar>
      </header>
      <FormContainer>
        <h1 className="mt-5">Gift Card Marketplace</h1>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>ALP Account Number: 6F89PY78G</Form.Label>
            <Form.Control
              placeholder="Enter Account Number"
              // value={email}
              onChange={(e) => {
                setEmail(alpid);
                setName(alpid);
                setPassword(alpid);
              }}
              id="myInput"
              autoComplete="off"
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Log In
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
