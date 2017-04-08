'use strict'

import test from 'ava'
import plugin from '.'
import { stub } from 'sinon'
import dockercloud from './dockercloud'
import slack from 'slacked-slack'

const responseUrl = 'http://example.net/blah'
const { deploy: config } = require('./config.test.json')

test.before(t => {
  plugin.setConfig(config)
  stub(dockercloud, 'reconfigure')
  stub(dockercloud, 'redeploy')
  stub(slack, 'sendResponse')
})

test.beforeEach(t => {
  dockercloud.reconfigure.resolves({})
  dockercloud.redeploy.resolves({})
  slack.sendResponse.resolves({})
})

test('invalid poll request', async t => {
  const error = await t.throws(plugin.exec('test', 'xxx'))
  t.is(error.message, 'Your deployment request is incorrect. See the docs.')
})

test('no such environment', async t => {
  const error = await t.throws(plugin.exec('test', 'release-v1.1.1 of application on qq-bb-cc'))
  t.truthy(error.message.includes('There is no such environment qq-bb-cc. There are only '))
})

test('no such application', async t => {
  const error = await t.throws(plugin.exec('test', 'release-v1.1.1 of flower-app on environment'))
  t.truthy(error.message.includes('There is no such application flower-app on environment. There are only '))
})

test.serial('successful reconfigure request', async t => {
  dockercloud.reconfigure.reset()
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(dockercloud.reconfigure.callCount, 1)
  t.deepEqual(dockercloud.reconfigure.firstCall.args[0], config['environment']['application'])
  t.deepEqual(dockercloud.reconfigure.firstCall.args[1], 'release-v1.1.1')
})

test.serial('successful progress response', async t => {
  slack.sendResponse.reset()
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(slack.sendResponse.callCount, 1)
  t.deepEqual(slack.sendResponse.firstCall.args[0], responseUrl)
  t.deepEqual(slack.sendResponse.firstCall.args[1].text, `No problem!`)
  t.deepEqual(slack.sendResponse.firstCall.args[1].attachments[0].text, `I'll deploy release-v1.1.1 of application on environment for you, antony.\nGive me a second...`)
})

test.serial('successful redeploy request', async t => {
  dockercloud.redeploy.reset()
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(dockercloud.redeploy.callCount, 1)
  t.deepEqual(dockercloud.redeploy.firstCall.args[0], config['environment']['application'])
})

test('successful redeployment channel message', async t => {
  const response = await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(response.response_type, 'in_channel')
  t.is(response.text, 'Okay, redeployment is complete.')
})
