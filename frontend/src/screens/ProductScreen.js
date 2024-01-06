import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
  OverlayTrigger, 
  Tooltip
} from "react-bootstrap";

import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Header from "../components/Header";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);
  const [products, setProducts] = useState([]);


  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const cartItem = cart.cartItems[0];

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    
  }, [dispatch, match, successProductReview, product._id]);

  useEffect(() => {
    // Fetch your products and set state
    // Replace this with your actual product fetching logic
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const redirectToMatchingProduct = () => {
    // Find the product matching your criteria
    const matchingProduct = products.products.find(nonDripProduct => 
      nonDripProduct.category === product.category && nonDripProduct.dripPrice === false);
    
    if (matchingProduct) {
      // Redirect to the product page
      history.push(`/product/${matchingProduct._id}`);
      toggleModal()
    } else {
      // Handle case where no matching product is found
      console.log('No matching product found');
    }
  };

  const selectedRand = userInfo.rand

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Cart already full
    </Tooltip>
  );

  return (
    <>
      <Header />
      {modal && (
        <div className="overlay">
          <div className="modal-content">
            <img
              style={{
                margin: "1rem",
                height: "30px",
                width: "30px",
              }}
              alt="pic"
              src="/images/price-tag.png"
            ></img>
            <h2>Lower Price Alert</h2>
            <p style={{ marginBottom: "4rem" }}>
              This item has an additional service fee.
              <br></br>
              <br></br>
              A similar gift card is available at a cheaper final price.
            </p>
            <button onClick={toggleModal} class="close"></button>
            <Button onClick={redirectToMatchingProduct}>
              See Product
            </Button>
            <Button
              style={{ marginTop: "1rem", border: "none" }}
              variant="outline-secondary"
              onClick={() => {
                toggleModal();
                history.push(`/cart/${match.params.id}`);
              }}
            >
              Dismiss and Add to Cart
            </Button>
          </div>
        </div>
      )}

      <Container style={{ backdropFilter: "blur(10px)" }}>
        <Link className="btn btn-light my-3" to="/brand">
          Go Back
        </Link>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Meta title={product.name} />
            <Row className="mb-5">
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                    {/* Sold by {services[Math.floor(Math.random() * services.length)]} */}
                    Sold by {userInfo.servicesPermutation[product.cardNumber]}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`Seller rating pending`}
                      hoverText="Hover text here"  // Add your custom hover text here
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: ${product.dripPrice ? (parseFloat(product.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(product.price).toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.dripPrice ? (parseFloat(product.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(product.price).toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                        "In Stock"
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col>
                            <Form.Control
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                              id="1"
                            >
                              <option value="1">1</option>
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                    <Button
                      className="btn-block cart-btn profile"
                      type="button"
                      disabled={product.countInStock === 0 || cartItem}
                      onClick={
                        product.dripPrice ? toggleModal : addToCartHandler
                      }
                    >
                      {product.countInStock === 0 || cartItem ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip}
                        >
                          <span className="d-inline-block" tabIndex="0">
                            <div style={{ pointerEvents: 'none' }}>Add To Cart</div>
                          </span>
                        </OverlayTrigger>
                      ) : (
                        "Add To Cart"
                      )}
                    </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {successProductReview && (
                      <Message variant="success">
                        Review submitted successfully
                      </Message>
                    )}
                    {loadingProductReview && <Loader />}
                    {errorProductReview && (
                      <Message variant="danger">{errorProductReview}</Message>
                    )}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={loadingProductReview}
                          type="submit"
                          variant="primary"
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to="/login">sign in</Link> to write a
                        review{" "}
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default ProductScreen;
