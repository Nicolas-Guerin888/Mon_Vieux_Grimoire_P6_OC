const express = require('express') // Importation de l'appli Express
const mongoose = require('mongoose') // Importation de Mongoose pour interagir avec MongoDB
const bookRoutes = require('./routes/book') // Importation des routes pour les objets "book"
const userRoutes = require('./routes/user') // Importation des routes pour les utilisateurs
const path = require('path') // Importation du module path pour gérer les chemins de fichiers

// Création de l'application Express
const app = express()


// Connexion à MongoDB
mongoose.connect('mongodb+srv://NicolasAdminTest:kmxpSg8KaR9FYD2G@cluster0.takpkux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') // URL MongoDB
    .then(() => console.log('Connexion à MongoDB réussie !')) // Message de succès si la connexion fonctionne
    .catch(() => console.log('Connexion à MongoDB échouée !')) // Message d'erreur si la connexion échoue

// Ce bloc de code évite les erreurs de CORS en permettant à deux serveurs différents de pouvoir communiquer.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // Permet à toutes les origines d'accéder à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') // Autorise certains en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS') // Autorise certaines méthodes HTTP
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Définition des routes
app.use('/api/books', bookRoutes) // Utilise les routes définies dans bookRoutes pour les requêtes vers /api/books
app.use('/api/auth', userRoutes) // Utilise les routes définies dans userRoutes pour les requêtes vers /api/auth

// Gestion des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images'))) // Sert les fichiers statiques du dossier images

// Exportation de l'application
module.exports = app // Exporte l'application pour pouvoir l'utiliser dans d'autres fichiers
