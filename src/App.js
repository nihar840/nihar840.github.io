import React from 'react';
import './App.css';
import Header from './Header/Header';

function App() {
  return (
    <React.Fragment>
    <header><Header/></header>
    <body>
    <div className="App">
      <img className="profilePic" src="Images/Profile pic.jpg" alt=""/>
      <div className="myName">
        Nihar Ranjan
      </div>
    </div>
    </body>
    </React.Fragment>
  );
}

export default App;
