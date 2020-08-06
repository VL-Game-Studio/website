const base = {
  admins: JSON.parse(process.env.REACT_APP_ADMINS || '[]'),
  clientID: process.env.REACT_APP_CLIENTID,
  guild: process.env.REACT_APP_GUILD,
  redirect: process.env.NODE_ENV === 'production' ? 'https://projectmodern.gg/auth' : 'http://localhost/auth',
  secret: process.env.REACT_APP_SECRET,
};

const config = {
  ...base,
  authURL: `https://discord.com/api/oauth2/authorize?client_id=${base.clientID}&redirect_uri=${encodeURIComponent(base.redirect)}&response_type=code&scope=identify`,
};

export default config;
