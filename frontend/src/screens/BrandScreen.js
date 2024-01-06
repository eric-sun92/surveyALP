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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products} = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  // Create newProducts only after products are fetched
  const newProducts = products && userInfo ? userInfo.itemOrder.map(index => products[index]).filter(product => product) : [];

  const brandProducts = newProducts.filter((item, index, self) => 
    index === self.findIndex((t) => t.category === item.category)
  );

  return (
    <>
      <Header />
      <Container>
        <Meta />
        <h1 className="mt-4">Available Brands</h1>
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
