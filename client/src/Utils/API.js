import axios from 'axios'

export default {

    getAnimals: function () {
        return axios.get('/api')
    },

    getSpecies: function (species) {
        return axios.get("/api/" + species)
    },

    addAnimal: function (data) {
        return axios.post('/api', data)
    },

    editAnimal: function (data) {
        return axios.put("/api/" + data.id)
    },

    deleteAnimal: function (id) {
        return axios.delete("/api/" + id)
    },

    // Manipulate Animal Activities

    increaseAnimalAge: function () {
        return axios.put("/api/increaseAge")
    }

}