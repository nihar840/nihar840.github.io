import * as React from 'react';
import './Header.css';

 function Header(){
    return(
        <React.Fragment>
        <div className = "header">
            <div className="logo">My Portfolio</div>
            <div className="logoRight">Developed With React</div><img className="reactLogo" src="logo192.png" alt=""/>
            <div className="animatingDiv"/>
        </div>
        </React.Fragment>
    );
}

export default Header;