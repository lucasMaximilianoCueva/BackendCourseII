import React, { useState, useEffect } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";
// import { getFirestore } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import "./ItemDetailContainer.scss";
import Footer from "../Footer/Footer";

function ItemDetailContainer() {
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  
  useEffect(() => {
    setLoading(true);
    getWithFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWithFetch = async () => {
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    const jsonData = await response.json();
    // setItemData(jsonData)  //FS - ServerMemory - Firebase
    setItemData(jsonData[0])  //MYSQL - SQLite3 - MongoDB
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div id="loading"></div>
        </div>
      ) : (
        <>
          {itemData._id === id ? (
            <ItemDetail item={itemData} />
          ) : (
            <div className="no-results">
              <h1>
                El Producto No Existe. <Link to="/">Volver Al Inicio</Link>
              </h1>
            </div>
          )}
        </>
      )}
      <Footer />
    </>
  );
}

export default ItemDetailContainer;
