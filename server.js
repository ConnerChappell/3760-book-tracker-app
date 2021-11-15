const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { mongoURI, port } = require('./config')
const Book = require('./models/Book')
const app = express()

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected Successfully')
    app.listen(port, () => {
        console.log(`Server is running and happy on port ${port}`)
    })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(express.static('public'))

// GET wishlist


// GET completed list


// POST wishlist


// POST completed list
