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
        // console.log("RETURN DATA")
        // console.log(res.data)

        // If there is not data
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
                // console.log(this.state.animals[i].birthday)
                // console.log(time.monthStamp)
                if (this.state.animals[i].birthday === time.monthStamp) {

                  // Making an object out of the animal will take too long, lets just modify it in the db
                  // Now update the database!
                  API.increaseAnimalAge(this.state.animals[i]._id)
                    .then(res2 => {
                      // console.log(res2.data)
                      // Could use the response to show the new age
                      // console.log(time.monthStamp)
                      this.loadAnimals()
                      this.setState({
                        message: `[${time.monthStamp}]: ${this.state.animals[i].name}'s birthday is today! They are now ${this.state.animals[i].age + 1}`
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

            // Set State does not work when I set it after time.increaseTime()
            // this.setState({
            //   time: time1.timeStamp
            // })

          }, 1000)


        }
      })
  }

  componentWillUnmount() {
    // clearInterval(this.interval)
    // clearInterval(this.increaseAgeInterval)
    clearInterval(this.increaseTime)
  }

  // 
  loadAnimals = () => {

    // let animals = [];

    API.getAnimals()
      .then(res => {

        let averageAge = average(res.data.animals)
        let genderRatio = findRatio(res.data.animals)

        // Dont need to make class out of this
        // for (let i = 0; i < res.data.animals.length; i++) {
        // let { name, age, species, gender, activity, birthday, hunger, stamina, happy } = res.data.animals[i]
        // let animal = new Animal(name, age, species, gender, activity, birthday, hunger, stamina, happy);
        // let animalData = {
        //   _id: res.data.animals[i]._id,
        //   name: animal.name
        // }
        // animals.push(animalData);
        // }

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
      birthday: `${this.state.birthday}-0:0`
    }
    console.log(data)
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
      <div>
        <Navbar />
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

                  <label htmlFor='birthday'>Birthday</label>
                  <div className='row input-group mb-3'>
                    <input value={this.state.birthday} onChange={this.handleInputChange} name='birthday' className='form-control' id='birthday' placeholder='ex. 1/3' />
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
                          <div className='col-2'><h5>Birthday</h5></div>

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
                              <div className='col-2'>
                                {animal.birthday.substring(0, 4)}
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
                          {this.state.message}
                        </div>
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
      </div>
    );
  }
}

export default App;
