import React from 'react';
import './style.css'

const Stat = (props) => {
    let style1 = {
        backgroundColor: "#2f4f4f",
        border: "1px solid rgb(57,58,59)",
        padding: '5px'
    }
    return (
        <div style={style1} className='col-xl-2 col-sm-1 text-center'>
            {props.children}
        </div>
    )
}

export default Stat;