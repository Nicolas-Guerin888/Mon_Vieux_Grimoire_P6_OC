const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour les utilisateurs "User"
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Email requis et unique
    password: { type: String, required: true } // Mot de passe requis
});

// Application du plugin pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

// Exportation du modèle "User" basé sur le schéma
module.exports = mongoose.model('User', userSchema);
