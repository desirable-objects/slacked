'use strict'

const { named: re } = require('named-regexp')
const slack = require('slacked-slack')
const { buildEphermalResponse, buildChannelResponse } = slack

function parse (cmd) {
  const instruction = re(/(:<name>[a-zA-Z ']+)/)
  const matches = instruction.exec(cmd)

  if (!matches) {
    throw new Error(`Incorrect usage of /${command} command. See the docs.`)
  }

  const name = matches.capture('name')

  return { name }
}

const command = exports.command = 'demo'

exports.setConfig = function () { }

exports.exec = async function (who, cmd, responseUrl) {
  const { name } = parse(cmd)
  const confirmationMessage = buildEphermalResponse(`Okay`, [{
    text: `I'll say hello to ${name} for you, ${who}.`
  }])

  await slack.sendResponse(responseUrl, confirmationMessage)

  return buildChannelResponse(`Hello, ${name}`)
}
