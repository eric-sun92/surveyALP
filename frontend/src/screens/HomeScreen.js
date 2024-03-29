import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import Header from "../components/Header";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const brand = match.params.brand

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const displayProducts = products.filter(item => item.category === brand);

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Header />
      <Container>
        <Link className="btn btn-light mt-4" to="/brand">
          Go Back
        </Link>
        <Meta />
        <h1 className="">Available Gift Cards</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {displayProducts.map((product) => (
                <Col key={product._id} sm={12} md={8} lg={6} xl={4}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
