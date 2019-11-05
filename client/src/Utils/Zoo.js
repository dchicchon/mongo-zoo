const Animal = require("./Animal");
const Time = require("./Time");

let time1 = new Time()

// Birthday should reflect this
// this.timeStamp = `${this.season}/${this.days}/${this.year}-${this.minutes}:${this.seconds}`
// constructor(name, age, species, gender, activity, birthday, hunger = 100, stamina = 100, happy = 100) {

// Lets create a variable that will always randomize the birthday for the animals for when we first seed them in the database

// We will most likely only use this method for the future when new animals are created from the existing animals that we have in the zoo
// Maybe in the future a cool idea would be to create a family tree graph?
function newBirthday() {
    // Format looks like this season/day-minute:second

    return `${Math.floor(Math.random() * 4) + 1}/${Math.floor(Math.random() * 15) + 1}-${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 59) + 1}`
}

// Cannot use year

let gary = new Animal("Gary", 10, "Gorilla", "Male", "Sleeping", newBirthday());
let gilda = new Animal("Gilda", 11, "Gorilla", "Female", "Playing", newBirthday())
console.log(gary)
console.log(gilda)

// Making an array of zoo animals. In our application this will be sent and come from the mongodb database
// I should also store the time object in the mongodb database

let zoo = [];
zoo.push(gary, gilda);

// Using the info from Bergi
// https://stackoverflow.com/questions/58683553/using-the-property-value-of-a-class-to-affect-another-class-object-based-on-time


// This works in the case that the time1.time value increases and also runs a check on gary's birthday. However, once it reaches that day, gary does not stop aging! Must fix this by : 1. Give Gary a specific date and time where he will age... Actually that seems like a quick fix, lets do that for now. I can forsee *problems* for this solution such as an animal having their birthday in the middle of the night or something
console.log(time1)
// Also this function will have to run checks on multiple animals, not just one
// UPDATE 1: It works! Now I would like to apply this model to the current appplication
setInterval(function () {
    time1.increaseTime()
    console.log(time1.monthStamp)
    for (let i = 0; i < zoo.length; i++) {
        if (time1.monthStamp === zoo[i].birthday) {
            zoo[i].increaseAge();
        }
    }
}, 1000);




// What we want: based off of the time objects property of monthDate, we want to check to see if it's Gary's birthday. If so, we will increase his age

