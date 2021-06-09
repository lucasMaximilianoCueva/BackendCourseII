import React from 'react';
import './Home.css';
import Chat from '../Chat/Chat.js'
import SearchInput from '../SearchInput/SearchInput';

function Home() {
    return (
    <div className="App">
        <header className="App-header">
          <img className="App-logo" src="https://miro.medium.com/max/1000/1*_bq2g7Lo2RjWi98i5l75Wg.png" alt="logo" />
          <h1 className="App-title">React Express App</h1>
        </header>
        <Chat />
        <SearchInput />
      </div>
    )
}

export default Home;