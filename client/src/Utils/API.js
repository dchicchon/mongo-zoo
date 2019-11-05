import axios from 'axios'

export default {

    // TIME
    getTime: function () {
        return axios.get("/api/time")
    },

    createTime: function (timeData) {
        return axios.post("/api/time", timeData)
    },

    updateTime: function (timeData) {
        return axios.put("/api/time", timeData)
    },

    // Initial

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