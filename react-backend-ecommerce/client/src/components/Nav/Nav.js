import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useCartContext } from '../../context/cartContext';
import CartWidget from '../CartWidget/CartWidget';
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

function Nav () {
    const [dataUser, setDataUser] = useState([]);

    useEffect(() => {
        fetch("/user")
            .then(res => res.json())
            .then(res => setDataUser(res))
            .catch(err => {
                logger.info(`error: ${err}`);
            });
      }, []);   

    const { totalItemCount } = useCartContext();
    const styles = {
        display: totalItemCount > 0 ? 'block' : 'none'
    }

      const logOut = () => {
        fetch("/api/logout-facebook", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
            window.location = '/register'
        });
      };  

    return (
        <nav className="navbar navbar-light bg-light">
            <div>
            <Link to='/' className="navbar-brand">
                Home
            </Link>
            {dataUser.name && <Link to='/profile' className="navbar-brand">
                {dataUser.name || 'Username'}
            </Link>}
            </div>
            <div style={styles} className="cart">
                <Link to="/cart"><CartWidget /></Link>
                <span>{totalItemCount}</span>
            </div>
            <div>
            {dataUser.name && <Link to='/add' className="navbar-brand">
                Add
            </Link>}
            { !dataUser.name && <Link to='/login' className="navbar-brand">
                Login
            </Link> }
            { !dataUser.name && <Link to='/register' className="navbar-brand">
                Register
            </Link> }
            { dataUser.name && <span style={{cursor: 'pointer'}} className="navbar-brand" onClick={logOut}>
                Logout
            </span>}
            </div>
            
        </nav>
    )
}

export default Nav;