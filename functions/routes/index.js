const { Router } = require('express');
const decklists = require('./decklists');
const leagues = require('./leagues');

const router = new Router();

router.use('/decklists', decklists);
router.use('/leagues', leagues);

module.exports = router;
