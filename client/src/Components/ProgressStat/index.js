import React from 'react';


const ProgressStat = (props) => {
  let style1 = {
    backgroundColor: "#2f4f4f",
    border: "1px solid rgb(57,58,59)",
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }

  return (
    <div style={style1} className='col-xl-2 col-sm-1 text-center'>

      <div className="progress">
        <div className="progress-bar bg-info text-center" role="progressbar" style={{ width: `${props.stat}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">{props.stat}</div>
      </div>

    </div>
  )
}

export default ProgressStat;