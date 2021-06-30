import React, { useState } from 'react';
import Axios from "axios";
import { Link } from 'react-router-dom';

function LoginForm() {
    const [dataUserName, setDataUserName] = useState([]);
    const [dataUserPass, setDataUserPass] = useState([]);

      const register = () => {
        Axios({
          method: "POST",
          data: {
            username: dataUserName,
            password: dataUserPass,
          },
          withCredentials: true,
          url: '/api/register',
        }).then((res) => {
            const data = res.data;
            const status = res.status;
            if(data === "User Already Exists") {
                window.location = "/failregister"
            } else if(status === 200 && data !== "User Already Exists") {
                window.location = "/login"
            }
        });
      };  

    return (
      <div className="container">
        <h3>Register</h3>
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
          <button onClick={register} type="submit">
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