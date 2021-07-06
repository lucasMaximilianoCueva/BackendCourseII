import React from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {

      const facebook = () => {
        window.location = 'http://localhost:5000/auth/facebook'
      };

    return (
      <div className="container">
        <div>
          <button className="btn btn-primary" onClick={facebook} type="submit">
          Login with Facebook
          </button>
        </div>
        <Link to="/register">
          <p>Create an Account</p>
        </Link>
      </div>
    );
}

export default LoginForm;