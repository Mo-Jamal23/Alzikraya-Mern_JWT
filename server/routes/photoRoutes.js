const router = require('express').Router();
const photoController = require('../controllers/photoController');
const { requireUser } = require('../middleware/auth');
const { validate, photoSchema } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.get('/', photoController.getAll);
router.get('/:id', photoController.getOne);
router.post('/', requireUser, upload.single('image'), validate(photoSchema), photoController.create);
router.delete('/:id', requireUser, photoController.remove);

module.exports = router;
