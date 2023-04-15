import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { useSelector } from "react-redux";

const services = [
  "Acme",
  "Poseidon",
  "Betamax",
  "iBuy",
  "Gammamex",
  "OmegaBlue",
];

const Product = ({ product }) => {

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const rand1 = userInfo.rand1
  const rand2 = userInfo.rand2
  const rand3 = userInfo.rand3

  const randArray = [rand1, rand2, rand3]

  const selectedRand = randArray[product.category]



  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          Sold by {services[Math.floor(Math.random() * services.length)]}
        </Card.Text>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">${ product.dripPrice ? (parseFloat(product.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(product.price).toFixed(2)}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
