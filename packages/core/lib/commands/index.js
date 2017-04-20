'use strict'

const pluginLoader = require('../plugin-loader')

let commands

function init () {
  commands = pluginLoader.load()
}

function list () {
  if (!commands) { init() }
  return Object.keys(commands)
}

function respond (command, who, responseUrl, text) {
  if (!commands) { init() }
  return commands[command].exec(who, text, responseUrl)
}

module.exports = {
  list,
  respond
}
