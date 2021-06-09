import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import moment from 'moment';

const socket = io();

function Chat() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [displayName, setDisplayName] = useState(null);
  const [displayNameInput, setDisplayNameInput] = useState("");

  useEffect(() => {
    socket.on("messages", message => {
      setReceivedMessages(message);
    });
}, []);

  const sendMessage = () => {
    const msg = {
      author: displayName,
      text: message,
      time: moment().format('DD/MM/YYYY h:mm:ss a') 
    }
    socket.emit("new-message", msg);
    setMessage("");
  };

  const onUpdateMessage = event => {
    setMessage(event.target.value);
  };

  const onUpdateDisplayNameInput = event => {
    setDisplayNameInput(event.target.value);
  };

  const updateDisplayName = () => {
    setDisplayName(displayNameInput);
  };

  return (
    <div className="container">
      {displayName ? (
        <div>
          <ul>
            {receivedMessages.map((item, index) => (
              <li key={index}>{item.author}: {item.text} [{item.time}]</li>
            ))}
          </ul>
          <input type="text" value={message} onChange={onUpdateMessage} placeholder="your message"/>
          <button onClick={sendMessage}>SEND</button>
        </div>
      ) : (
        <div>
          <label htmlFor="display-name">Enter your Name</label>
          <br />
          <input
            type="text"
            value={displayNameInput}
            onChange={onUpdateDisplayNameInput}
          />
          <button onClick={updateDisplayName}>SUBMIT</button>
        </div>
      )}
    </div>
  );
}

export default Chat;