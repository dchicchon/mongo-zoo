
// Received Alot of help from my question about classes here
// https://stackoverflow.com/questions/58683553/using-the-property-value-of-a-class-to-affect-another-class-object-based-on-time

// Here is our setInterval function, I want the current time to always be changing
// To test, lets make there 30 seconds in a minute
// How do we make that?

// I guess each year would be 4 seasons.

// You can see the date on the left sie and the minutes with the seconds on the right-hand side
// In game clock should look like this 3/2/0 12:54

// I wanted this to be apart of the Time class and it only produced errors. If I had this and tried to 
// console.log(this.time) in the increase Time function, it would produce 'NaN'. Probably figure this out later

class Time {
    constructor(seconds = 0, minutes = 0, days = 1, season = 1, year = 0) {
        this.seconds = seconds;
        this.minutes = minutes;
        this.days = days;
        this.season = season;
        this.year = year;

        // Remove this because now we have getters to this, which they will be always up to date
        // this.clock = `${this.minutes}:${this.seconds}`;
        // this.monthDate = `${this.season}/${this.days}`
        // this.yearDate = `${this.season}/${this.days}/${this.year}`
        // this.timeStamp = `${this.season}/${this.days}/${this.year}-${this.minutes}:${this.seconds}`

        // Start timer when 

        // Got some info from Bergi that this isnt necessary here but in the main file Zoo.js
        // this.countTime = setInterval(this.increaseTime.bind(this), 1000)
    }

    // Also, to have my items be updated constantly, I should have getters here. Based off of Jonas Wilms suggestion
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get

    get clock() { // if this is a getter, it is always up to date
        return `${this.minutes}:${this.seconds}`;
    }
    get monthDate() {
        return `${this.season}/${this.days}`;
    }
    get yearDate() {
        return `${this.season}/${this.days}/${this.year}`;
    }

    get monthStamp() {
        return `${this.season}/${this.days}-${this.minutes}:${this.seconds}`;

    }
    get timeStamp() {
        return `${this.season}/${this.days}/${this.year}-${this.minutes}:${this.seconds}`;
    }

    get prettyTime() {
        let seasonKey = {
            '1': 'Fall',
            '2': 'Winter',
            '3': 'Spring',
            '4': 'Summer'
        }
        if (this.seconds < 10) {
            return `Season: ${seasonKey[`${this.season}`]} Day: ${this.days} Time:    ${this.minutes}:0${this.seconds}`
        } else {
            return `Season: ${seasonKey[`${this.season}`]} Day: ${this.days} Time:    ${this.minutes}:${this.seconds}`
        }

    }

    increaseTime() {
        // Unnecessary I dont know how to spell this
        // this.clock = `${this.minutes}:${this.seconds}`
        // this.monthDate = `${this.season}/${this.days}`
        // this.yearDate = `${this.season}/${this.days}/${this.year}`
        // this.timeStamp = `${this.season}/${this.days}/${this.year}-${this.minutes}:${this.seconds}`

        if (this.seconds === 59) {
            this.seconds = 0;
            this.minutes++
            if (this.minutes === 5) {
                this.minutes = 0;
                this.days++
                if (this.days === 15) {
                    this.days = 1;
                    this.season++
                    if (this.season === 5) {
                        this.season = 1;
                        this.year++
                    }
                }
            }
        } else {
            this.seconds++
        }
    }

}

export default Time;


// This works right now! That's awesome
// let time = new Time()

// Lets also combine this with the animal Class to have animals birthday be a specific date
