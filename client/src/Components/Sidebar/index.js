import React from 'react';
import './style.css';
// import AddAnimal2 from '../AddAnimal2'
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
                <li><a onClick={() => console.log("Hello")} href='#'>Requisition animal</a></li>

                {/* Does not work unless choose animal */}
                <select defaultValue='Bat' className="custom-select" name='species' onChange={props.handleChange}>
                    <option value="Bat">Bat</option>
                    <option value="Elephant">Elephant</option>
                    <option value="Gorilla">Gorilla</option>
                    <option value="Kangaroo">Kangaroo</option>
                    <option value="Lion">Lion</option>
                    <option value="Walrus">Walrus</option>
                </select>
                {/* Takes in prop from app.js */}
                <button className='btn btn-secondary' onClick={props.addAnimal}>Submit Order</button>
            </ul>
            {/* <AddAnimal2 /> */}
        </nav>
    )
}

export default SideBar;