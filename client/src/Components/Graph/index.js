import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const countPopulation = (arr) => {

    // Must figure out a way to create an object with keys from the arr

    let colors = ['blue', 'red', 'green', 'yellow', 'pink', 'purple']

    let objData = [];

    // Here we go through the arr
    for (let j = 0; j < arr.length; j++) {
        // Create a key/value pair if it doesn't already exist in the object
        if (!objData[arr[j].species]) {
            objData[arr[j].species] = {
                species: arr[j].species,
                count: 1
            }
        } else {
            objData[arr[j].species].count += 1
        }
    }

    let popData = Object.values(objData)
    console.log(popData)
    let data = {
        labels: popData.map(elm => elm.species),
        datasets: [{
            // Should include numbers here based off the order of the arr
            data: popData.map(elm => elm.count),
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    }

    console.log(data)
    return data
}

class Graph extends React.Component {
    state = {
        popData: ''
    }

    // Here we should set data for many things
    componentDidMount() {

        let { animals } = this.props
        let popData = countPopulation(animals)
        console.log(popData)
        this.setState({
            popData
        })
    }

    render() {

        let style1 = {
            backgroundColor: '#2f4f4f',
            border: '7px solid rgb(57,58,59)'
        }

        return (
            <div style={style1} className='col-xl-6'>
                {this.state.popData ?
                    <div>
                        <h2>Graph</h2>
                        <Doughnut
                            data={this.state.popData}
                        />
                    </div>
                    : ''}

            </div>
        )
    }
}

export default Graph;