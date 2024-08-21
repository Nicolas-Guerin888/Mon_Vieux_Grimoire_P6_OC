const jwt = require('jsonwebtoken') // Importation du module jsonwebtoken pour la gestion des tokens
require('dotenv').config()


module.exports = (req, res, next) => {
    try {
        // Extraction du token de l'en-tête d'autorisation
        const token = req.headers.authorization.split(' ')[1]

        // Vérification et décodage du token
        const decodedToken = jwt.verify(token, process.env.TOKEN_DECODING_JWT)

        // Extraction de l'ID utilisateur du token décodé
        const userId = decodedToken.userId

        // Ajout de l'ID utilisateur à l'objet req.auth pour utilisation ultérieure
        req.auth = {
            userId: userId
        }
    next()
    } catch(error) {
        res.status(401).json({ error })
    }
}