import React, { useState, useEffect } from "react";
import ItemList from "../ItemList/ItemList";
import "./ItemListContainer.scss";
import { NavLink } from "react-router-dom";
import axios from "axios";

const staticCategories = [{ id: "oferta", name: "Ofertas" }];

const url = "/api/products"; // SERVER
const urlGql = "/gql/api/products";

const [prodData, setProdData] = useState([]);


  /* ------------------------------- */
  /*       GET noticia (query)       */
  /* ------------------------------- */
const getProd = async () => {
      try {
          let body = {
              query: `
                  query {
                      products {
                          _id
                          title
                          description
                          thumbnail
                          price 
                          stock
                      }
                  }
              `,
              variables: {}
          }
          let options = {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
          let response = await axios.post(urlGql, body, options)
          let { data: { data: { products } } } = response
          setProdData({ prodData: products ? products : [] })
      }
      catch (error) {
          console.error(error)
          setProdData({ products: [] })
      }
  }


function ItemListContainer() {
  const [loading, setLoading] = useState(null);

  // SERVER

  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getWithFetch();
    }, []);

    const getWithFetch = async () => {
      const response = await fetch(url);
      const jsonData = await response.json();
      setItemData(jsonData);
      setLoading(false);
    };  

  return (
    <>
      <div className="item-list-title">
        <NavLink to="/" activeClassName="active" exact>
          <h1>Destacado</h1>
        </NavLink>
        {staticCategories.map((cat) => (
          <NavLink to={`/category/${cat.id}`} key={cat.id}>
            <h1>Ofertas</h1>
          </NavLink>
        ))}
      </div>
      <div className="items-container">
        {loading && <div id="loading"></div>}
        {!loading && <ItemList items={itemData} />}
      </div>
    </>
  );
}

export default ItemListContainer;
