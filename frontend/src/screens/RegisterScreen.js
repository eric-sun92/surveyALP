import React, { useState } from "react";
import { Form, Button, Container, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register, login } from "../actions/userActions";

const RegisterScreen = ({ match, location, history }) => {
  const alpID = match.params.id;

  const queryParams = new URLSearchParams(location.search);
  const sid = queryParams.get('sid');

  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error } = userLogin;

  const submitHandler = (e) => {
    e.preventDefault();

    const check = document.getElementById('myInput');
    if (check.value !== "6F89PY78G") {
      setMessage("Invalid Account ID. ID's are case sensitive");
    } else {
      dispatch(register(alpID, sid));
      dispatch(login(alpID));
      history.push("/brand");
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
            <LinkContainer to={`/login/${alpID}`}>
              <Navbar.Brand>Gift Card Marketplace</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Container>
        </Navbar>
      </header>
      <FormContainer>
        <h1 className="mt-5">Welcome to the Gift Card Marketplace! </h1>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <h6>Your Marketplace Account ID is below. Please enter it to login and begin shopping.</h6>
            <Form.Label>Marketplace Account ID: 6F89PY78G</Form.Label>
            <Form.Control
              placeholder="Enter Account ID"
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
