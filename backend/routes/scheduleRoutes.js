const express = require('express');
const fcfsController = require('../controllers/fcfsController');
const sjfController = require('../controllers/sjfController');
const priorityController = require('../controllers/priorityController');
const rrController = require('../controllers/rrController');

const router = express.Router();

// CPU Scheduling Algorithm Routes
router.post('/fcfs', fcfsController.calculateFCFS);
router.post('/sjf', sjfController.calculateSJF);
router.post('/priority', priorityController.calculatePriority);
router.post('/rr', rrController.calculateRoundRobin);

module.exports = router;

