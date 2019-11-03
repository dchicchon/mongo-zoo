const Animal = require("./Animal");
const Time = require("./Time");

let time1 = new Time()

// Birthday should reflect this
// this.timeStamp = `${this.season}/${this.days}/${this.year}-${this.minutes}:${this.seconds}`
// constructor(name, age, species, gender, activity, birthday, hunger = 100, stamina = 100, happy = 100) {
let gary = new Animal("Gary", 10, "Gorilla", "Male", "Sleeping", '1/2/0-0:1');
let gilda = new Animal("Gilda", 11, "Gorilla", "Female", "Playing", "1/3/0-0:1")
console.log(gary)
console.log(gilda)

// Making an array of zoo animals
let zoo = [];
zoo.push(gary, gilda);

// Using the info from Bergi
// https://stackoverflow.com/questions/58683553/using-the-property-value-of-a-class-to-affect-another-class-object-based-on-time


// This works in the case that the time1.time value increases and also runs a check on gary's birthday. However, once it reaches that day, gary does not stop aging! Must fix this by : 1. Give Gary a specific date and time where he will age... Actually that seems like a quick fix, lets do that for now. I can forsee *problems* for this solution such as an animal having their birthday in the middle of the night or something

// Also this function will have to run checks on multiple animals, not just one
// UPDATE 1: It works! Now I would like to apply this model to the current appplication
setInterval(function () {
    time1.increaseTime()
    console.log(time1.timeStamp)
    for (let i = 0; i < zoo.length; i++) {
        if (time1.timeStamp === zoo[i].birthday) {
            zoo[i].increaseAge();
        }
    }
}, 1000);




// What we want: based off of the time objects property of monthDate, we want to check to see if it's Gary's birthday. If so, we will increase his age

