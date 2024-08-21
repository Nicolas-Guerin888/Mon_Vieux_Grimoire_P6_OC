const express = require('express')
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp-converter')
const cleanupImages = require('../middleware/cleanup')

const router = express.Router()

router.get('/bestrating', bookCtrl.getBestRating)
router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, multer, sharp, cleanupImages, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.createRating)
router.put('/:id', auth, multer, sharp, cleanupImages, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)


module.exports = router