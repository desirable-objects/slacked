'use strict'

const { named: re } = require('named-regexp')
const slack = require('slacked-slack')
const { sendEphermalResponse, sendChannelResponse } = slack

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

  await slack.sendEphermalResponse(responseUrl, `Okay`, [{
    text: `I'll say hello to ${name} for you, ${who}.`
  }])
  await slack.sendChannelResponse(responseUrl, `Hello, ${name}`)
}
