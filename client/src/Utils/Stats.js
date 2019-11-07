
export default {
    average: function (arr) {
        let sum = 0;
        for (let i of arr) {
            sum += i.age;
        }
        let num = (sum / arr.length).toFixed(2)
        return num

    },

    findRatio: function (arr) {
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
}

