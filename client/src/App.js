import React, { Component } from 'react';

// Utils
import Time from './Utils/Time';
// import Animal from './Utils/Animal';
import API from './Utils/API';

// Components
import Navbar from './Components/Navbar'

// Here is my overall plan
// Get Time and List of Animals with class
// I don't think I can use class with react

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
    // May replace this list with objects created from Class rather than res.data
    animals: [],
    speciesList: [],

    // Add animal
    name: '',
    age: '',
    species: '',
    gender: '',
    activity: '',
    birthday: '',

    // View
    view: 'All',

    // Time
    time: '',

    // Logs
    message: '',
    logs: [],

    // Stats
    averageAge: '',
    genderRatio: '',

  }

  // Here I am getting the time, running a check on the animals birthday, and updating the time in the
  // database
  componentDidMount() {

    // Lets add our in-game time. Later we will get the time based off of the user id
    // Get time from database
    API.getTime()
      .then(res => {

        if (res.data.length === 0) {
          console.log("NO DATA")
          let time = new Time()

          // Create Time in databased
          API.createTime(time)
            .then(res2 => {
              this.increaseTime = setInterval(() => {

                // Here I set time in state to control the behavior of other components
                // Update Time here as well
                let timeData = {        // we must access the new seconds to store them 
                  _id: res2.data._id,  // in our database to keep it up to date
                  seconds: time.seconds,
                  minutes: time.minutes,
                  days: time.days,
                  season: time.season,
                  year: time.year
                }

                this.setState({ time })
                API.updateTime(timeData)
                  .then(res => {
                    console.log("New Time updated")
                  })
                time.increaseTime()

              }, 1000)

              // I want this to happen once the time interval has started
              this.loadAnimals()

            })


          // If there is data
        } else {

          // Time was found
          let { seconds, minutes, days, season, year } = res.data[0]
          // Create time object based off of the data received
          let time = new Time(seconds, minutes, days, season, year)

          // Set interval for time, This will constantly update the database
          // This will also change the state of the App component
          // I want this to happen once the time interval has started
          this.loadAnimals()
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

            // Have a check to see if an animals birthday is today
            if (this.state.animals.length > 0) {
              for (let i = 0; i < this.state.animals.length; i++) {
                if (this.state.animals[i].birthday === time.monthStamp) {

                  // Making an object out of the animal will take too long, lets just modify it in the db
                  // Now update the database!
                  API.increaseAnimalAge(this.state.animals[i]._id)
                    .then(res2 => {

                      if (this.state.view === 'All') {
                        this.loadAnimals()
                      } else {
                        this.getViewSpecies()
                      }

                      // Here I can load up logs for animals. Also be sure to pop the log array when it's length reaches 5  
                      let logs = this.state.logs
                      if (logs.length > 5) {
                        logs.shift()
                      }
                      console.log(logs)
                      let message = {
                        message: `[${time.monthStamp}]: ${this.state.animals[i].name}'s birthday is today! They are now ${this.state.animals[i].age + 1}`
                      }

                      logs.push(message);
                      console.log(logs)
                      this.setState({
                        logs: logs
                      })
                      // Reload the animals to reflect 
                    })

                }
              }
            }

            API.updateTime(timeData)
              .then(res3 => {
                // console.log("Time updated")
              })

          }, 1000)


        }
      })
  }

  componentWillUnmount() {
    clearInterval(this.increaseTime)
  }

  loadAnimals = () => {

    API.getAnimals()
      .then(res => {

        // If res.data has data => {}
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
      activity: this.state.activity,
      birthday: `${this.state.birthday}-0:0`,
      hunger: 100,
      stamina: 100,
      happy: 100
    }
    console.log(data)
    this.setState({
      animalsLoading: true
    })

    // Update stat functions
    API.addAnimal(data)
      .then(res => {
        API.getAnimals()
          .then(res2 => {

            let genderRatio = findRatio(res2.data.animals)
            let averageAge = average(res2.data.animals)
            this.setState({
              animals: res2.data.animals,
              speciesList: res2.data.species,
              loading: false,
              animalsLoading: false,

              genderRatio,
              averageAge,
            })
          })
      })
  }

  // Change the view depending on which button we click. Lets change this to a functino that doesnt depend on events!

  getViewSpecies = () => {
    let species = this.state.view
    API.getSpecies(species)
      .then(res => {
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
      <div>
        <Navbar />
        <div className='home-container mt-4 mb-4'>

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

              {/* This will be the AddAnimal Component in the future. Should have dropdown menus for several parts */}
              <div className='row'>
                <div className='col-3 mb-4'>

                  <form>

                    <div className='row'>
                      <div className='col-6'>
                        <label htmlFor='name'>Name</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.name} onChange={this.handleInputChange} name='name' className="form-control" id='name' />
                        </div>
                      </div>
                      <div className='col-6'>
                        <label htmlFor='age'>Age</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.age} onChange={this.handleInputChange} name='age' className="form-control" id='age' />
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-6'>
                        <label htmlFor='species'>Species</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.species} onChange={this.handleInputChange} name='species' className='form-control' id='species' />
                        </div>

                      </div>
                      <div className='col-6'>
                        <label htmlFor='gender'>Gender</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.gender} onChange={this.handleInputChange} name='gender' className='form-control' id='gender' />
                        </div>

                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-6'>
                        <label htmlFor='activity'>Activity</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.activity} onChange={this.handleInputChange} name='activity' className='form-control' id='activity' />
                        </div>
                      </div>
                      <div className='col-6'>
                        <label htmlFor='birthday'>Birthday</label>
                        <div className='input-group mb-3'>
                          <input value={this.state.birthday} onChange={this.handleInputChange} name='birthday' className='form-control' id='birthday' placeholder='ex. 1/3' />
                        </div>
                      </div>
                    </div>



                    <button type='button' className='btn btn-secondary' onClick={this.addAnimal}>Add Animal</button>
                  </form>
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

                  {this.state.animalsLoading === false ?
                    <div>
                      <div id='table' >

                        <h2>{this.state.view}</h2>

                        <div className='row'>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className="col-1 text-center"><h4>Name</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Age</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Species</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Gender</h4></div>

                          {/* Animal Stats */}
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Hunger</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Stamina</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Happy</h4></div>

                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Activity</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Birthday</h4></div>

                        </div>

                        {this.state.animals.length > 0 ?
                          this.state.animals.map((animal, i) => (
                            <div className='row' key={i}>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.name}
                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.age}
                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.species}
                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.gender}
                              </div>

                              {/* =============================================================== */}
                              {/* Begin Animal Stats */}
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>

                                {animal.hunger}
                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: animal.hunger }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>

                                {animal.stamina}
                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: animal.stamina }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>

                                {animal.happy}
                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: animal.happy }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                              </div>

                              {/* End Animal Stats */}
                              {/* =============================================================== */}

                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.activity}
                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.birthday.substring(0, 4)}
                                {/* {animal.birthday} */}
                              </div>
                            </div>

                          ))
                          : <div className='row'>No animals in zoo yet</div>}

                      </div>
                      <div className='mt-3 row'>
                        {/* Stats */}
                        <div style={{ backgroundColor: "#2f4f4f", border: '7px solid rgb(57,58,59)' }} className='col-6' id='stats'>
                          <h2>Stats</h2>
                          <h5>Total Inhabitants: {this.state.animals.length}</h5>
                          <h5>Male to Female Ratio: {this.state.genderRatio} </h5>
                          <h5>Average Age: {this.state.averageAge}  </h5>
                        </div>
                        {/* Message Logs */}
                        {/* #56A3A6: Blue */}
                        <div style={{ backgroundColor: "#2f4f4f", border: '7px solid rgb(57,58,59)' }} className='col-6' id='logs'>

                          <h2>Logs</h2>
                          {this.state.logs.length > 0 ?
                            this.state.logs.map((log, i) => (
                              <p key={i}>{log.message}</p>
                            ))
                            : ''}
                          {this.state.message}
                        </div>
                      </div>

                      {/* There should be a graph for the total zoo and for each enclosure */}
                      < div id='graph' >

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
      </div>
    );
  }
}

export default App;
