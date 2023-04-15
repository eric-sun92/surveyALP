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
import { login, logout } from "../actions/userActions";

const RegisterScreen = ({ location, history }) => {

  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  // const userRegister = useSelector((state) => state.userRegister);
  // const { loading, error, userInfo } = userRegister;

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      // history.push(redirect);
      history.push("/home");
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();       
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
      dispatch(login(email, password));
    

      // if (userInfo != null) {
      //   history.push("/home");
      // }
    }
  };
  window.onload = () => {
    const myInput = document.getElementById("myInput");
    myInput.onpaste = (e) => e.preventDefault();
  };

  return (
    <>
      {/* <Header /> */}
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
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
          {/* <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group> */}

          <Form.Group controlId="email">
            <Form.Label>ALP Account Number</Form.Label>
            <Form.Control
              placeholder="Enter Account Number"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setName(e.target.value);
                setPassword(e.target.value);
                setConfirmPassword(e.target.value);
              }}
              id="myInput"
              autoComplete="off"
            ></Form.Control>
          </Form.Group>

          {/* <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group> */}

          {/* <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group> */}

          <Button type="submit" variant="primary">
            Log In
          </Button>
        </Form>

        {/* <Row className="py-3">
          <Col>
            Have an Account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </Col>
        </Row> */}
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
