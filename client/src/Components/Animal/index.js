import React from 'react';

// Components
import Stat from '../Stat';
import ProgressStat from '../ProgressStat';

// Bring in Animal Icons here

const Animal = (props) => {

    function sex(type) {
        if (type === 'Female') {
            return <i className="fas fa-venus"></i>
        } else {
            return <i className="fas fa-mars"></i>
        }
    }

    function activity(action) {
        if (action === 'Playing') {
            return <i className="fas fa-running"></i>
        } else if (action === 'Eating') {
            return <i className="fas fa-utensils"></i>
        } else {
            return <i className="fas fa-bed"></i>
        }
    }

    return (
        <div className='row'>
            <Stat children={<span>{props.animal.name} {sex(props.animal.sex)}</span>}/>
            <Stat children={props.animal.age} />
            {/* <Stat children={props.animal.species} /> */}

            <ProgressStat stat={props.animal.hunger} />
            <ProgressStat stat={props.animal.stamina} />
            <ProgressStat stat={props.animal.happy} />

            <Stat children={activity(props.animal.activity)} />

        </div>
    )
}

export default Animal;