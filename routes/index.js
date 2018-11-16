const express = require('express');
const router = express.Router();
const pageControl = require('../controllers/pageControl');
const updateControl = require('../controllers/updateControl');

const { catchErrors } = require('../handlers/errorHandlers')

// GLOBAL
router.get('/', catchErrors(updateControl.check), pageControl.home);
// router.get('/message', catchErrors());
router.get('/update', catchErrors(updateControl.update), pageControl.update);

module.exports = router;