import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function SearchInput() {
    const [itemData, setItemData] = useState([]);
    const [spanData, setSpanData] = useState('0 results')

    useEffect(() => {
        getWithFetchTitle();
        getWithFetchCode();
        getWithFetchPrice();
        getWithFetchStock();
      }, []);

      const getWithFetchTitle = async () => { // TITLE
        const response = await fetch(urlTitle);
        const jsonData = await response.json();
        setItemData(jsonData);
      };  

      const getWithFetchCode = async () => { // CODE
        const response = await fetch(urlCode);
        const jsonData = await response.json();
        setItemData(jsonData);
      };  
      const getWithFetchPrice = async () => { // PRICE
        const response = await fetch(urlPrice);
        const jsonData = await response.json();
        setItemData(jsonData);
      };  
      const getWithFetchStock = async () => { // STOCK
        const response = await fetch(urlStock);
        const jsonData = await response.json();
        setItemData(jsonData);
      };  
    const [input, setInput] = useState('');
    const onChange = (evt) => {
        setInput(evt.target.value.toString())
    }
    const urlTitle = `/api/products?title=${input}`
    const urlCode = `/api/products?code=${input}`
    const urlPrice = `/api/products?price=${input}`
    const urlStock = `/api/products?stock=${input}`

    const updateListByTitle = () => {
        getWithFetchTitle()
        if (itemData.length === 0) {
            setSpanData('');
        }
    }
    const updateListByCode = () => {
        getWithFetchCode()
        if (itemData.length === 0) {
            setSpanData('');
        }
    }
    const updateListByPrice = () => {
        getWithFetchPrice()
        if (itemData.length === 0) {
            setSpanData('');
        }
    }
    const updateListByStock = () => {
        getWithFetchStock()
        if (itemData.length === 0) {
            setSpanData('');
        }
    }

    return (
      <div className="container">
        <div>
          <input
            onChange={onChange}
            type="text"
            placeholder="filter by title"
          ></input>
          <button onClick={updateListByTitle}>Search</button>
        </div>

        <div>
          <input
            onChange={onChange}
            type="text"
            placeholder="filter by code"
          ></input>
          <button onClick={updateListByCode}>Search</button>
        </div>

        <div>
          <input
            onChange={onChange}
            type="text"
            placeholder="filter by price"
          ></input>
          <button onClick={updateListByPrice}>Search</button>
        </div>

        <div>
          <input
            onChange={onChange}
            type="text"
            placeholder="filter by stock"
          ></input>
          <button onClick={updateListByStock}>Search</button>
        </div>

        <span>{spanData}</span>

        <div>
          {itemData.error ? (
            <div>
              <h1>No Products</h1>
            </div>
          ) : (
            <div className="container">
              <div className="row">
                {itemData.map((product) => (
                  <div key={product._id} className="col-md-3 col-sm-6">
                    <div className="product-grid2">
                      <div className="product-image2">
                        <Link href="#">
                          <img src={product.thumbnail} alt={product.title} />
                        </Link>
                        <ul className="social">
                          <li>
                            <Link
                              to={`/products/${product._id}`}
                              data-tip="Quick View"
                            >
                              <i className="fa fa-eye"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href="#" data-tip="Add to Cart">
                              <i className="fa fa-shopping-cart"></i>
                            </Link>
                          </li>
                        </ul>
                        <div className="product-content">
                          <h3 className="title">
                            <Link href="#">{product.title}</Link>
                          </h3>{" "}
                          <span className="price">${product.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
export default SearchInput;