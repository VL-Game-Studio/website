const { Router } = require('express');
const auth = require('./auth');
const decklists = require('./decklists');
const leagues = require('./leagues');
const users = require('./users');

const router = new Router();

router.use('/auth', auth);
router.use('/decklists', decklists);
router.use('/leagues', leagues);
router.use('/users', users);

module.exports = router;
