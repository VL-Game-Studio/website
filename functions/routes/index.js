const express = require('express');
const decklists = require('./decklists');
const events = require('./events');
const leagues = require('./leagues');
const ml = require('./ml');

const router = new express.Router();

router.use(express.static('docs'));
router.use('/decklists', decklists);
router.use('/events', events);
router.use('/leagues', leagues);
router.use('/ml', ml);
router.use((req, res) => res.status(404).json({ error: `A method does not exist for ${req.originalUrl}.` }));

module.exports = router;
