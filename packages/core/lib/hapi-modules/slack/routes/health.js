'use strict'

module.exports = [{
  method: 'get',
  path: '/health',
  config: {
    auth: false
  },
  handler: (request, reply) => {
    return reply('Healthy')
  }
}]
