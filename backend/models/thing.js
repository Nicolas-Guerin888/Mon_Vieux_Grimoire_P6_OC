const mongoose = require('mongoose');

// Définition du schéma pour les objets "Thing"
const thingSchema = mongoose.Schema({
    title: { type: String, required: true }, // Titre requis
    description: { type: String, required: true }, // Description requise
    imageUrl: { type: String, required: true }, // URL de l'image requise
    userId: { type: String, required: true }, // ID de l'utilisateur requis
    price: { type: Number, required: true } // Prix requis
});

// Exportation du modèle "Thing" basé sur le schéma
module.exports = mongoose.model('Thing', thingSchema);
