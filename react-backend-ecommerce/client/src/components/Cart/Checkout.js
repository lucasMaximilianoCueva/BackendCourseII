import React, { useState, useEffect } from "react";
import "./Checkout.scss";
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

function Checkout({ orderCreated }) {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/user")
        .then(res => res.json())
        .then(res => setData(res))
        .catch(err => {
          logger.info(err);
        });
  }, []);

  function isValid() {
    return (
      name !== "" &&
      surName !== "" &&
      phone !== "" &&
      email !== "" &&
      email === emailConfirmation
    );
  }

  function onClickConfirm() {
    orderCreated({
      name: name,
      surName: surName,
      email: email,
      phone: phone,
    });
    logger.info("order created");
  }

  return (
    <div className="container">
      <form id="contact" noValidate>
        <h3>Terminar Compra</h3>
        <input
          name="name"
          id="name"
          value={name}
          placeholder='Nombre'
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="surname"
          id="surname"
          value={surName}
          placeholder="Apellido"
          type="text"
          onChange={(e) => setSurName(e.target.value)}
        />
        <input
          name="phone"
          id="phone"
          value={phone}
          placeholder="Teléfono"
          type="tel"
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          name="email"
          id="email"
          value={email}
          placeholder='Email'
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={emailConfirmation}
          placeholder="Confirme su Email"
          type="email"
          onChange={(e) => setEmailConfirmation(e.target.value)}
        />
      </form>
      <div className="button">
        <button disabled={!isValid()} onClick={onClickConfirm}>
          Check Out
        </button>
      </div>
    </div>
  );
}

export default Checkout;
