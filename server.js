// variable for the express module
const express = require('express')
// variable for the express app
const app = express()
// variable for MongoDB database
const MongoClient = require('mongodb').MongoClient
// variable for the database connection
const PORT = 2121
// required to hide the database password and username from the public 
require('dotenv').config()

// variables for the database connection and the database name in .env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// if the connection is successful, run this code
    .then(client => {
        // log that we are connected to the database
        console.log(`Connected to ${dbName} Database`)
        // save a reference to the database so you can use it later
        db = client.db(dbName)
    })

// set the view engine to ejs
app.set('view engine', 'ejs')
// make express look in the public directory for assets (css/js/img)
app.use(express.static('public'))
// make express look in the views directory for all ejs files
app.use(express.urlencoded({ extended: true }))
// tells server to use JSON
app.use(express.json())

// create a GET route for the homepage
app.get('/',async (request, response)=>{
    // get all the todo items from the database and put them in an array
    const todoItems = await db.collection('todos').find().toArray()
    // get the number of items in the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render the index.ejs template and pass it the todo
    response.render('index.ejs', { items: todoItems, left: itemsLeft })





    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// add a document to the database
app.post('/addTodo', (request, response) => {
    // insert one document into the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // then refresh the page
    .then(result => {
        // console.log('Todo has been added!')
        console.log('Todo Added')
        // refresh the page
        response.redirect('/')
    })
    // if there is an error, log it
    .catch(error => console.error(error))
})

// update a document in the database
app.put('/markComplete', (request, response) => {
    // update one document in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set the completed value to true
        $set: {
            completed: true
          }
    },{
        // sort the documents by the thing value
        sort: {_id: -1},
        // only update one document
        upsert: false
    })
    .then(result => {
        // console.log('Marked Complete')
        console.log('Marked Complete')
        // send the result back to the front end
        response.json('Marked Complete')
    })
    // if there is an error, log it
    .catch(error => console.error(error))
})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


// delete a document from the database
app.delete('/deleteItem', (request, response) => {
    // delete one document from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // then refresh the page
    .then(result => {
        // console.log('Deleted Todo')
        console.log('Todo Deleted')
        // refresh the page
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen for requests
app.listen(process.env.PORT || PORT, ()=>{
    // log the port number
    console.log(`Server running on port ${PORT}`)
})