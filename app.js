const express = require('express')
const mongoose = require('mongoose')
const app = express()

const User = require('./models/user')
const Book = require('./models/book')

mongoose.connect('mongodb+srv://NicolasAdminTest:kmxpSg8KaR9FYD2G@cluster0.takpkux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'))
    


// Permet d'extraire le body Json des requêtes POST provenant du Front-End
// Il prend toutes les requêtes comme content-Type application/json
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
  })

app.post('/api/auth/signup', (req, res, next) => {
    const user = new User({
        ...req.body
    })
    user.save()
        .then(() => res.status(201).json({ message: 'Nouvel utilisateur enregistré !'}))
        .catch(error => res.status(400).json({error}))
})

app.post('/api/auth/login', (req, res, next) => {
    const user = new User({
        ...req.body
    })
    user.save()
    .then(() => res.status(201).json({ message: 'Nouvel utilisateur enregistré !'}))
    .catch(error => res.status(400).json({error}))
})

app.post('/api/books', (req, res, next) => {
    const book = new Book({
        ...req.body
    })
    book.save()
        .then(() => res.status(201).json({ message: 'Book enregistré !'}))
        .catch(error => res.status(400).json({error}))
})

/*app.post('/api/books/:id/rating', (req, res, next) => {
    const book = new Book({
        ...req.body
    })
    book.save()
        .then(() => res.status(201).json({ message: 'Book enregistré !'}))
        .catch(error => res.status(400).json({error}))
})*/

app.get('/api/books', (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
})

app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({error}))
})

app.get('/api/books/bestrating', (req, res, next) => {

})

app.put('/api/books/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Book modifié !'}))
        .catch(error => res.status(400).json({error}))
})

app.delete('/api/books/:id', (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book supprimé !'}))
        .catch(error => res.status(400).json({error}))
})


module.exports = app