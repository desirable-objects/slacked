'use strict'

const routes = require('./routes')

const SlackPlugin = {
  register: (server, options, next) => {
    server.route(routes)
    next()
  }
}

SlackPlugin.register.attributes = {
  name: 'slack',
  version: '1.0.0'
}

module.exports = SlackPlugin
