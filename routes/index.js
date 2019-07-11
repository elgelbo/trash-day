const express = require('express');
const router = express.Router();
// IMPORT CONTROLLERS
const pageControl = require('../controllers/pageControl');
const apiControl = require('../controllers/apiControl');
const updateControl = require('../controllers/updateControl');
const messageControl = require('../controllers/messageControl');
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(updateControl.check), pageControl.home);
router.get('/message', catchErrors(updateControl.check), catchErrors(messageControl.checkWindow));
router.get('/update', catchErrors(updateControl.update), pageControl.update);

router.get('/api/current', catchErrors(updateControl.check), apiControl.current);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const pageControl = require('../controllers/pageControl');
// const updateControl = require('../controllers/updateControl');
// const messageControl = require('../controllers/messageControl');

// const { catchErrors } = require('../handlers/errorHandlers')

// // GLOBAL
// router.get('/message', catchErrors(updateControl.check), catchErrors(messageControl.checkWindow));
// router.get('/update', catchErrors(updateControl.update), pageControl.update);
// router.get('/test', catchErrors(updateControl.check), catchErrors(messageControl.testEmail));

// module.exports = router;