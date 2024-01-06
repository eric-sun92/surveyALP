import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import VerificationScreen from "./screens/VerificationScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import FinishScreen from "./screens/FinishScreen";
import BrandScreen from "./screens/BrandScreen"

const App = () => {
  return (
    <Router>
      <main className="">
        <Route path="/order/:id" component={OrderScreen} />
        <Route path="/verify" component={VerificationScreen} />
        <Route path="/payment" component={PaymentScreen} />
        <Route path="/placeorder" component={PlaceOrderScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/product/:id" component={ProductScreen} />
        <Route path="/cart/:id?" component={CartScreen} />
        {/* <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
        <Route path="/admin/orderlist" component={OrderListScreen} /> */}
        <Route path="/search/:keyword" component={HomeScreen} exact />
        <Route path="/page/:pageNumber" component={HomeScreen} exact />
        <Route path="/brand" component={BrandScreen} exact />
        <Route
          path="/search/:keyword/page/:pageNumber"
          component={HomeScreen}
          exact
        />
        <Route path="/complete" component={FinishScreen} exact />
        <Route path="/home/:brand" component={HomeScreen} exact />
        <Route path="/login/:id" component={RegisterScreen} exact />
      </main>
      <Footer />
    </Router>
  );
};

export default App;
