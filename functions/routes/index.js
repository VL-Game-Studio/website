const { Router } = require('express');
const decklists = require('./decklists');
const events = require('./events');
const leagues = require('./leagues');
const ml = require('./ml');
const sheets = require('./sheets');

const router = new Router();

router.use('/decklists', decklists);
router.use('/events', events);
router.use('/leagues', leagues);
router.use('/ml', ml);
router.use('/sheets', sheets);

module.exports = router;
