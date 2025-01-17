import dotenv from 'dotenv'
import * as functions from 'firebase-functions'

dotenv.config()

const config = {
  serviceAccount: process.env.serviceAccount,
  databaseURL: process.env.databaseURL,
  environment: process.env.NODE_ENV,
  secret: process.env.SECRET || functions.config()?.discord?.secret,
  token: process.env.TOKEN || functions.config()?.discord?.token,
  guild: process.env.GUILD || functions.config()?.discord?.guild,
}

export default config
