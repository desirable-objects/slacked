'use strict'

const pluginLoader = require('../plugin-loader')

let commands

function list () {
  commands = commands || pluginLoader.load()
  return Object.keys(commands)
}

function respond (command, who, responseUrl, text) {
  return commands[command].exec(who, text, responseUrl)
}

module.exports = {
  list,
  respond
}
