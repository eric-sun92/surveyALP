import React, { useState, useEffect } from "react";
import axios from "axios";
// import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  // Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

import { LinkContainer } from "react-router-bootstrap";

import { logout } from "../actions/userActions";

const OrderScreen = ({ match, history }) => {
  window.history.forward(1);

  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;  

  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;

  // const rand1 = userInfo.rand1
  // const rand2 = userInfo.rand2
  // const rand3 = userInfo.rand3

  // const randArray = [rand1, rand2, rand3]

  // const selectedRand = randArray[product.category]
  const selectedRand = userInfo.rand

  const logoutHandler = () => {
    dispatch(logout(userInfo.alpID));
  };

  if (!loading) {
    order.itemsPrice = Number(order.orderItems.price).toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order, userInfo, history]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
    console.log(userInfo.sid)
    const redirectUrl = `https://respond.rand.org/wix/6/p516324781676.aspx?__sid__=${userInfo.sid}&card1=0`;

    // history.push("/complete");
    window.location.href = redirectUrl;

  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <div style={{ color: "white", fontSize: "1.2rem" }}>Survey</div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto"> 
                <div
                  style={{
                    color: "white",
                    cursor: "pointer",
                    marginTop: "0.7rem",
                  }}
                  onClick={logoutHandler}
                >
                  <i className="fas fa-user ml-1"></i> Home
                </div>
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="adminmenu">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Container>
        <Row className="mt-3">
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>User Info</h2>
                <p>
                  <strong>Id: </strong>
                  {user.userInfo.name}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {!order.orderItems ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={order.orderItems.image}
                            alt={order.orderItems.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${order.orderItems.product}`}>
                            {order.orderItems.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {order.orderItems.qty} x ${product.dripPrice ? (parseFloat(order.orderItems.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(order.orderItems.price).toFixed(2)} = $
                          {product.dripPrice ? (parseFloat(order.orderItems.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(order.orderItems.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <Button
                        amount={order.totalPrice}
                        onClick={successPaymentHandler}
                      >
                        Place Order
                      </Button>
                    )}
                  </ListGroup.Item>
                )}
                {loadingDeliver && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={deliverHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderScreen;
