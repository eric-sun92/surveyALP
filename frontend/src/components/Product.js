import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { useSelector } from "react-redux";

const Product = ({ product }) => {

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const selectedRand = userInfo.rand

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
          Sold by {userInfo.servicesPermutation[product.cardNumber]}
        </Card.Text>

        <Card.Text as="div">
          <Rating
            value={0}
            text={`Seller rating pending`}
          />
        </Card.Text>

        <Card.Text as="h3">${ product.dripPrice ? (parseFloat(product.price) + (selectedRand * 0.05)).toFixed(2) : parseFloat(product.price).toFixed(2)}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
