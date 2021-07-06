import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Nav () {
    const [dataUser, setDataUser] = useState([]);

    useEffect(() => {
        fetch("/user")
            .then(res => res.json())
            .then(res => setDataUser(res))
            .catch(err => {
                console.log(err);
            });
      }, []);
    return (
        <nav className="navbar navbar-light bg-light">
            <Link to='/' className="navbar-brand">
                Home
            </Link>
            <div>
            <Link to='/cart' className="navbar-brand">
                Cart
            </Link>
            <Link to='/products' className="navbar-brand">
                Products
            </Link>
            <Link to='/add' className="navbar-brand">
                Add
            </Link>
            { !dataUser.name && <Link to='/login' className="navbar-brand">
                Login
            </Link> }
            { !dataUser.name &&<Link to='/register' className="navbar-brand">
                Register
            </Link> }
            </div>
            
        </nav>
    )
}

export default Nav;