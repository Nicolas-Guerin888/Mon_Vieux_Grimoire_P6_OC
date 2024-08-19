const Book = require('../models/Book')
const fs = require('fs') // Importation du module fs pour gérer les fichiers

/* const mongoose = require('mongoose');
const id = new mongoose.Types.ObjectId();
console.log(id); // Cela générera un nouvel ObjectId */


// Requête GET qui récupère toute la liste de Books
exports.getAllBooks = (req, res, next) => {
    console.log('Requête GET ALL reçue !')
    Book.find() // Recherche de tous les objets Book dans la base de données
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

// Requête GET qui récupère un Book spécifique
exports.getOneBook = (req, res, next) => {
    console.log('Requête GET ONE reçue !')
    Book.findOne({ _id: req.params.id }) // Recherche d'un objet Book par son ID
        .then(book => res.status(200).json(book))
        .catch(error => {
            console.log(error)
            res.status(404).json({ error })
})}

// Requête GET qui récupère un tableau des 3 livres ayant la meilleur note moyenne
exports.getBestRating = (req, res, next) => {
    console.log('Requête GET Best Rating reçue !')

    Book.find().sort({ averageRating: -1}).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

// Requête POST qui enregistre les Books dans la base de données
exports.createBook = (req, res, next) => {
    console.log('Requête POST Book reçue !')
    const bookObject = JSON.parse(req.body.book) // Parser la chaine JSON
    console.log(req.body.book)
    delete bookObject._id // Suppression de l'ID de l'objet pour éviter les conflits
    delete bookObject._userId // Suppression de l'ID utilisateur pour éviter les conflits
    const book = new Book ({
        ...bookObject, // Copie des propriétés de bookObjet
        userId: req.auth.userId, // Ajout de l'ID utilisateur à partir de l'authentification
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génération de l'URL de l'image
    })
    book.save() // Sauvegarde de l'objet dans la base de données
        .then(() => { res.status(201).json({ message: 'Book enregistré !'})})
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })})
}

exports.createRating = (req, res, next) => {
    console.log('Requête POST Rating reçue !')
    const { userId, grade } = req.body
    Book.findOne({ _id: req.params.id }) // Recherche d'un Book par son ID
        .then(book => {
            if(!book) {
                return res.status(404).json({ message: 'Livre non trouvé !' })
            }
            const existingRating = book.rating.find(r => r.userId === userId) // Vérification si l'utilisateur a déjà noté ce livre
            if (existingRating) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre !'})
            }
            book.rating.push({ userId, grade }) // Ajout de la nouvelle note
            const totalRatings = book.rating.length // Calcul de la nouvelle note moyenne
            const sumRatings = book.rating.reduce((sum, r) => sum + r.grade, 0)
            book.averageRating = sumRatings / totalRatings

            book.save()
                .then(() => res.status(201).json({ message: 'Note ajoutée avec succès !'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

// Requête PUT pour mettre à jour un Book existant
exports.modifyBook = (req, res, next) => {
    console.log('Requête PUT reçue !');
    
    // Créer l'objet de mise à jour avec ou sans nouvelle image
    const bookObjet = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObjet._userId; // Suppression de l'ID utilisateur pour éviter les conflits

    // Trouver le livre à modifier
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) { // Vérification de l'ID utilisateur
                res.status(401).json({ message: 'Non autorisé !' })
            } else {
                if (req.file) { // Si une nouvelle image est fournie
                    const oldFilename = book.imageUrl.split('/images/')[1] // Récupérer le nom de l'ancienne image
                    fs.unlink(`images/${oldFilename}`, (err) => { // Supprimer l'ancienne image
                        if (err) console.log(err)
                    })
                }
                
                // Mettre à jour le livre avec les nouvelles données
                Book.updateOne({ _id: req.params.id }, { ...bookObjet, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Book modifié !' }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

// Requête DELETE pour supprimer un Book
exports.deleteBook = (req, res, next) => {
    console.log('Requête DELETE reçue !')
    Book.findOne({ _id: req.params.id}) // Recherche de l'objet Book par son ID
        .then(book => {
            if (book.userId != req.auth.userId) { // Vérification de l'ID utilisateur
                res.status(401).json({message: 'Non autorisé !'})
            } else {
                const filename = book.imageUrl.split('/images/')[1] // Extraction du nom de fichier de l'URL de l'image
                fs.unlink(`images/${filename}`, () => { // Suppression du fichier image
                    Book.deleteOne({ _id: req.params.id }) // Suppression de l'objet Book de la base de données
                    .then(() => res.status(200).json({ message: 'Book supprimé !'}))
                    .catch(error => res.status(400).json({ error }))            
                })
            }   
        })
    }