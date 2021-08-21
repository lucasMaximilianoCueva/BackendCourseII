import React from 'react';
import { Link } from 'react-router-dom';
import './Item.scss';



function Item ( { item: { _id, title, price, thumbnail, timestamp, stock} } ) {  
    return (
        <Link style={{textDecoration: "none"}} to={`/item/${_id}`}>
            <div className="item-container">
                <div>
                    <img src={thumbnail} alt="pharmacy" />
                </div>
                <h4>{title}</h4>
                <p><strike>{stock}</strike> ${price}</p>
            </div>
        </Link>
    )}

export default Item;