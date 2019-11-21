import React from 'react';
import './style.css'

const Statlogs = (props) => {
    return (
        <div className='mt-3 row'>
            <div style={{ backgroundColor: '#2f4f4f', border: '7px solid rgb(57,58,59)' }} className='col-6' id='stats'>
                <h2>Stats</h2>
                <h5>Total Inhabitants: {props.animals.length}</h5>
                <h5>Male to Female Ratio: {props.genderRatio}</h5>
                <h5>Average Age: {props.averageAge}</h5>
            </div>
            <div style={{ backgroundColor: '#2f4f4f', border: '7px solid rgb(57,58,59)' }} className='col-6' id='logs'>
                <h2>Logs</h2>
                {props.logs.length > 0 ?
                    props.logs.map((log, i) => (
                        <p key={i}>{log.message}</p>
                    ))
                    : ''
                }
                {props.message}
            </div>
        </div >
    )
}

export default Statlogs;