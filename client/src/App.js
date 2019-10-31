import React, { Component } from 'react';
import API from './Utils/API';
// import logo from './logo.svg';
// import './App.css';

class App extends Component {

  state = {
    // Loading Page
    loading: true,
    animalsLoading: true,

    // List of animals
    animals: [],
    speciesList: [],

    // Add animal
    name: '',
    age: '',
    species: '',
    gender: '',

    // View
    view: 'All'

  }

  componentDidMount() {
    console.log("Getting Animals")
    API.getAnimals()
      .then(res => {
        console.log("Response")
        console.log(res.data)
        this.setState({
          animals: res.data.animals,
          speciesList: res.data.species,
          loading: false,
          animalsLoading: false
        })
      })
  }

  handleInputChange = event => {
    let { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  addAnimal = () => {
    let data = {
      name: this.state.name,
      age: this.state.age,
      species: this.state.species,
      gender: this.state.gender
    }
    API.addAnimal(data)
      .then(res => {
        console.log("Animal added to zoo")
      })
  }

  // changeView = event => {
  //   let { value } = event.target
  //   this.setState({
  //     view: value
  //   })
  // }

  // Change the view depending on which button we click
  getSpecies = (event) => {
    let { value: species } = event.target
    console.log(species)
    this.setState({
      animalsLoading: true
    })
    API.getSpecies(species)
      .then(res => {
        console.log("Got Species")
        console.log(res.data)
        this.setState({
          view: species,
          animals: res.data,
          animalsLoading: false
        })
      })
  }

  render() {

    return (
      <div className='container mt-4'>

        {this.state.loading === false ?
          <div>
            <h1>The Zoo</h1>
            <div className='row'>
              <div className='col-3 mb-4'>
                <label htmlFor='name'>Name</label>
                <div className='row input-group mb-3'>
                  <input value={this.state.name} onChange={this.handleInputChange} name='name' className="form-control" id='name' />
                </div>

                <label htmlFor='age'>Age</label>
                <div className='row input-group mb-3'>
                  <input value={this.state.age} onChange={this.handleInputChange} name='age' className="form-control" id='age' />
                </div>

                <label htmlFor='species'>Species</label>
                <div className='row input-group mb-3'>
                  <input value={this.state.species} onChange={this.handleInputChange} name='species' className='form-control' id='species' />
                </div>

                <label htmlFor='gender'>Gender</label>
                <div className='row input-group mb-3'>
                  <input value={this.state.gender} onChange={this.handleInputChange} name='gender' className='form-control' id='gender' />
                </div>

                <button type='button' className='btn btn-secondary' onClick={this.addAnimal}>Add Animal</button>
              </div>
              <div className='col-9'>
                <h3>Select an Enclosure to inspect</h3>
                <div className='row mb-3'>
                  <button type='button' className='btn btn-secondary col-2 ml-2' value='All' onClick={this.getSpecies}>All</button>
                  {this.state.speciesList.length > 0 ?
                    this.state.speciesList.map((species, i) => (
                      <button type='button' className='btn btn-secondary col-2 ml-2' value={species} key={i} onClick={this.getSpecies}>{species}</button>
                    ))
                    : ""}

                </div>
                {/* Here we will map each of the animals */}

                {this.state.animalsLoading === false ?
                  <div>
                    <h4>{this.state.view}</h4>

                    <div className='row'>
                      <div className="col-3"><h5>Name</h5></div>
                      <div className='col-3'><h5>Age</h5></div>
                      <div className='col-3'><h5>Species</h5></div>
                      <div className='col-3'><h5>Gender</h5></div>

                    </div>

                    {this.state.animals.length > 0 ?
                      this.state.animals.map((animal, i) => (
                        <div className='row' key={i}>
                          <div className='col-3'>
                            {animal.name}
                          </div>
                          <div className='col-3'>
                            {animal.age}
                          </div>
                          <div className='col-3'>
                            {animal.species}
                          </div>
                          <div className='col-3'>
                            {animal.gender}
                          </div>
                        </div>
                      ))
                      : <div className='row'>No animals in zoo yet</div>}

                  </div>
                  :
                  <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>}
                {/* This value will need to change depending on the species being examined */}

              </div>


            </div>

          </div>

          :
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>}

        {/* Wireframe */}
        {/* Title */}
        {/* List of Animals in certain exhibit */}
        {/* Add animal to zoo */}


        {/* Button Row to select which animals will show */}
        {/* We should make buttons based on which animal species that we have available */}






      </div>
    );
  }
}

export default App;
