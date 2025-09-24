const router = require('express').Router();
const ctrl = require('../controllers/bikes');
const asyncHandler = require('../utils/asyncHandler');
const validateObjectId = require('../middleware/validateObjectId');
const { bikeSchema, validateBody } = require('../validators/bikes');
const requireAuth = require('../middleware/requireAuth'); 

// READ 
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', validateObjectId, asyncHandler(ctrl.get));

// CREATE 
router.post('/', requireAuth, validateBody(bikeSchema), asyncHandler(ctrl.create));

// UPDATE 
router.put('/:id', requireAuth, validateObjectId, validateBody(bikeSchema), asyncHandler(ctrl.update));

// DELETE 
router.delete('/:id', requireAuth, validateObjectId, asyncHandler(ctrl.remove));

module.exports = router;
