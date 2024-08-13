const express = require('express')
const stuffCtrl = require('../controllers/stuff')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const router = express.Router()

router.get('/', /*auth,*/ stuffCtrl.getAllStuff)
router.get('/:id', /*auth,*/ stuffCtrl.getOneThing)
router.post('/', auth, multer, stuffCtrl.createThing)
router.put('/:id', auth, multer, stuffCtrl.modifyThing)
router.delete('/:id', auth, stuffCtrl.deleteThing)


module.exports = router