
class Animal {

    // Stamina and hunger should be steadily ticking down depending on the activity
    constructor(name, age, species, gender, activity, birthday, hunger = 100, stamina = 100, happy = 100) {
        this.name = name;
        this.age = age;
        this.species = species;
        this.gender = gender;
        this.activity = activity;
        this.birthday = birthday;
        this.hunger = hunger;
        this.stamina = stamina;
        this.happy = happy;
    }

    increaseAge() {
        this.age++
        console.log(`Happy birthday to ${this.name}, ${this.name} is now ${this.age}`)

    }

    eat() {
        console.log(`${this.name} is eating`)
        this.activity = 'Eating'
        this.hunger = 100;
    }

    sleep() {
        console.log(`${this.name} is sleeping`)
        this.activity = 'Sleeping'
        this.stamina = 100;
    }

    play() {
        console.log(`${this.name} is playing`)
        this.activity = 'Playing'
        this.happy = 100;
    }

    sayHi() {
        console.log("This animal made noise")
    }

}

// Here we create Tony the tiger. As time ticks by, we want certain properties to decrease in value and based on the stats of those properties
// we want Tony to perform certain activities such as eating, sleeping, or playing. We will apply this 
// let tiger = new Animal("Tony", 20, "Tiger", "Male", "Eating", 75, 80, 90)
// let hungerIncrementer = setInterval(
//     function () {
//         tiger.stamina--
//         tiger.hunger--
//         tiger.happy--
//         if (tiger.stamina < 25) {
//             tiger.sleep()
//         } else if (tiger.hunger < 50) {
//             tiger.eat()
//         } else if (tiger.happy < 75) {
//             tiger.play()
//         }
//         console.log(tiger)
//     }, 1000)

// console.log(hungerIncrementer)

export default Animal;