const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const convertToWebp = (req, res, next) => {
    if (!req.file) {
        return next(); // Passer au middleware suivant si aucun fichier n'est présent
    }

    const filepath = req.file.path
    const filenameWithoutExt = path.parse(req.file.filename).name // Nom du fichier sans extension
    const outputFilePath = path.join('images', `${filenameWithoutExt}.webp`)

    // Conversion de l'image en WebP
    sharp(filepath)
        .webp({ quality: 80 }) // Qualité de l'image WebP (0-100)
        .resize(463, 595) // Redimensionne l'image en 463x595px
        .toFile(outputFilePath)
        .then(() => {
            // Mise à jour des informations du fichier dans req.file
            req.file.filename = `${filenameWithoutExt}.webp`
            req.file.path = outputFilePath
            req.file.mimetype = 'image/webp'
            next()// Passer au middleware suivant ou à la réponse
        })
        .catch(err => {
            console.error('Erreur lors de la conversion en WebP :', err.message)
            next(err) // Passer l'erreur au middleware suivant
        })
}

module.exports = convertToWebp
