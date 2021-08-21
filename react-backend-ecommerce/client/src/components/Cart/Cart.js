import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../context/cartContext";
import "./Cart.scss";
import "firebase/firestore";
import Checkout from "./Checkout";
import Footer from "../Footer/Footer";
import moment from "moment";
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

function Cart() {
  const { cart, removeItem, cartTotal, clear } = useCartContext();
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const id = Math.round(Math.random() * 10000);

  async function createOrder({ name, surName, phone, email }) {
    if (cart.length > 0) {
      const newOrder = {
        buyer: { name: name, surName, phone: phone, email: email },
        items: cart.map((item) => ({
          id: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cartTotal,
        date: moment().format("DD/MM/YYYY h:mm:ss a"),
        stateOrder: "orden procesada",
      };

      const orders = [];
      orders.push(newOrder);
      clear();
      setPurchaseComplete(true);

      const updateProd = (e) => {
        fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify(newOrder),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((error) => logger.error("Error:", error))
          .then((response) => logger.info("Success:", response));
      };

      updateProd();

    } else {
      alert("Agrega Items Al Carrito");
    }
  }

  return (
    <>
      {purchaseComplete ? (
        <>
          <div className="no-results">
            <h1>Tu compra ha sido exitosa!</h1>
            <h2>Tu ID de operacion es {id}</h2>
            <h3>
              <Link to="/">Volver Al Inicio</Link>
            </h3>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div className="cart-title">
            <h1>Carrito de Compras</h1>
          </div>

          {cart.length !== 0 ? (
            <div className="cart-detail-bar">
              <p>Detalle de Producto</p>
              <p>Cantidad</p>
              <p>Precio</p>
            </div>
          ) : (
            <div className="empty-cart-message">
              <h1>No Hay Productos Agregados</h1>

              <Link to="/" style={{ textDecoration: "none" }}>
                <button className="learn-more">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Comprar</span>
                </button>
              </Link>
            </div>
          )}
          <div className="display-container">
            <div className="cart-wrap">
              {cart.map((item) => (
                <div key={item._id} className="cart-container">
                  <div className="item-detail">
                    <div className="product-img">
                      <img key={item} src={item.thumbnail} alt="pharmacy" />
                    </div>
                    <div className="product-detail">
                      <h4>{item.title}</h4>
                      <button
                        className="btn btn--skew btn-default"
                        key={item}
                        onClick={() => removeItem(item.id)}
                      >
                        borrar
                      </button>
                    </div>
                  </div>
                  <div className="product-quantity">
                    <p>{item.quantity}</p>
                  </div>
                  <div className="product-price">
                    <p>${item.quantity * item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {cart.length && <Checkout orderCreated={createOrder} />}
          </div>

          {cart.length && (
            <div className="total-price">
              <button className="learn-more" onClick={clear}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Vaciar </span>
              </button>

              <Link to="/">
                <button className="learn-more">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Ver Más</span>
                </button>
              </Link>
              <div>
                <h1>Total: ${cartTotal} </h1>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Cart;
