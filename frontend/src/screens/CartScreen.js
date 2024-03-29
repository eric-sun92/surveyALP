import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart, addToCartArray } from "../actions/cartActions";
import Header from "../components/Header";

const CartScreen = ({ match, history }) => {
  const productId = match.params.id;

  const qty = 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (cartItems.length === 0) {
      dispatch(addToCart(productId, qty));
    }
  }, []);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/verify");
  };

  const selectedRand = userInfo.rand

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          
          <Col md={8}>
            <Link className="btn btn-light" to="/brand">
              Go Back
            </Link>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty. <Link to="/brand">Go to marketplace home.</Link>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>${item.dripPrice ? (parseFloat(item.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(item.price).toFixed(2)}</Col>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          <option value="1">1</option>
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h2>
                  $
                  {
                    cartItems[0] 
                      ? (cartItems[0].qty * (cartItems[0].dripPrice ? (parseFloat(cartItems[0].price) + (selectedRand * 0.05)) : parseFloat(cartItems[0].price)))
                          .toFixed(2)
                      : '0.00'
                  }
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
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

export default CartScreen;
