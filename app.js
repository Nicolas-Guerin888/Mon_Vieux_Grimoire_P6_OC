const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb+srv://NicolasAdminTest:<kmxpSg8KaR9FYD2G>@cluster0.takpkux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(() => console.log('Connection à MongoDB réussie !'))
        .catch(() => console.log('Connection à MongoDB échouée !'))
    


// Permet d'extraire le body Json des requêtes POST provenant du Front-End
// Il prend toutes les requêtes qui ton comme content-Type application/json
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
  })

app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body)
    res.status(201).json({
        message: 'Objet créé !'
    })
} )


module.exports = app