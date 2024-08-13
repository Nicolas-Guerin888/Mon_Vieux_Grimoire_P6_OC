const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec 10 passages
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            })
            // Sauvegarde de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' }))
        })
        .catch(error => res.status(500).json({ error: 'Erreur de chiffrement du mot de passe' }))
}


// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur par email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Login et/ou mot de passe incorrecte'}) // Réponse si l'utilisateur n'est pas trouvé
            }
            // Comparaison du mot de passe fourni avec le mot de passe haché
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Login et/ou mot de passe incorrecte'}) // Réponse si le mot de passe est incorrect
                    }
                    // Réponse en cas de succès avec génération d'un token
                    res.status(200).json({
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id }, // Données à inclure dans le token
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour le chiffrement du token
                            { expiresIn: '24h'} // Durée de validité du token
                        )
                    })
                })
                .catch(error => res.status(500).json({ error: 'Erreur de comparaison des mots de passe' }))
        })
        .catch(error => res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur' }))
}