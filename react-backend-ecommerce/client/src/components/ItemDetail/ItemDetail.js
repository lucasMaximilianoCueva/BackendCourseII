import React, { useState, useEffect } from "react";
import "./ItemDetail.scss";
import ItemCount from "../ItemCount/ItemCount";
import { Link } from "react-router-dom";
import { useCartContext } from "../../context/cartContext";
import "./ItemDetail.scss";
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

function ItemDetail({ item }) {
  const [detailData, setDetailData] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [initialCount, setInitialCount] = useState(1);
  const [stock, setStock] = useState(1);
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
      fetch("/user")
          .then(res => res.json())
          .then(res => setDataUser(res))
          .catch(err => {
            logger.error(`error: ${err}`);
          });
    }, []);   

  const { cart, addItem } = useCartContext();

  useEffect(() => {
    setDetailData(item);
    setStock(item.stock);

    const foundItem = cart.find((el) => el.id === item.id);
    if (foundItem) {
      setInitialCount(foundItem.quantity);
    }
  }, [cart, item]);

  function onAdd(quantity) {
    if (quantity > 0) {
      setAddedToCart(true);
    } else {
      setAddedToCart(false);
    }
    addItem(item, quantity);
  }

  return (
    <div className="item-detail-container">
      <div className="detail-img">
        <div>
          <img src={detailData.thumbnail} alt="pharmacy" />
          <Link to={`/update/${detailData._id}`}>
          {dataUser.name &&<button className="btn btn-warning" style={{color: 'black'}} type="">
            Update
          </button>}
        </Link>
        </div>
      </div>
      <div className="detail">
        <div className="title">
          <h4>{detailData.title}</h4>
          <p>{detailData.description}</p>
        </div>
        <div className="detail-price">
          <p>
            <strike>{detailData.stock}</strike> ${detailData.price}
          </p>
        </div>
        <div className="detail-buttons">
          {addedToCart ? (
            <button className="btn btn--skew btn-default">
              <Link style={{ textDecoration: "none" }} to="/cart">
                Terminar Compra
              </Link>
            </button>
          ) : (
            <ItemCount
              id={item._id}
              stock={stock}
              initial={initialCount}
              onAdd={onAdd}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
