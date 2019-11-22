import React from 'react';

// Components
import Animal from '../Animal';

const Animals = (props) => {
    let headerStyle = {
        backgroundColor: "#2f4f4f",
        border: "1px solid rgb(57,58,59)",
        padding: '5px'
    }

    let tableStyle = {
        backgroundColor: '#2f4f4f',
        border: '7px solid rgb(57,58,59)'
    }
    return (
        <div className='col-xl-6' style={tableStyle} id='table' >
            <h2>Animals</h2>
            <div className='row'>
                <div style={headerStyle} className="col-xl-2 col-sm-1 text-center"><h4>Animal</h4></div>
                <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Age</h4></div>
                {/* <div style={headerStyle} className='col-xl-1 col-sm-1 text-center'><h4>Species</h4></div> */}
                <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Hunger</h4></div>
                <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Stamina</h4></div>
                <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Happy</h4></div>
                <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Activity</h4></div>

            </div>

            {props.animals.length > 0 ?
                props.animals.map((animal, i) => (

                    // Check Animal component for more detail, but basically this is each entry of animal
                    <Animal
                        key={i}
                        animal={animal}
                    />

                )) : <div className='row'>No animals in zoo yet</div>
            }
        </div>
    )
}

export default Animals;