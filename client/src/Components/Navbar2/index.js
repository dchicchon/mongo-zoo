import React from 'react';
import SidebarToggle from '../Sidebar/SidebarToggle';

import './Navbar.css'
// import { Link } from 'react-router-dom';

function Navbar(props) {
    return (

        <nav className="navbar navbar-expand-lg">
            <SidebarToggle click={props.sideBarHandler} />
            <a className="navbar-brand text-light" style={{ marginLeft: '1rem' }} href="/">ZooMongo</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link text-light" rel='noopener noreferrer' target="_blank" href="https://github.com/dchicchon/mongo-zoo">Github<span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link text-light" rel='noopener noreferrer' href="#">Docs<span className="sr-only">(current)</span></a>
                    </li>
                </ul>
            </div>

            {/* This is your bank */}
            <div id='bank'>
                Bank: $10,000
            </div>
        </nav>
    )
}

export default Navbar;