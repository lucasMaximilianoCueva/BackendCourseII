import React, { useState } from 'react';
import Axios from "axios";
import { Link } from 'react-router-dom';
import './LoginLocal.css';

function LoginLocal() {
    const [dataUserName, setDataUserName] = useState([]);
    const [dataUserPass, setDataUserPass] = useState([]);

    const facebook = () => {
      window.location = 'http://localhost:5000/auth/facebook'
    };

    const login = () => {
        Axios({
          method: "POST",
          data: {
            username: dataUserName,
            password: dataUserPass,
          },
          withCredentials: true,
          url: '/api/login',
        }).then((res) => {
            const data = res.data;
            const status = res.status;
            if(data === "No User Exists") {
                window.location = "/faillogin"
            } else if(status === 200 && data !== "No User Exists") {
                window.location = "/"
            }
        });
      };

    return (
      <section className="vh-100">
  <div className="container py-5 h-100">
    <div className="row d-flex align-items-center justify-content-center h-100">
      <div className="col-md-8 col-lg-7 col-xl-6">
        <img src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="login"></img>
      </div>
      <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
        <form>
          {/* <!-- Email input --> */}
          <div className="form-outline mb-4">
            <input
            onChange={(e) => setDataUserName(e.target.value)}
            type="text"
            id="username"
            name="username"
            placeholder="username"
            required
            className="form-control form-control-lg"
          ></input>
          </div>

          {/* <!-- Password input --> */}
          <div className="form-outline mb-4">
            <input
            onChange={(e) => setDataUserPass(e.target.value)}
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required
            className="form-control form-control-lg"
          ></input>
          </div>

          <div className="d-flex justify-content-around align-items-center mb-4">
            {/* <!-- Checkbox --> */}
            
            <Link to="/register">
          <p>Create an Account</p>
        </Link>
          </div>

          {/* <!-- Submit button --> */}
          <span onClick={login} type="submit" className="btn btn-primary btn-lg btn-block">Sign in</span>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
          </div>

          <a className="btn btn-primary btn-lg btn-block" style={{backgroundColor: '#3b5998'}} href="#!" role="button" onClick={facebook} type="submit">
            <i className="fab fa-facebook-f me-2"></i>Continue with Facebook
          </a>

        </form>
      </div>
    </div>
  </div>
</section>
    );
}

export default LoginLocal;