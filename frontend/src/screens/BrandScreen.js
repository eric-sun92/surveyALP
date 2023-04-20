import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import Header from "../components/Header";
import Brand from "../components/Brand"

const BrandScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products} = productList;

  const brandProducts = products.filter((item, index, self) => 
    index === self.findIndex((t) => t.category === item.category)
  );

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Header />
      <Container>
        <Meta />
        <h1 className="mt-4">Giftcard Market Place</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {brandProducts.map((product) => (
                <Col key={product._id} sm={12} md={8} lg={6} xl={4}>
                  <Brand product={product} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default BrandScreen;
