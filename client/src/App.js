import React, { Component } from 'react';

// Utils
import Time from './Utils/Time';
import API from './Utils/API';
import Stats from './Utils/Stats'

// Components
import Navbar from './Components/Navbar2';
import SideBar from './Components/Sidebar';
import Backdrop from './Components/Backdrop';
import Statlogs from './Components/Statlogs';
import Animal from './Components/Animal';
import Graph from './Components/Graph';

// Eventually this will be the hub for clientside routing
class App extends Component {

  state = {
    // Loading Page
    loading: true,
    animalsLoading: true,

    // List of animals
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
          // console.log("NO DATA")
          let time = new Time()

          // Create Time in databased
          API.createTime(time)
            .then(res2 => {

              // This is the function that will control the majority of the apps functionality
              // Here I set time in state to control the behavior of other components
              this.increaseTime = setInterval(() => {

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
                    // console.log("New Time updated")
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

          this.loadAnimals()

          // Set interval for time, This will constantly update the database
          // Again, this is the most important part of the app
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

            // BIRTHDAY CHECK
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
                      // console.log(logs)
                      let message = {
                        message: `[${time.monthStamp}]: ${this.state.animals[i].name}'s birthday is today! They are now ${this.state.animals[i].age + 2}`
                      }

                      logs.push(message);
                      // console.log(logs)
                      this.setState({
                        logs: logs
                      })
                      // Reload the animals to reflect 
                    })

                }
              }
            }

            // TICK DOWN ANIMAL STATS BASED OF ACTIVITY


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

        // console.log(averageAge)
        // console.log(genderRatio)

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
    // console.log(data)
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
    // console.log(species)
    if (species !== this.state.view) {
      this.setState({
        animalsLoading: true
      })
      API.getSpecies(species)
        .then(res => {
          // console.log("Got Species")
          // console.log(res.data)

          // STATS
          // Check top of the page to see stat functions
          let averageAge = Stats.average(res.data)
          let genderRatio = Stats.findRatio(res.data)

          // console.log(averageAge)
          // console.log(genderRatio)

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

  // BUG: Buttons not generating when creating new animals. Need to re-render the speciesList
  addAnimal = () => {
    let data = {
      species: this.state.species
    }
    API.addAnimal(data)
      .then(res => {
        console.log(res.data)
        this.setState({
          speciesList: res.data.species
        })
        if (this.state.view === 'All') {
          this.loadAnimals()
        } else {
          this.getViewSpecies()
        }
        console.log("animal added to zoo")
      })
  }

  render() {

    let backdrop;

    if (this.state.sideBarOpen) {
      backdrop = <Backdrop click={this.backDropHandler} />
    }

    // Styles
    let headerStyle = {
      backgroundColor: "#2f4f4f",
      border: "1px solid rgb(57,58,59)",
      padding: '5px'
    }

    let tableStyle = {
      backgroundColor: '#2f4f4f',
      border: '7px solid rgb(57,58,59)'
    }

    return (
      <div>
        {/* Pass in Bank variable as well */}
        <Navbar sideBarHandler={this.sideBarHandler} />
        <SideBar show={this.state.sideBarOpen} addAnimal={this.addAnimal} handleChange={this.handleInputChange} />
        {backdrop}
        <div className='home-container mt-4 mb-4'>

          {this.state.loading === false ?
            <div>
              <div className='row'>
                <div className='col-12 text-center'>

                  {/* I want to hide the page until the time comes back */}
                  <h2 className='display-2-xl display-4-sm'>{this.state.time.prettyTime}</h2>
                </div>
              </div>

              <div className='row'>
                {/* List of Animal Enclosures */}
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

                  {/* Maybe there should be main stats then there should be enclosure stats? */}
                  <h2>{this.state.view}</h2>
                  <Statlogs
                    animals={this.state.animals}
                    genderRatio={this.state.genderRatio}
                    averageAge={this.state.averageAge}
                    logs={this.state.logs}
                    message={this.state.message}
                  />
                  {this.state.animalsLoading === false ?
                    <div className='row'>

                      {/* This will be col-6 */}
                      <div className='col-xl-6' style={tableStyle} id='table' >
                        <div className='row'>
                          <div style={headerStyle} className="col-xl-2 col-sm-1 text-center"><h4>Animal</h4></div>
                          <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Age</h4></div>
                          {/* <div style={headerStyle} className='col-xl-1 col-sm-1 text-center'><h4>Species</h4></div> */}
                          <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Hunger</h4></div>
                          <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Stamina</h4></div>
                          <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Happy</h4></div>
                          <div style={headerStyle} className='col-xl-2 col-sm-1 text-center'><h4>Activity</h4></div>

                        </div>

                        {this.state.animals.length > 0 ?
                          this.state.animals.map((animal, i) => (

                            // Check Animal component for more detail, but basically this is each entry of animal
                            <Animal
                              key={i}
                              animal={animal}
                            />

                          ))
                          : <div className='row'>No animals in zoo yet</div>}

                      </div>

                      {/* Graph */}
                      <Graph />

                    </div>
                    :
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  }

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
