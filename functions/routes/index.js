const { Router } = require('express');
const auth = require('./auth');
const decklists = require('./decklists');
const leagues = require('./leagues');
const players = require('./players');

const router = new Router();

router.use('/auth', auth);
router.use('/decklists', decklists);
router.use('/leagues', leagues);
router.use('/players', players);

module.exports = router;
