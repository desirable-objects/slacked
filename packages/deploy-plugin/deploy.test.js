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
  stub(slack, 'sendChannelResponse')
  stub(slack, 'sendEphemeralResponse')
  dockercloud.reconfigure.resolves({})
  dockercloud.redeploy.resolves({})
  slack.sendChannelResponse.resolves({})
  slack.sendEphemeralResponse.resolves({})
})

test.beforeEach(t => {
  dockercloud.reconfigure.reset()
  dockercloud.redeploy.reset()
  slack.sendChannelResponse.reset()
  slack.sendEphemeralResponse.reset()
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
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(dockercloud.reconfigure.callCount, 1)
  t.deepEqual(dockercloud.reconfigure.firstCall.args[0], config['environment']['application'])
  t.deepEqual(dockercloud.reconfigure.firstCall.args[1], 'release-v1.1.1')
})

test.serial('successful progress response', async t => {
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(slack.sendEphemeralResponse.callCount, 1)
  t.deepEqual(slack.sendEphemeralResponse.firstCall.args[0], responseUrl)
  t.deepEqual(slack.sendEphemeralResponse.firstCall.args[1], `No problem!`)
  t.deepEqual(slack.sendEphemeralResponse.firstCall.args[2][0].text, `I'll deploy release-v1.1.1 of application on environment for you, antony.\nGive me a second...`)
})

test.serial('successful redeploy request', async t => {
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.is(dockercloud.redeploy.callCount, 1)
  t.deepEqual(dockercloud.redeploy.firstCall.args[0], config['environment']['application'])
})

test('successful redeployment channel message', async t => {
  await plugin.exec('antony', 'release-v1.1.1 of application on environment', responseUrl)

  t.deepEqual(slack.sendChannelResponse.firstCall.args[0], responseUrl)
  t.is(slack.sendChannelResponse.callCount, 1)
  t.is(slack.sendChannelResponse.firstCall.args[1], 'Okay, redeployment of application@release-v1.1.1 on environment is complete.')
})
