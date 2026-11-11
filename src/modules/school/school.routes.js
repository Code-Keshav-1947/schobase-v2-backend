const router = require('express').Router();
const auth = require('../../middlewares/auth');
const roleBasedAccess = require('../../middlewares/roleBasedAccess');
const validate = require('../../middlewares/validate');
const controller = require('./school.controller');
const validation = require('./school.validation');

router.use(auth)

router.get('/',roleBasedAccess(['SCHOOL_ADMIN','ADMIN']))

module.exports = router;