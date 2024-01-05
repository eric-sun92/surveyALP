import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveAccountNumber } from "../actions/cartActions";
import Header from "../components/Header";
import Reaptcha from "reaptcha";

const SecurityScreen = ({ history }) => {
  window.history.forward(1);
  

  const dispatch = useDispatch();

  const [accountNumber, setAccountNumber] = useState('');

  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    const myInput = document.getElementById("myInput");
    myInput.onpaste = (e) => e.preventDefault();
  }, []);

  const verify = () => {
    captchaRef.current.getResponse().then((res) => {
      setCaptchaToken(res);
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Here you can dispatch an action to save alp_id or do other operations
    dispatch(saveAccountNumber({ accountNumber }));

    if (accountNumber === "6F89PY78G" && captchaToken !== null) {
      history.push("/placeorder");
    }
  };

  return (
    <>
      <Header />
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Account Verification</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <h6>Your Marketplace Account ID is below. Please enter it to confirm and continue to checkout.</h6>
            <Form.Label>Marketplace Account ID: 6F89PY78G</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Account ID"
              required
              onChange={(e) => setAccountNumber(e.target.value)}
              autoComplete="off"
              autoSave="off"
              id="myInput"
            ></Form.Control>
          </Form.Group>
          <Reaptcha
            sitekey="6LdGRvYkAAAAAHAX3eTSozBL-Hmfc25wLqtL5qQs"
            ref={captchaRef}
            onVerify={verify}
          />
          <Button style={{ marginTop: "1rem" }} type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default SecurityScreen;
