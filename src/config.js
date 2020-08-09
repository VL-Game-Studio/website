const base = {
  organizedPlay: process.env.REACT_APP_ORGANIZED_PLAY,
  clientID: process.env.REACT_APP_CLIENTID,
  guild: process.env.REACT_APP_GUILD,
  redirect: process.env.NODE_ENV === 'production' ? 'https://projectmodern.gg/auth' : 'http://localhost/auth',
  secret: process.env.REACT_APP_SECRET,
};

const config = {
  ...base,
  authURL: `https://discord.com/api/oauth2/authorize?client_id=${base.clientID}&redirect_uri=${encodeURIComponent(base.redirect)}&response_type=code&scope=identify%20guilds.join`,
};

export default config;
