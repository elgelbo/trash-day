// FOUNDATION
const express = require('express');
const router = express.Router();
// CONTROLLERS
const pageControl = require('../controllers/pageControl');
const apiControl = require('../controllers/apiControl');
const updateControl = require('../controllers/updateControl');
const messageControl = require('../controllers/messageControl');
// ERR HANDLER
const { catchErrors } = require('../handlers/errorHandlers')
// RENDERS
router.get('/', catchErrors(updateControl.check), pageControl.home);
router.get('/message', catchErrors(updateControl.check), catchErrors(messageControl.checkWindow), pageControl.message);
router.get('/update', catchErrors(updateControl.update), pageControl.update);
// API
router.get('/api/current', catchErrors(updateControl.check), apiControl.current);
// EXPORT
module.exports = router;