const functions = require('firebase-functions');
const { Router } = require('express');
const { useFetch } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const authURI = `https://discordapp.com/api/oauth2/authorize?client_id=${functions.config().discord.id}&scope=identify&redirect_uri=${encodeURIComponent('https://videre.live/functions/auth/redirect')}&response_type=code`;
    return res.status(200).send(`<a href="${authURI}">Link your discord account</a>`);
  } catch (error) {
    console.error(`GET /auth >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while authorizing you via Discord.\n${error.stack}` });
  }
});

router.get('/redirect', async (req, res) => {
  const { code } = req.query;

  try {
    const auth = await useFetch('https://discordapp.com/api/oauth2/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DiscordBot',
      },
      client_id: functions.config().discord.id,
      client_secret: functions.config().discord.key,
      grant_type: 'authorization_code',
      redirect_uri: 'https://videre.live',
      code,
    });

    const user = await useFetch('https://discordapp.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${auth.access_token}`
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(`POST /auth >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while authorizing you via Discord.\n${error.message}` });
  }
});

module.exports = router;
