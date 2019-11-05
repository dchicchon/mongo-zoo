import React, { Component } from 'react';
import Time from './Utils/Time';
import API from './Utils/API';

/////////////////////////////////////// 
//////////STAT FUNCTIONS//////////////
//////////////////////////////////////

function average(arr) {
  let sum = 0;
  for (let i of arr) {
    sum += i.age;
  }
  let num = (sum / arr.length).toFixed(2)
  return num
}

function findRatio(arr) {

  let males = 0
  let females = 0
  if (arr.length > 1) {

    for (let i of arr) {
      if (i.gender === 'Male') {
        males++
      } else {
        females++
      }
    }
    let num = (males / females).toFixed(2)
    return num
  }
  return 'N/A'

}


/////////////////////////////////////// 
//////////END STAT FUNCTIONS//////////
//////////////////////////////////////



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
    time: '',

    // Stats
    averageAge: '',
    genderRatio: ''

  }

  componentDidMount() {

    // Lets add our in-game time. Later we will get the time based off of the user id
    console.log("Get time")

    // Get time from database
    API.getTime()
      .then(res => {

        // If there is not data
        if (res.data.length === 0) {
          console.log("No Time")
          let time = new Time()

          // Create Time in databased
          console.log(time)
          API.createTime(time)
            .then(dbTime => {
              console.log(dbTime)
              this.increaseTime = setInterval(() => {

                // Here I set time in state to control the behavior of other components
                // Update Time here as well

                this.setState({ time })
                API.updateTime(time)
                  .then(res => {
                    console.log("Time updated")
                  })
                time.increaseTime()

              }, 1000)

              // I want this to happen once the time interval has started
              this.loadAnimals()

            })


          // If there is data
        } else {

          // Time was found
          console.log(res.data[0]._id)
          let { seconds, minutes, days, season, year } = res.data[0]
          // Create time object based off of the data received
          let time = new Time(seconds, minutes, days, season, year)

          // Set interval for time, This will constantly update the database
          // This will also change the state of the App component
          this.increaseTime = setInterval(() => {
            this.setState({ time })
            time.increaseTime()

            let timeData = {        // we must access the new seconds to store them 
              _id: res.data[0]._id,  // in our database to keep it up to date
              seconds: time.seconds,
              minutes: time.minutes,
              days: time.days,
              season: time.season,
              year: time.year
            }
            API.updateTime(timeData)
              .then(res => {
                console.log("Time updated")
              })

            // Set State does not work when I set it after time.increaseTime()
            // this.setState({
            //   time: time1.timeStamp
            // })

          }, 1000)

          // I want this to happen once the time interval has started
          this.loadAnimals()
        }
      })
  }

  componentWillUnmount() {
    // clearInterval(this.interval)
    // clearInterval(this.increaseAgeInterval)
    clearInterval(this.increaseTime)
  }

  loadAnimals = () => {
    API.getAnimals()
      .then(res => {
        console.log(res.data)

        let averageAge = average(res.data.animals)
        let genderRatio = findRatio(res.data.animals)

        this.setState({
          animals: res.data.animals,
          speciesList: res.data.species,
          loading: false,
          animalsLoading: false,

          // stats
          averageAge,
          genderRatio

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

          // STATS
          // Check top of the page to see stat functions
          let averageAge = average(res.data)
          let genderRatio = findRatio(res.data)

          this.setState({
            view: species,
            animals: res.data,
            animalsLoading: false,

            // Stats
            averageAge,
            genderRatio
          })
        })
    }
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
                <h2>{this.state.time.prettyTime}</h2>
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
                <h4>Select an Enclosure to inspect</h4>
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

                  // This is the the table
                  <div>
                    <div id='table'>

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
                    <div className='mt-3' id='stats'>
                      <h5>Total Inhabitants: {this.state.animals.length}</h5>

                      {/* This should return back total females/ total males */}
                      <h5>Male to Female Ratio: {this.state.genderRatio} </h5>

                      {/* For the whole array, output a value */}
                      <h5>Average Age: {this.state.averageAge}  </h5>


                    </div>

                    {/* There should be a graph for the total zoo and for each enclosure */}
                    <div id='graph'>

                    </div>
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
