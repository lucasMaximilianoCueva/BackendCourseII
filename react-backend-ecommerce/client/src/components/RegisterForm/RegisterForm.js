import React from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {

      const register = () => {
        window.location = "https://es-la.facebook.com/r.php"
      };  

    return (
      <div className="container">
        <div>
          <button className="btn btn-primary" onClick={register} type="submit">
            Register
          </button>
        </div>
        <Link to="/login">
          <p>Access your Account</p>
        </Link>
      </div>
    );
}

export default LoginForm;