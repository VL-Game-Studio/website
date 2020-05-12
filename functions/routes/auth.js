const cors = require('cors');
const functions = require('firebase-functions');
const { Router } = require('express');

const router = new Router();

router.use(cors({ origin: 'https://videre.live' }));

const clientID = functions.config().discord.id;
const clientSecret = functions.config().discord.key;
const redirect = encodeURIComponent('https://videre.live');

router.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      clientID,
      clientSecret,
      redirect,
    });
  } catch (error) {
    console.error(`GET /auth >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching Discord credentials.\n${error.stack}` });
  }
});

module.exports = router;

/*
  const auth = await useFetch('https://discordapp.com/api/oauth2/token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
*/
