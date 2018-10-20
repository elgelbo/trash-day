const express = require('express');
const router = express.Router();
const pageControl = require('../controllers/pageControl');

const { catchErrors } = require('../handlers/errorHandlers')

// GLOBAL
router.get('/',  pageControl.homePage);

module.exports = router;
