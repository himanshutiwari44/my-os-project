const express = require('express');
const router = express.Router();
const fsController = require('../controllers/fsController');

router.get('/ls', fsController.list);
router.post('/mkdir', fsController.mkdir);
router.post('/touch', fsController.touch);
router.post('/rm', fsController.remove);
router.get('/pwd', fsController.pwd);
router.get('/tree', fsController.tree);

module.exports = router;
