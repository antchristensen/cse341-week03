const router = require('express').Router();
const ctrl = require('../controllers/bikes');
const asyncHandler = require('../utils/asyncHandler');
const validateObjectId = require('../middleware/validateObjectId');
const { bikeSchema, validateBody } = require('../validators/bikes');

// READ (all + one)
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', validateObjectId, asyncHandler(ctrl.get));

// CREATE
router.post('/', validateBody(bikeSchema), asyncHandler(ctrl.create));

// UPDATE
router.put('/:id', validateObjectId, validateBody(bikeSchema), asyncHandler(ctrl.update));

// DELETE
router.delete('/:id', validateObjectId, asyncHandler(ctrl.remove));

module.exports = router;
