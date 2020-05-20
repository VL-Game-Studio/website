const { Router } = require('express');
const decklists = require('./decklists');
const leagues = require('./leagues');
const players = require('./players');
const results = require('./results');
const events = require('./events');

const router = new Router();

router.use('/decklists', decklists);
router.use('/events', events);
router.use('/leagues', leagues);
router.use('/players', players);
router.use('/results', results);

module.exports = router;
