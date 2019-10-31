import React, { Component } from 'react';
import moment from 'moment';
import API from './Utils/API';

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
    activity: '',

    // View
    view: 'All',

    // Time
    time: ''

  }

  componentDidMount() {
    console.log("Getting Animals")
    this.interval = setInterval(() => this.setState({ time: moment().format("dddd, MMMM Do YYYY, h:mm:ss a") }), 1000);
    API.getAnimals()
      .then(res => {
        console.log("Response")
        console.log(res.data)
        // console.log(currentTime)

        this.setState({
          animals: res.data.animals,
          speciesList: res.data.species,
          loading: false,
          animalsLoading: false,
          // time: currentTime

        })
      })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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
      gender: this.state.gender,
      activity: this.state.activity
    }
    this.setState({
      animalsLoading: true
    })
    API.addAnimal(data)
      .then(res => {
        console.log("Animal added to zoo")
        API.getAnimals()
          .then(res2 => {
            console.log(res2.data)
            this.setState({
              animals: res2.data.animals,
              speciesList: res2.data.species,
              loading: false,
              animalsLoading: false
            })
          })
      })
  }

  // This is now integrated within get species
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
    if (species !== this.state.view) {
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
  }

  // This does not work at the moment
  clock = () => {
    // Here we want the current time to look like this Monday, 12/12/2019 12:45 PM
    let currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    console.log(currentTime)
    this.setState({
      time: currentTime
    })
  }

  render() {

    return (
      <div className='container mt-4'>

        {this.state.loading === false ?
          <div>
            <div className='row'>
              <div className='col-3'>
                <h1>The Zoo</h1>
              </div>
              <div className='col-9'>
                <h2>{this.state.time}</h2>
              </div>
            </div>

            <div className='row'>

              {/* This will be the AddAnimal Component in the future. Should have dropdown menus for several parts */}
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

                <label htmlFor='activity'>Activity</label>
                <div className='row input-group mb-3'>
                  <input value={this.state.activity} onChange={this.handleInputChange} name='activity' className='form-control' id='activity' />
                </div>

                <button type='button' className='btn btn-secondary' onClick={this.addAnimal}>Add Animal</button>
              </div>

              <div className='col-9'>
                <h3>Select an Enclosure to inspect</h3>
                <div className='row mb-3'>
                  <button type='button' className='btn btn-secondary col-1 ml-2' value='All' onClick={this.getSpecies}>All</button>
                  {this.state.speciesList.length > 0 ?
                    this.state.speciesList.map((species, i) => (
                      <button type='button' className='btn btn-secondary col-1 ml-2' value={species} key={i} onClick={this.getSpecies}>{species}</button>
                    ))
                    : ""}

                </div>
                {/* Here we will map each of the animals */}

                {this.state.animalsLoading === false ?
                  <div>
                    <h4>{this.state.view}</h4>

                    <div className='row'>
                      <div className="col-2"><h5>Name</h5></div>
                      <div className='col-2'><h5>Age</h5></div>
                      <div className='col-2'><h5>Species</h5></div>
                      <div className='col-2'><h5>Gender</h5></div>
                      <div className='col-2'><h5>Activity</h5></div>
                    </div>

                    {this.state.animals.length > 0 ?
                      this.state.animals.map((animal, i) => (
                        <div className='row' key={i}>
                          <div className='col-2'>
                            {animal.name}
                          </div>
                          <div className='col-2'>
                            {animal.age}
                          </div>
                          <div className='col-2'>
                            {animal.species}
                          </div>
                          <div className='col-2'>
                            {animal.gender}
                          </div>
                          <div className='col-2'>
                            {animal.activity}
                          </div>
                        </div>
                      ))
                      : <div className='row'>No animals in zoo yet</div>}

                  </div>
                  :
                  <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>}

              </div>


            </div>

          </div>

          :
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>}

      </div>
    );
  }
}

export default App;
