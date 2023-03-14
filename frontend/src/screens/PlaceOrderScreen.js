import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
  // Form,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";

import { logout } from "../actions/userActions";
import { withRouter } from "react-router-dom";

const PlaceOrderScreen = ({ history }) => {
  window.history.forward(1);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.userLogin);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * 1, 0)
  );

  // shipping
  // cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);

  // tax
  // cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

  cart.totalPrice = cart.cartItems[0].dripPrice
    ? Number(cart.itemsPrice) - Number(Math.round(cart.itemsPrice / 20))
    : Number(cart.itemsPrice)
        // Number(cart.shippingPrice) +
        // Number(cart.taxPrice)
        .toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  // const [code, setCode] = useState();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (code === user.userInfo.name) {
  //     history.push("/");
  //   }
  // };

  return (
    <>
      {/* <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <div style={{ display: "flex" }}>
                  <Form.Control
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Code"
                    autoComplete="off"
                  />
                  <img
                    className="ml-2"
                    style={{ width: 235, height: 45 }}
                    src="/images/randomNumbers.jpg"
                    alt="custom number"
                  />
                </div>
                <Form.Text className="text-muted">
                  Enter ALP Account Number to Go Back to Home
                </Form.Text>
              </Form.Group>
              <Form />
              <Button type="submit">Survey Home</Button>;
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
            </Form>
          </Container>
        </Navbar>
      </header> */}
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/placeorder">
              <Navbar.Brand>Survey</Navbar.Brand>
            </LinkContainer>
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
      <Container className="mt-5">
        {/* <CheckoutSteps step1 step2 step3 step4 /> */}
        <Row>
          <Col md={8}>
            {/* <ListGroup>
              <ListGroup.Item></ListGroup.Item>
            </ListGroup> */}
            {/* <div stype={{ color: "white", fontSize: "10rem" }}>
              Review and Place Order
            </div> */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>Checkout</h1>
              </ListGroup.Item>
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
                      <Col>${Number(Math.round(cart.itemsPrice / 20))}</Col>
                    ) : (
                      <Col>$0</Col>
                    )}
                    {/* // <Col>${cart.shippingPrice}</Col> */}
                  </Row>
                </ListGroup.Item>
                {/* <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item> */}
                <ListGroup.Item>
                  <Row>
                    <Col>Estimated Total</Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {error && <Message variant="danger">{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Review and Place Order
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
