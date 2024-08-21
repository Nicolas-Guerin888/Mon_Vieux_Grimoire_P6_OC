const fs = require('fs')
const path = require('path')

const cleanupImages = (req, res, next) => {
    if (req.file && req.file.originalPath) {
        const fileToDelete = req.file.originalPath

        fs.unlink(fileToDelete, (err) => {
            if (err) {
                console.error(`Erreur lors de la suppression du fichier ${fileToDelete} :`, err)
            } else {
                console.log(`Fichier ${fileToDelete} supprimé avec succès.`)
            }
            next() // Passer au middleware suivant
        });
    } else {
        next() // Passer au middleware suivant si aucun fichier à supprimer
    }
};

module.exports = cleanupImages
