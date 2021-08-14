/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import './App.css';
import Header from './Header/Header';

function App() {
  return (
    <React.Fragment>
    <Header/>
    <div>
    <div className="App">
      <img className="profilePic" src="Images/Profile pic.jpg" alt=""/>
      <div className="myName">
        Nihar Ranjan
      </div>
      <div>
        <a href="https://twitter.com/NiharMahajan" className="fa fa-twitter"></a>
        <a href="https://www.facebook.com/niharranjan.mahajan420" className="fa fa-facebook"></a>
        <a href="https://www.linkedin.com/in/nihar-ranjan-5bb54853/" className="fa fa-linkedin"></a>
        <a href="https://www.instagram.com/n_i_h_a_r___/" className="fa fa-instagram"></a>
      </div>
    </div>
    </div>
    </React.Fragment>
  );
}

export default App;
