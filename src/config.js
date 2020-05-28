const config = {
  clientID: "discordClientID",
  secret: "discordClientSecret",
  redirect: process.env.NODE_ENV === 'production' ? 'https://projectmodern.gg/auth' : 'http://localhost/auth'
};

export default config;
