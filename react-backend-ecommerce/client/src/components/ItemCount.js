import React, { useState } from 'react';

function ItemCount({initial, min, max, onAdd}) {
    const [isAdd, setAdd] = useState(initial);

    const addition = () => {
        const newValue = isAdd + 1;
        if (newValue <= max) {
            setAdd(newValue);
        }else {  
            alert('limite maximo de stock')
        }
    }
    const substraction = () => {
        const newValue = isAdd - 1;
        if (newValue >= min) {
            setAdd(newValue);
        }
    }
    const onConfirmAdd = () => {
      onAdd(isAdd)
    }

    return (
        <div>
                <button onClick={substraction}>-</button>
                <span>{isAdd}</span>
                <button onClick={addition}>+</button>
                <button onClick={onConfirmAdd} disabled={isAdd <= 0}>Agregar al carrito</button>

        </div>
    )
}

export default ItemCount;