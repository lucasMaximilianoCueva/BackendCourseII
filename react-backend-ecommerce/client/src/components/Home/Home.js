import React from 'react';
import './Home.css';
import SearchInput from '../SearchInput/SearchInput';
import ItemCount from '../ItemCount';

function Home() {
  function onAdd(count) {
    alert("Compraste" + count + "items");
    // setAdd(min); (agregado) estaria bueno setear a cero el contador luego de agregar al carrito
}
    return (
    <div className="App">
        <header className="App-header">
          <img className="App-logo" src="https://miro.medium.com/max/1000/1*_bq2g7Lo2RjWi98i5l75Wg.png" alt="logo" />
          <h1 className="App-title">React Express App</h1>
        </header>
        <SearchInput />
        <ItemCount initial={0} min={1} max={10} onAdd={onAdd}/>
      </div>
    )
}

export default Home;