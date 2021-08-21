import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

function RegisterLocal() {
  const [dataUserName, setDataUserName] = useState([]);
  const [dataEmail, setDataEmail] = useState([]);
  const [dataName, setDataName] = useState([]);
  const [dataLastName, setDataLastName] = useState([]);
  const [dataAdress, setDataAdress] = useState([]);
  const [dataAge, setDataAge] = useState([]);
  const [dataPhone, setDataPhone] = useState([]);
  const [dataUserPass, setDataUserPass] = useState([]);
  const [DataUserAvatar, setDataUserAvatar] = useState([]);

  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: dataUserName,
        email: dataEmail,
        name: dataName,
        lastname: dataLastName,
        adress: dataAdress,
        age: dataAge,
        phone: dataPhone,
        password: dataUserPass,
        avatar: DataUserAvatar
      },
      withCredentials: true,
      url: "/api/register",
    }).then((res) => {
      const data = res.data;
      const status = res.status;
      if (data === "User Already Exists") {
        window.location = "/failregister";
      } else if (status === 200 && data !== "User Already Exists") {
        window.location = "/login";
      }
    });
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: 25 }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>

                    <form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataUserName(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            required
                            className="form-control"
                            autoComplete="off"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataName(e.target.value)}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="First Name"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataLastName(e.target.value)}
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="Last Name"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataAdress(e.target.value)}
                            type="text"
                            id="adress"
                            name="adress"
                            placeholder="Adress"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataAge(e.target.value)}
                            type="number"
                            id="age"
                            name="age"
                            placeholder="Age"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataPhone(e.target.value)}
                            type="phone"
                            id="phone"
                            name="phone"
                            placeholder="Phone Number"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataUserPass(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            onChange={(e) => setDataUserAvatar(e.target.value)}
                            type="file"
                            id="avatar"
                            name="avatar"
                            placeholder="Upload Image"
                            className="form-control"
                          ></input>
                        </div>
                      </div>

                      <div className="form-check d-flex justify-content-center mb-5">
                        <label className="form-check-label" htmlFor="form2Example3">
                          Access to your <Link to="/login">account</Link>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <span
                          onClick={register}
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Register
                        </span>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-registration/draw1.png"
                      className="img-fluid"
                      alt="login"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterLocal;