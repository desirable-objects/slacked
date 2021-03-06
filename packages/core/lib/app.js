'use strict'

const Hapi = require('hapi')
const pluginLoader = require('./plugin-loader')

const ready = async () => {
  const server = new Hapi.Server()
  const conf = process.env.PORT ? { port: process.env.PORT } : null
  server.connection(conf)
  await server.register([
    require('./hapi-modules/slack')
  ])
  return server
}

const start = async () => {
  const server = await ready()
  await server.start()
  console.log(`Slacked running at: ${server.info.uri}`)
  pluginLoader.load()
  return server
}

module.exports = {
  ready,
  start
}
