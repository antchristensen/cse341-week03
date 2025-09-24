const router = require('express').Router();
const ctrl = require('../controllers/brands');
const asyncHandler = require('../utils/asyncHandler');
const validateObjectId = require('../middleware/validateObjectId');
const { brandSchema, validateBody } = require('../validators/brands');
const requireAuth = require('../middleware/requireAuth'); 

// READ 
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', validateObjectId, asyncHandler(ctrl.get));

// CREATE 
router.post('/', requireAuth, validateBody(brandSchema), asyncHandler(ctrl.create));

// UPDATE 
router.put('/:id', requireAuth, validateObjectId, validateBody(brandSchema), asyncHandler(ctrl.update));

// DELETE 
router.delete('/:id', requireAuth, validateObjectId, asyncHandler(ctrl.remove));

module.exports = router;
