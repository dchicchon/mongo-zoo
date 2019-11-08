import React, { Component } from 'react';

// Utils
import Time from './Utils/Time';
// import Animal from './Utils/Animal';
import API from './Utils/API';
import Stats from './Utils/Stats'

// Components
import Navbar from './Components/Navbar2';
import SideBar from './Components/Sidebar';
import Backdrop from './Components/Backdrop';

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
    species: '',

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

    // Sidebar
    sideBarOpen: false,
    backDropOpen: false

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
            this.setState({
              time,
              loading: false,
              animalsLoading: false,
            })
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
                        message: `[${time.monthStamp}]: ${this.state.animals[i].name}'s birthday is today! They are now ${this.state.animals[i].age + 2}`
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
        let averageAge = Stats.average(res.data.animals)
        let genderRatio = Stats.findRatio(res.data.animals)

        this.setState({
          animals: res.data.animals,
          speciesList: res.data.species,
          // loading: false,
          // animalsLoading: false,

          // stats
          averageAge,
          genderRatio

        })
      })
  }

  // handleInputChange = event => {
  //   let { value, name } = event.target;
  //   this.setState({
  //     [name]: value
  //   });
  // }

  // Moving this into a stateful component called AddAnimal.js
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

            let genderRatio = Stats.findRatio(res2.data.animals)
            let averageAge = Stats.average(res2.data.animals)
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
        let averageAge = Stats.average(res.data)
        let genderRatio = Stats.findRatio(res.data)

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

  // Show list of animals of that species 
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
          let averageAge = Stats.average(res.data)
          let genderRatio = Stats.findRatio(res.data)

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

  backDropHandler = () => {
    this.setState({
      sideBarOpen: false
    })
  }
  sideBarHandler = () => {
    this.setState((prevState) => {
      return { sideBarOpen: !prevState.sideBarOpen }
    })
  }

  handleInputChange = event => {
    let { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  addAnimal = () => {
    console.log(this.state.species)
    let data = {
      species: this.state.species
    }
    API.addAnimal(data)
      .then(res => {
        console.log(res.data)
        if (this.state.view === 'All') {
          this.loadAnimals()
        } else {
          this.getViewSpecies()
        }
        console.log("animal added to zoo")
      })
  }

  render() {

    // let sideBar;
    let backdrop;

    if (this.state.sideBarOpen) {
      // sideBar = <SideBar />
      backdrop = <Backdrop click={this.backDropHandler} />
    }

    function gender(type) {
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
      // inline style={{height: '100%'}}
      <div>
        <Navbar sideBarHandler={this.sideBarHandler} />
        <SideBar show={this.state.sideBarOpen} addAnimal={this.addAnimal} handleChange={this.handleInputChange} />
        {/* {sideBar} */}
        {backdrop}
        {/* <Backdrop /> */}
        <div className='home-container mt-4 mb-4'>

          {this.state.loading === false ?
            <div>
              <div className='row'>
                {/* <div className='col-3'> */}
                {/* <h1>The Zoo</h1> */}
                {/* </div> */}
                <div className='col-12 text-center'>

                  {/* I want to hide the page until the time comes back */}
                  <h2 className='display-2-xl display-4-sm'>{this.state.time.prettyTime}</h2>
                </div>
              </div>

              {/* This will be the AddAnimal Component in the future. Should have dropdown menus for several parts */}
              <div className='row'>

                {/* Pass in props? I think I want to pass in state from this one somehow */}
                {/* <AddAnimal /> */}

                <div className='col-xl-12 col-sm-12'>
                  <h4>Select an Enclosure to inspect</h4>
                  <div className='row mb-3'>
                    <button type='button' className='btn btn-secondary col-xl-1 col-sm-2 ml-2 mr-2' value='All' onClick={this.getSpecies}>All</button>
                    {this.state.speciesList.length > 0 ?
                      this.state.speciesList.map((species, i) => (
                        <button type='button' className='btn btn-secondary col-xl-1 col-sm-2 ml-2 mr-2' value={species} key={i} onClick={this.getSpecies}>{species}</button>
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
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Sex</h4></div>

                          {/* Animal Stats */}
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Hunger</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Stamina</h4></div>
                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Happy</h4></div>

                          <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Activity</h4></div>
                          {/* <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'><h4>Birthday</h4></div> */}

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
                                {gender(animal.gender)}
                              </div>

                              {/* =============================================================== */}
                              {/* Begin Animal Stats */}
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className='col-1 text-center'>

                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: `${animal.hunger}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">{animal.hunger}</div>
                                </div>

                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className='col-1 text-center'>

                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: `${animal.stamina}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">{animal.stamina}</div>
                                </div>

                              </div>
                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className='col-1 text-center'>

                                <div className="progress">
                                  <div className="progress-bar bg-info" role="progressbar" style={{ width: `${animal.happy}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">{animal.happy}</div>
                                </div>

                              </div>

                              {/* End Animal Stats */}
                              {/* =============================================================== */}

                              <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {activity(animal.activity)}
                              </div>
                              {/* <div style={{ backgroundColor: "#2f4f4f", border: "1px solid rgb(57,58,59)", padding: '5px' }} className='col-1 text-center'>
                                {animal.birthday.substring(0, 4)}
                              </div> */}
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
