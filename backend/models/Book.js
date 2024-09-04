const mongoose = require('mongoose')

// Définition du schéma pour les objets "Book"
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, // ID de l'utilisateur requis
    title: { type: String, required: true }, // Titre requis
    author: { type: String, required: true }, // Nom de l'auteur requise
    imageUrl: { type: String, required: true }, // URL de l'image requise
    year: { type: Number, required: true }, // Année de publication requise
    genre: { type: String, required:true}, // Genre du livre requis
    ratings : [
        {
            userId: { type:String, required: true},
            grade: {type: Number, required: true} // Note donnée à un livre
        }
    ],
    averageRating: { type: Number, default: 0 } // Note moyenne du livre
})

// Exportation du modèle "Book" basé sur le schéma
module.exports = mongoose.model('Book', bookSchema)
