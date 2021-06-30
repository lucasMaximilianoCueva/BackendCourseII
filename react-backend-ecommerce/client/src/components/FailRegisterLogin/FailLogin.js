import React from 'react';
import { Link } from 'react-router-dom';

function FailLogin() {
    return (
        <div>
            <h2>Failed to Login</h2>
            <h6>please verify that your username and password are correct</h6>
            <Link to="/login"><h4 className="btn btn-warning">Go Back</h4></Link>
            <Link to="/register"><h4 className="btn btn-success">Or Register</h4></Link>
        </div>
    )
}

export default FailLogin;