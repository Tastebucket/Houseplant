const mongoose = require('./connection')
const Plant = require('./plant')
const axios = require("axios");
require('dotenv').config()

const db = mongoose.connection


/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////

db.on('open', () => {
    const startPlants = []
    /// Delete plants in the database
    Plant.deleteMany({})
        .then(() => {
            const options = {
                method: 'GET',
                url: `${process.env.API_URL_ALL}`,
                headers: {
                  'X-RapidAPI-Key': `${process.env.API_KEY}`,
                  'X-RapidAPI-Host': `${process.env.API_HOST}`
                }
            }
            // request plant list from API
            axios.request(options).then(function (response) {
                console.log(response.data[1])
                for (i=0; i<response.data.length; i++){
                    startPlants[i]=
                    { name : `${response.data[i]['Common name']}`,
                      water : `${response.data[i]['Watering']}`,
                      light : `${response.data[i]['Light tolered']}`,
                      category : `${response.data[i]['Categories']}`,
                      apiId : `${response.data[i]['id']}`,
                      scientificName: `${response.data[i]['Latin name']}`,
                      imageLink : `${response.data[i]['Img']}`
                    }
                    if (startPlants[i].name === 'null'){
                        startPlants[i].name = `${response.data[i]['Latin name']}`
                    } else {startPlants[i].name = `${response.data[i]['Common name'][0]}`}
                }
                // Save plant list to db
                Plant.create(startPlants)
                .then(data => {
                    console.log('here are the created plants: \n', data)
                    // close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // close the connection
                    db.close()
                })
                }).catch(function (error) {
                console.error(error)
            })
            
        })
        .catch(err => {
            console.log(err)
            // close the connection
            db.close()
        })
})

