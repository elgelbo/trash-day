const express = require('express');
const router = express.Router();
const pageControl = require('../controllers/pageControl');
const updateControl = require('../controllers/updateControl');
const messageControl = require('../controllers/messageControl');

const { catchErrors } = require('../handlers/errorHandlers')

// GLOBAL
router.get('/', catchErrors(updateControl.check), pageControl.home);
router.get('/message', catchErrors(updateControl.check), catchErrors(messageControl.checkWindow));
router.get('/update', catchErrors(updateControl.update), pageControl.update);
router.get('/test', catchErrors(updateControl.check), catchErrors(messageControl.testEmail));

module.exports = router;