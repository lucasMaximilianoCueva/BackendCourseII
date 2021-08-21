import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import Cart from './components/Cart/Cart';
import Nav from './components/Nav/Nav';
import CartProvider from './context/cartContext';
import BrandInfo from './components/BrandInfo/BrandInfo';
import Add from "./components/Add/Add";
import Update from "./components/Update/Update";
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import FailLogin from "./components/FailRegisterLogin/FailLogin";
import FailRegister from "./components/FailRegisterLogin/FailRegister";
import Info from "./components/Info/Info";
import LoginLocal from "./components/LoginLocal/LoginLocal";
import RegisterLocal from "./components/RegisterLocal/RegisterLocal";
import Profile from './components/Profile/Profile';


function App() {
  return (
    <CartProvider>
    <BrowserRouter>
        <Nav />
        <Switch>
          <Route exact path="/"> 
            <Home />
          </Route>
          <Route exact path="/register-facebook"> 
            <RegisterForm />
          </Route>
          <Route exact path="/register"> 
            <RegisterLocal />
          </Route>
          <Route exact path="/login-facebook"> 
            <LoginForm />
          </Route>
          <Route exact path="/login"> 
            <LoginLocal />
          </Route>
          <Route exact path="/faillogin"> 
            <FailLogin />
          </Route>
          <Route exact path="/failregister"> 
            <FailRegister />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/add">
            <Add />
          </Route>
          <Route exact path="/update/:id">
            <Update />
          </Route>
          <Route exact path="/info">
            <Info />
          </Route>
          <Route exact path="/category/:categoryId"> 
            <Home />
          </Route>
          <Route exact path="/item/:id">
            <ItemDetailContainer />
          </Route>
          <Route exact path="/cart">
            <Cart />
          </Route>
          <Route exact path="/about">
            <BrandInfo />
          </Route>
        </Switch>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
