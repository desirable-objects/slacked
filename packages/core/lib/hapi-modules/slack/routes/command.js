'use strict'

const Joi = require('joi')
const { buildEphermalResponse } = require('slacked-slack')
const commands = require('../../../commands')

const slackToken = process.env.SLACK_KEY || 'no-key-defined'

module.exports = [{
  method: 'post',
  path: '/commands/{command}',
  config: {
    auth: false,
    validate: {
      params: {
        command: Joi.string().description('Command Name')
      },
      payload: Joi.object().keys({
        token: Joi.string().only(slackToken).label('Slack token').required()
          .options({ language: { any: { allowOnly: 'is incorrect' } } }),
        text: Joi.string().required(),
        response_url: Joi.string().required(),
        user_name: Joi.string().required()
      }).unknown(true)
    }
  },
  handler: async (request, reply) => {
    const { response_url: responseUrl, user_name: who, text } = request.payload
    const { command } = request.params

    try {
      const response = await commands.respond(command, who, responseUrl, text)
      reply(response)
    } catch (e) {
      reply(buildEphermalResponse(`Sorry ${who}, ${e.message}`))
    }
  }
}]
