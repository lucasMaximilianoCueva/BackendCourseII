import React from "react";
import "./ItemList.scss";
import Item from "../Item/Item";

function ItemList({ items }) {
  return (
    <>
      <ul className="grid">
        {items.map((item) => (
          <li key={item._id} className="column">
            <Item item={item} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ItemList;
