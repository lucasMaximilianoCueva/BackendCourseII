import React, { useState } from 'react';
import Axios from "axios";
import { Link } from 'react-router-dom';

function LoginForm() {
    const [dataUserName, setDataUserName] = useState([]);
    const [dataUserPass, setDataUserPass] = useState([]);

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
                window.location = "/add"
            }
        });
      };

      const facebook = () => {
        Axios({
          method: "GET",
          withCredentials: true,
          url: '/auth/facebook',
        }).then(() => {
            window.location = "/"
        });
      };

    return (
      <div className="container">
        <h3>Login</h3>
        <div>
          <input
            onChange={(e) => setDataUserName(e.target.value)}
            type="text"
            id="username"
            name="username"
            placeholder="username"
            required
          ></input>
          <input
            onChange={(e) => setDataUserPass(e.target.value)}
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required
          ></input>
          <button onClick={login} type="submit">
            Login
          </button>
          <button onClick={facebook} type="submit">
            Login with Facebok
          </button>
        </div>
        <Link to="/register">
          <p>Create an Account</p>
        </Link>
      </div>
    );
}

export default LoginForm;