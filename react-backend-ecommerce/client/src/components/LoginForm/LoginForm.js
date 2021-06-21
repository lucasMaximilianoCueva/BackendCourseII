import React from 'react';

function LoginForm() {

    let get = `http://localhost:5000/login?username=Lucas`;

    return (
        <div className="container">
            <div>
                <form action={get} autoComplete="off">
                    <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="user name"
                    required
                    ></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;