import React, { useState, useEffect } from "react";
import "./ItemCount.scss";

function ItemCount({ id, stock, initial, onAdd }) {
  const [, setItemId] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setItemId(id);
    setCount(initial);
  }, [id, initial]);

  function increment() {
    if (count < stock) {
      setCount(count + 1);
    } else {
      alert("LIMITE DE STOCK DISPONIBLE");
    }
  }

  function decrement() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  function onConfirmAdd() {
    onAdd(count);
  }

  return (
    <>
      <div className="counter">
        <button className="btn btn--skew btn-default" onClick={decrement}>
          -
        </button>
        <span className="count"> {count} </span>
        <button className="btn btn--skew btn-default" onClick={increment}>
          +
        </button>
      </div>
      <div className="add-button">
        <button
          className="btn btn--skew btn-default"
          onClick={onConfirmAdd}
          disabled={stock <= 0 || count <= 0}
        >
          <span>Agregar</span>
        </button>
      </div>
    </>
  );
}

export default ItemCount;
