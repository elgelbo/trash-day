const express = require('express');
const router = express.Router();
const pageControl = require('../controllers/pageControl');

const { catchErrors } = require('../handlers/errorHandlers')

// GLOBAL
router.get('/', catchErrors(pageControl.check), pageControl.homePage);
router.get('/message', catchErrors(pageControl.check), catchErrors(pageControl.message));
router.get('/update', catchErrors(pageControl.update));

module.exports = router;