'use strict'

const { named: re } = require('named-regexp')
const slack = require('slacked-slack')
const { buildEphermalResponse, buildChannelResponse } = slack
const dockercloud = require('./dockercloud')

let environments

function parse (cmd) {
  const deploymentInstruction = re(/(:<version>[a-z0-9.-]+) of (:<application>[a-z-]+) on (:<environment>[a-z-]+)/)
  const matches = deploymentInstruction.exec(cmd)

  if (!matches) {
    throw new Error('Your deployment request is incorrect. See the docs.')
  }

  const application = matches.capture('application')
  const environment = matches.capture('environment')
  const version = matches.capture('version')
  const environmentConfig = environments[environment]

  if (!environmentConfig) {
    throw new Error(`There is no such environment ${environment}. There are only ${Object.keys(environments).join(', ')}`)
  }

  const applicationConfig = environmentConfig[application]

  if (!applicationConfig) {
    throw new Error(`There is no such application ${application} on ${environment}. There are only ${Object.keys(environments[environment]).join(', ')}`)
  }

  return { applicationConfig, environment, application, version }
}

exports.setConfig = function (conf) {
  environments = conf
}

exports.command = 'deploy'

exports.exec = async function (who, cmd, responseUrl) {
  const { applicationConfig, environment, application, version } = parse(cmd)
  await dockercloud.reconfigure(applicationConfig, version)

  const reconfigureMessage = buildEphermalResponse(`No problem!`, [{
    text: `I'll deploy ${version} of ${application} on ${environment} for you, ${who}.\nGive me a second...`
  }])

  await slack.sendResponse(responseUrl, reconfigureMessage)
  await dockercloud.redeploy(applicationConfig)

  return buildChannelResponse('Okay, redeployment is complete.')
}
