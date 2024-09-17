const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { pipeline } = require('stream')
const util = require('util')

const streamPipeline = util.promisify(pipeline)

const convertToWebp = async (req, res, next) => {
    if (!req.file) {
        return next() // Passer au middleware suivant si aucun fichier n'est présent
    }

    const filepath = req.file.path
    const filenameWithoutExt = path.parse(req.file.filename).name; // Nom du fichier sans extension
    const outputFilePath = path.join('images', `${filenameWithoutExt}.webp`)

    try {
        // Conversion de l'image en WebP en utilisant les flux
        await streamPipeline(
            fs.createReadStream(filepath),
            sharp().webp({ quality: 80 }).resize(463, 595),
            fs.createWriteStream(outputFilePath)
        )

        // Mise à jour des informations du fichier dans req.file
        req.file.filename = `${filenameWithoutExt}.webp`
        req.file.path = outputFilePath
        req.file.mimetype = 'image/webp'

        // Suppression du fichier d'origine
        fs.unlink(filepath, (err) => {
            if (err) {
                console.error(`Erreur dans la suppression du fichier d'origine: ${err}`)
            } 
            next() // Passer au middleware suivant ou à la réponse
        })
    } catch (err) {
        next(err) // Passer l'erreur au middleware suivant
    }
}

module.exports = convertToWebp
