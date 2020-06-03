const { Router } = require('express');
const decklists = require('./decklists');
const events = require('./events');
const leagues = require('./leagues');
const results = require('./results');

const router = new Router();

router.use('/decklists', decklists);
router.use('/events', events);
router.use('/leagues', leagues);
router.use('/results', results);

module.exports = router;
