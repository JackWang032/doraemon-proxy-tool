import React from 'react';
import { useEffect,useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [ip, setIp] = useState<string>('');
  chrome.storage.local.get('ip').then(res => {
    setIp(res.ip);
  })

  return (
    <div className="App">
      <header className="App-header">
        <p>
          你的ip: {ip}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
      
    </div>
  );
};

export default Popup;
