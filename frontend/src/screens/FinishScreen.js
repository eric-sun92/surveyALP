import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function FinishScreen() {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Your order has been confirmed.</h1>
          <p className="text-center lead">
            You will now be redirected to the ALP website for further survey
            questions
          </p>
          {/* <div className="d-flex justify-content-center">
            <Button variant="primary" href="/" className="mt-4">
              Return to Homepage
            </Button>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
}

export default FinishScreen;
