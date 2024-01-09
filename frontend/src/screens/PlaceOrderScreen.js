import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
  Navbar,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";

import { logout } from "../actions/userActions";

const PlaceOrderScreen = ({ history }) => {
  window.history.forward(1);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  console.log(userInfo)

  const logoutHandler = () => {
    dispatch(logout(userInfo.alpID));
  };

  const cart = useSelector((state) => state.cart);
  const product = cart.cartItems[0]

  const selectedRand = userInfo.rand

  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + (product.dripPrice ? (parseFloat(item.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(item.price).toFixed(2)) * 1, 0)
  );

  cart.totalPrice = cart.cartItems[0].dripPrice
    ? Number(cart.itemsPrice) + 1.7
    : Number(parseFloat(cart.itemsPrice).toFixed(2));

  const orderCreate = useSelector((state) => state.orderCreate);
  const { success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      // history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      const redirectUrl = `https://respond.rand.org/wix/6/p516324781676.aspx?__sid__=${userInfo.sid}&card1=0`;

      // history.push("/complete");
      window.location.href = redirectUrl;
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems[0],
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        card: product.card,
        sid: userInfo.sid,
        userID: userInfo.alpID
      })
    );
  };

  return (
    <>
      <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand>Gift Card Marketplace</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Nav className="ml-auto">
              <div
                style={{
                  color: "white",
                  cursor: "pointer",
                  marginTop: "0.7rem",
                  marginLeft: "0.5rem"
                }}
                onClick={logoutHandler}
              >
               Logout <i className="fas fa-user ml-0.5"></i>
              </div>
              
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
              <h1>Checkout</h1>
              <p>
                If you would like to empty your cart and begin again, please click the link below. 
              </p>
              <button style={{
                color: "red",
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '5px',
                fontWeight: 'bold',
              }} onClick={logoutHandler}>
                Empty Cart and Begin Again
              </button>              
              <p>Note you be asked to re-enter your account ID.</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>User Info</h2>
                <p>
                  <strong>Account Id: </strong>
                  6F89PY78G
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
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
                          <Col>{item.name}</Col>
                          <Col md={4}>
                            {item.qty} x ${product.dripPrice ? (parseFloat(item.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(item.price).toFixed(2)} = $
                            {product.dripPrice ? (parseFloat(item.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(item.price).toFixed(2)}
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
                <ListGroup.Item>
                  <Row>
                    <Col>Merchandise Subtotal</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Service Fee</Col>
                    {cart.cartItems[0].dripPrice ? (
                      <Col>${Number(1.7).toFixed(2)}</Col>
                    ) : (
                      <Col>$0.00</Col>
                    )}
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col style={{ fontWeight: '900' }}>Total</Col>
                    <Col style={{ fontWeight: '900' }}>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                  {error && 
                    <ListGroup.Item>
                      <Message variant="danger">{error}</Message>
                    </ListGroup.Item>}
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PlaceOrderScreen;
