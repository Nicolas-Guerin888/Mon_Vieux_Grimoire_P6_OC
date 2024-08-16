const express = require('express')
const stuffCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp-converter')

const router = express.Router()

router.get('/', stuffCtrl.getAllBooks)
router.get('/:id', stuffCtrl.getOneBook)
/*router.get('/bestrating', stuffCtrl.getBestRating)*/
router.post('/', auth, multer, sharp, stuffCtrl.createBook)
/*router.post('/:id/rating', auth, multer, stuffCtrl.createRating)*/
router.put('/:id', auth, multer, sharp, stuffCtrl.modifyBook)
router.delete('/:id', auth, stuffCtrl.deleteBook)


module.exports = router