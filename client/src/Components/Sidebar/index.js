import React from 'react';
import './Sidebar.css';
import AddAnimal2 from '../AddAnimal2'
// import AddAnimal from '../AddAnimal';

// This guy is awesome. He helped me make my sidebar
// https://www.youtube.com/watch?v=l6nmysZKHFU

function SideBar(props) {

    let barClasses = 'side-bar'
    if (props.show) {
        barClasses = 'side-bar open'
    }

    return (
        <nav className={barClasses}>
            <ul>
                <li><a href='#'>Animals</a></li>
                <li><a href='#'>Add Animal</a></li>
            </ul>
            <AddAnimal2 />
        </nav>
    )
}

export default SideBar;