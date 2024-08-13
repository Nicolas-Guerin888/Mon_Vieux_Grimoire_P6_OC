const http = require('http') // Importation du package HTTP de Node.js
const app = require('./app') // Importation de l'application Express

// Cette fonction renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10) // Convertit la valeur en un entier

    if (isNaN(port)) { // Vérifie si la valeur n'est pas un nombre
        return val // Renvoie la valeur telle quelle
    }
    if (port >= 0) { // Vérifie si le port est un nombre positif
        return port // Renvoie le port
    }
    return false // Renvoie false si aucune des conditions n'est remplie
}

const port = normalizePort(process.env.PORT || '4000') // Définit le port à partir de la variable d'environnement ou utilise 4000 par défaut
app.set('port', port) // Définit le port pour l'application Express

// Cette fonction recherche et gère différentes erreurs de connexion
const errorHandler = error => {
    if (error.syscall !== 'listen') { // Vérifie si l'erreur n'est pas liée à l'écoute du serveur
        throw error // Lance l'erreur
    }
    const address = server.address() // Récupère l'adresse du serveur
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port // Définit le type de liaison (pipe ou port)
    switch (error.code) { // Gère les différents codes d'erreur
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.') // Affiche une erreur si des privilèges élevés sont requis
            process.exit(1) // Quitte le processus avec un code d'erreur
            break
        case 'EADDRINUSE': 
            console.error(bind + ' is already in use.') // Affiche une erreur si le port est déjà utilisé
            process.exit(1) // Quitte le processus avec un code d'erreur
            break
        default:
            throw error // Lance l'erreur pour les autres cas
    }
}

// Crée un serveur HTTP et gère les requêtes entrantes avec Express (app)
const server = http.createServer(app)

server.on('error', errorHandler) // Écoute les erreurs du serveur et appelle errorHandler
server.on('listening', () => { // Écoute l'événement 'listening' du serveur
    const address = server.address() // Récupère l'adresse du serveur
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port // Définit le type de liaison (pipe ou port)
    console.log('Listening on ' + bind) // Affiche un message indiquant que le serveur écoute
})

server.listen(port) // Le serveur écoute sur le port défini
