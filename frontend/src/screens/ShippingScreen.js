import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import Header from "../components/Header";
import ReCAPTCHA from "react-google-recaptcha";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);

  const captchaRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    await axios
      .post("/api/verify", { token })
      .then((res) => console.log(res))
      .catch((error) => {
        console.log(error);
      });

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    if (address === user.userInfo.name) {
      history.push("/payment");
    }
    console.log("123123123");
    setAddress(123123);
  };

  return (
    <>
      <Header />
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Security Check</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Confirm ALP Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ALP Number"
              required
              onChange={(e) => {
                setAddress(e.target.value);
                setCity(e.target.value);
                setPostalCode(e.target.value);
                setCountry(e.target.value);
              }}
              autoComplete="off"
              autoSave="off"
            ></Form.Control>
          </Form.Group>

          {/* <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group> */}
          <ReCAPTCHA
            sitekey="6LdGRvYkAAAAAHAX3eTSozBL-Hmfc25wLqtL5qQs"
            ref={captchaRef}
          />
          <Button style={{ marginTop: "1rem" }} type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
