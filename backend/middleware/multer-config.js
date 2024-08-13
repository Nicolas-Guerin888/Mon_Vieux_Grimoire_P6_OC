const multer = require('multer') // Importation du module multer pour la gestion des fichiers

// Définition des types MIME et des extensions de fichiers correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg', 
    'image/png': 'png'
}

// Configuration du stockage pour multer
const storage = multer.diskStorage({
    // Définition du dossier de destination pour les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images') // Enregistre les fichiers dans le dossier 'images'
    },
    // Définition du nom de fichier 
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_') // Remplace les espaces par des underscores dans le nom de fichier originial
        const extension = MIME_TYPES[file.mimetype]         // Récupère l'extension de fichier correspondante au type MIME 
        callback(null, name + Date.now() + '.' + extension) // Ajoute un timestamp au nom de fichier pour le rendre unique
    }
})

// Exportation du middle multer configuré pour gérer un seul fichier nommé 'image'
module.exports = multer({storage: storage}).single('image')