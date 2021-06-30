import React from 'react';
import { Link } from 'react-router-dom';

function FailRegister() {
    return (
        <div>
            <h2>Failed to Sign Up</h2>
            <h6>please choose another username</h6>
            <Link to="/login"><h4 className="btn btn-success">Please Login</h4></Link>
            <Link to="/register"><h4 className="btn btn-warning">Go Back</h4></Link>
        </div>
    )
}

export default FailRegister;