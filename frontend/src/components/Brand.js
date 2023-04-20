import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const Brand = ({ product }) => {

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/home/${product.category}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
    </Card>
  );
};

export default Brand;
