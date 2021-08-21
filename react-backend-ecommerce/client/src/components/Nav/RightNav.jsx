import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

// const staticCategories = [
//   { id: "cuidado de la salud", name: "Cuidado De La Salud" },
//   { id: "cuidado personal", name: "Cuidado Personal" },
//   { id: "oferta", name: "Ofertas" },
// ];

const Ul = styled.ul`
  @import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap");

  list-style: none;
  display: flex;
  flex-flow: row nowrap;

  li {
    padding: 40px 10px;
  }

  text-align: center;
  flex-flow: column nowrap;
  background-color: #303030;
  position: fixed;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  top: 0;
  right: 0;
  height: 100vh;
  width: 300px;
  padding-top: 3.5rem;
  transition: transform 0.3s ease-in-out;

  li {
    color: #fff;
    list-style: none;
    font-family: "Libre Baskerville", serif;
  }

  .nav-link {
    text-decoration: none;
    font-size: 20px;
    color: #eee;
    font-weight: 300;
    letter-spacing: 1px;
    position: relative;
    padding: 3px 0;
    &::before,
    &::after {
      content: "";
      width: 100%;
      height: 2px;
      background-color: #fff;
      position: absolute;
      left: 0;
      transform: scaleX(0);
      transition: transform 0.5s;
    }
    &::after {
      bottom: 0;
      transform-origin: right;
    }
    &::before {
      top: 0;
      transform-origin: left;
    }
    &:hover::before,
    &:hover::after {
      transform: scaleX(1);
    }
  }
`;

  const logOut = () => {
    fetch("/api/logout-facebook", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };  

const RightNav = ({ open }) => {

  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
      fetch("/user")
          .then(res => res.json())
          .then(res => setDataUser(res))
          .catch(err => {
              console.log(err);
          });
    }, []);

    console.log(dataUser)

  return (
    <Ul open={open}>
      {dataUser.name && <li><NavLink to='/add' className="nav-link">
                Add Product
            </NavLink></li>}
      {!dataUser.name && <li><NavLink to='/login' className="nav-link">
                Login
            </NavLink></li>}
            {!dataUser.name && <li><NavLink to='/register' className="nav-link">
                Register
            </NavLink></li>}
            {dataUser.name && <li><NavLink to='/register' className="nav-link" onClick={logOut}>
                Logout
            </NavLink></li>}
      {/* {staticCategories.map((cat) => (
        <li key={cat.id}>
          <NavLink
            to={`/category/${cat.id}`}
            style={{ textDecoration: "none" }}
            className="nav-link"
          >
            {cat.name}
          </NavLink>
        </li>
      ))} */}
    </Ul>
  );
};

export default RightNav;
