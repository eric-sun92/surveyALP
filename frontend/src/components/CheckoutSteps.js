import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center my-4">
      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/brand">
            <Nav.Link>Continue Shopping</Nav.Link>
        </LinkContainer>
        ) : (
          <Nav.Link disabled>Continue Shopping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/verify">
            <Nav.Link>Verification</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Verification</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>

      {/* <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item> */}
    </Nav>
  );
};

export default CheckoutSteps;
