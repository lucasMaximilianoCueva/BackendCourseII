import React, { useState } from 'react';

function LoginForm() {
    const url = '/api/login'
    const [dataUserName, setDataUserName] = useState([]);
    const [dataUserPass, setDataUserPass] = useState([]);

    const data = {
        "username": dataUserName,
        "password": parseInt(dataUserPass, 10)
    }

    const onChangeName = (e) => {
        setDataUserName(e.target.value)
    }
    const onChangePass = (e) => {
        setDataUserPass(e.target.value)
    }

    const login = () => {
        fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(data)
      };

    return (
        <div className="container">
            <div>
                    <input
                    onChange={onChangeName}
                    type="text"
                    id="username"
                    name="username"
                    placeholder="username"
                    required
                    ></input>
                    <input
                    onChange={onChangePass}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required
                    ></input>
                    <button onClick={login} type="submit">Login</button>
            </div>
        </div>
    )
}

export default LoginForm;