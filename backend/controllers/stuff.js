const Thing = require('../models/Thing')
const fs = require('fs') // Importation du module fs pour gérer les fichiers

/* const mongoose = require('mongoose');
const id = new mongoose.Types.ObjectId();
console.log(id); // Cela générera un nouvel ObjectId */



// Requête GET qui récupère toute la liste de Things
exports.getAllStuff = (req, res, next) => {
    console.log('Requête GET ALL reçue !')
    Thing.find() // Recherche de tous les objets Thing dans la base de données
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))
}

// Requête GET qui récupère un Thing spécifique
exports.getOneThing = (req, res, next) => {
    console.log('Requête GET ONE reçue !')
    Thing.findOne({ _id: req.params.id }) // Recherche d'un objet Thing par son ID
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }))
}

// Requête POST qui enregistre les Things dans la base de données
exports.createThing = (req, res, next) => {
    console.log('Requête POST reçue !')
    delete thingObjet._id // Suppression de l'ID de l'objet pour éviter les conflits
    delete thingObjet._userId // Suppression de l'ID utilisateur pour évitier les conflits
    const thing = new Thing({
        ...thingObjet, // Copie des propriétés de thingObjet
        userId: req.auth.userId, // Ajout de l'ID utilisateur à partir de l'authentification
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génération de l'URL de l'image
    })
    thing.save() // Sauvegarde de l'objet dans la base de données
        .then(() => { res.status(201).json({ message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json({ error })})
}

// Requête PUT pour mettre à jour un Thing existant
exports.modifyThing = (req, res, next) => {
    console.log('Requête PUT reçue !')
    const thingObjet = req.file ? {
        ...JSON.parse(req.body.thing), // Si un fichier est présent, parse le corps de la requête
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Gérération de l'URL de l'image
    } : { ...req.body } // Sinon, copie simplement le corps de la requête
    
    delete thingObjet._userId // Suppression de l'ID utilisateur pour éviter les conflits
    Thing.findOne({_id: req.params.id}) // Recherche de l'objet Thing par son ID
        .then((thing) => {
            if (thing.userId != req.auth.userId) { // Vérification de l'ID utilisateur
                res.status(401).json({ message : 'Not authorized'})
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) // Mise à jour de l'objet
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }))
            }
        })
        .catch ((error) => { 
            res.status(400).json({ error })
        })
    }        

// Requête DELETE pour supprimer un Thing
exports.deleteThing = (req, res, next) => {
    console.log('Requête DELETE reçue !')
    Thing.findOne({ _id: req.params.id}) // Recherche de l'objet Thing par son ID
        .then(thing => {
            if (thing.userId != req.auth.userId) { // Vérification de l'ID utilisateur
                res.status(401).json({message: 'Not Authorized'})
            } else {
                const filename = thing.imageUrl.split('/images/')[1] // Extraction du nom de fichier de l'URL de l'image
                fs.unlink(`images/${filename}`, () => { // Suppression du fichier image
                    Thing.deleteOne({ _id: req.params.id }) // Suppression de l'objet de la base de données
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }))            
                })
            }   
        })
    }