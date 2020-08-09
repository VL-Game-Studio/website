import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routes from './routes'
import config from './config'

export const server = express()

if (config.environment !== 'production') {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(config.serviceAccount || '{}')),
    databaseURL: config.databaseURL,
  })
} else {
  admin.initializeApp()
}

server.use(helmet())
server.use(express.json())
server.use(cors())

if (config.environment === 'test') {
  server.use(routes)
} else {
  server.use('/functions', routes)
}

if (config.environment === 'development') {
  console.info('Listening on port 8080.')
  server.listen(8080)
}

export const app = functions.https.onRequest(server)
