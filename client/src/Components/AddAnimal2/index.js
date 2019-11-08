import React from 'react';
import API from '../../Utils/API';
// import Stats from '../Utils/Stats';

// I want this stateful component to only add animals to the 
class AddAnimal extends React.Component {

    state = {
        name: '',
        age: '',
        species: '',
        gender: '',
        activity: '',
        birthday: ''
    }

    handleInputChange = event => {
        let { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    addAnimal = () => {
        let data = {
            name: this.state.name,
            age: this.state.age,
            species: this.state.species,
            gender: this.state.gender,
            activity: this.state.activity,
            birthday: `${this.state.birthday}-0:0`,
            hunger: 100,
            stamina: 100,
            happy: 100
        }
        console.log(data)

        // this.setState({
        //     animalsLoading: true
        // })

        // Add Animal
        API.addAnimal(data)
            .then(res => {
                // Get Animals back
                API.getAnimals()
                    .then(res2 => {

                        // Send the data to the main component
                        // let genderRatio = Stats.findRatio(res2.data.animals)
                        // let averageAge = Stats.average(res2.data.animals)

                        // This changes the state of itself. We want t

                        // ctrl . ?? Get and Set accessors
                        this.setState({
                            name: '',
                            age: '',
                            species: '',
                            gender: '',
                            activity: '',
                            birthday: ''

                            // animals: res2.data.animals,
                            // speciesList: res2.data.species,
                            // loading: false,
                            // animalsLoading: false,

                            // genderRatio,
                            // averageAge,
                        })
                    })
            })
    }



    render() {
        return (
            <div className='col-sm-12 col-xl-12 mb-4'>

                <form>

                    <div className='row'>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='name'>Name</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.name} onChange={this.handleInputChange} name='name' className="form-control" id='name' />
                            </div>
                        </div>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='age'>Age</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.age} onChange={this.handleInputChange} name='age' className="form-control" id='age' />
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='species'>Species</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.species} onChange={this.handleInputChange} name='species' className='form-control' id='species' />
                            </div>

                        </div>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='gender'>Gender</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.gender} onChange={this.handleInputChange} name='gender' className='form-control' id='gender' />
                            </div>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='activity'>Activity</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.activity} onChange={this.handleInputChange} name='activity' className='form-control' id='activity' />
                            </div>
                        </div>
                        <div className='col-xl-6 col-sm-12'>
                            <label htmlFor='birthday'>Birthday</label>
                            <div className='input-group mb-3'>
                                <input value={this.state.birthday} onChange={this.handleInputChange} name='birthday' className='form-control' id='birthday' placeholder='ex. 1/3' />
                            </div>
                        </div>
                    </div>

                    <button type='button' className='btn btn-secondary' onClick={this.addAnimal}>Add Animal</button>
                </form>
            </div>

        )
    }
}

export default AddAnimal;