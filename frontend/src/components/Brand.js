import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

const Brand = ({ product }) => {

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const rand1 = userInfo.rand1
  const rand2 = userInfo.rand2
  const rand3 = userInfo.rand3

  const randArray = [rand1, rand2, rand3]

  const selectedRand = randArray[product.category]

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/home/${product.category}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
    </Card>
  );
};

export default Brand;
