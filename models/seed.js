
const mongoose = require('./connection')
const Plant = require('./plant')
/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(plants)
    const startPlants = [
        { name: 'Monstera' },
        { name: 'Parlor Palm' },
        { name: 'Dracaena' },
        { name: 'Aloe Vera' },
        { name: 'Ficus' }
    ]
    // then we delete every plant in the database(all instances of this resource)
    Plant.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter plants
            Plant.create(startPlants)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created plants: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})