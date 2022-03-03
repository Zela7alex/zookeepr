//1st) require the module
const express = require('express')

// Telling app to use this specific port
const PORT = process.env.PORT || 3001

//2nd) instantiate the server (app = the server)
const app = express()

//3rd) Chain the listen method to server so that it makes the server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`) // Port is the new const PORT for heroku
});

//4th)--- Let add to the server so it can return data to requests----
//4th) START by requiring the data
const { animals } = require('./data/animals')

//6th) This ***FUNCTION will take in req.query as an argument and filter through the animals accordingly.
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [] // Gives the possibility for multiple trait searches
    let filteredResults = animalsArray

    if (query.personalityTraits) {
        //Save personalityTraits as an array.
        //If personality traits is a string, place it into a new array and save.>>
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits]
        } else {
            personalityTraitsArray = [query.personalityTraits]
        }

        // Looping through each trait in the personalityTraits array: Eachh iteration revises filtered results so that it only contains animals that posses the indicated trait.
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1
            )
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults
};
//7th) This *** Function takes in the id and array of animals and returns a single animal object.
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result
};

//5th) Add the route that the client will have to fetch from to gett animals. 
app.get('/api/animals', (req, res) => {
    let results = animals
    if (req.query) {
        results = filterByQuery(req.query, results)// Accessing the query object on req and calling tje filterByQuery() function
    }
    res.json(results)
});

//6th) Add the route to be able to get a specific animal.(REMEMBER param routes must come after )
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals)
    if (result) {
        res.json(result)
    } else {
        res.send(404) // Sends 404 error if resource "animal" could not be found 
    }
});
