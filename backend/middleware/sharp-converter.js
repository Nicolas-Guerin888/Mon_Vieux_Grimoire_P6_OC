const sharp = require('sharp');
const path = require('path');

const convertToWebp = (req, res, next) => {
    if (!req.file) {
        return next(); // Passer au middleware suivant si aucun fichier n'est présent
    }
    const filepath = req.file.path
    const filename = req.file.filename
    // const inputFilePath = path.join(__dirname, '..', 'images', req.file.filename); // Chemin complet de l'image originale
    // const outputFilePath = inputFilePath.replace(/\.[^/.]+$/, ".webp"); // Remplace l'extension par .webp
    const outputFilePath1 = path.join('images', `${filename}.webp`)

    /*console.log('chemin d\'entrée:', inputFilePath)
    console.log('chemin de sortie:', outputFilePath)
    console.log('chemin absolu d\'entrée;', path.resolve(inputFilePath))
    console.log('chemin absolu de sortie:', path.resolve(outputFilePath))*/


    /*if (path.extname(inputFilePath) === '.webp') {
        console.log('Le fichier est déjà en format webp')
        return next()
    }*/
    
    // Conversion de l'image en WebP
    sharp(filepath)
        .webp({ quality: 80 }) // Qualité de l'image WebP (0-100)
        .resize (463, 595) // Redimensionne l'image en 463x595px
        .toFile(outputFilePath1)
        .then(() => {
            req.file.path = outputFilePath1
            // req.file.webpPath = outputFilePath // Mise à jour du nom de fichier dans req.file
                next() // Passer au middleware suivant ou à la réponse
        })
        .catch(err => {
            console.error('Erreur lors de la conversion en WebP :', err.message)
            next(err) // Passer l'erreur au middleware suivant
        })
}

module.exports = convertToWebp;
