const router = require('express').Router();
const ctrl = require('../controllers/bikes');
const asyncHandler = require('../utils/asyncHandler');
const validateObjectId = require('../middleware/validateObjectId');
const { bikeSchema, validateBody } = require('../validators/bikes');

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', validateObjectId, asyncHandler(ctrl.get));
router.post('/', validateBody(bikeSchema), asyncHandler(ctrl.create));
router.put('/:id', validateObjectId, validateBody(bikeSchema), asyncHandler(ctrl.update));
router.delete('/:id', validateObjectId, asyncHandler(ctrl.remove));

module.exports = router;
