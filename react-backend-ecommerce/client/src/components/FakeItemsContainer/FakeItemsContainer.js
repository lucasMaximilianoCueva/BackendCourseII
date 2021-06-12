import React, { useState, useEffect } from 'react';
import './FakeItemsContainer.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const url = "/api/fakeprods?q=20" //valor pasado por query

function ItemListContainer () {
    const [itemData, setItemData] = useState([]);

    useEffect(() => {
        getWithFetch();
      }, []);

      const getWithFetch = async () => {
        const response = await fetch(url);
        const jsonData = await response.json();
        setItemData(jsonData);
      };  
  
    return (
        <div>
        {itemData.length === 0  ? (
            <div>
                <h1>No Products</h1>
            </div>
            
        ) : (
            <div className="container">
            <div className="row">
            {itemData.map(product => 
                <div key={product._id} className="col-md-3 col-sm-6">
                    <div className="product-grid2">
                        <div className="product-image2">
                            <Link href="#">
                                <img src={product.thumbnail} alt={product.title}/> 
                            </Link>
                            <ul className="social">
                                <li><Link to={`/products-test/${product._id}`} data-tip="Quick View"><i className="fa fa-eye"></i></Link></li>
                                <li><Link href="#" data-tip="Add to Cart"><i className="fa fa-shopping-cart"></i></Link></li>
                            </ul>
                            <div className="product-content">
                                <h3 className="title"><Link href="#">{product.title}</Link></h3> <span className="price">${product.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
       
        )}
        </div>
        
        
    )
 }

 export default ItemListContainer;