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

  const logoutHandler = () => {
    dispatch(logout());
  };

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
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
    // console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
    history.push("/complete");
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  // const [code, setCode] = useState();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (code === user.userInfo.name) {
  //     history.push("/");
  //   }
  // };

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
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            <Navbar.Collapse id="basic-navbar-nav">
              {/* <Route
                render={({ history }) => <SearchBox history={history} />}
              /> */}
              <Nav className="ml-auto">
                {/* <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Cart
                  </Nav.Link>
                </LinkContainer> */}
                {/* {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/">
                    <NavDropdown.Item>Home</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : ( */}
                <LinkContainer to="/">
                  <Nav.Link>
                    <i className="fas fa-user" onClick={logoutHandler}></i> Home
                  </Nav.Link>
                </LinkContainer>
                {/* )} */}
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
        {/* <h1>Order {order._id}</h1> */}
        <Row className="mt-3">
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>User Info</h2>
                <p>
                  <strong>Id: </strong>
                  {user.userInfo.name}
                  {/* {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country} */}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price} = $
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
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
                {/* <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item> */}
                {/* <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item> */}
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
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
