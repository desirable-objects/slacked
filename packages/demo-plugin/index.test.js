'use strict'

import test from 'ava'
import { exec } from '.'
import { stub } from 'sinon'
import slack from 'slacked-slack'

const responseUrl = 'http://example.net/blah'

test.before(t => {
  stub(slack, 'sendEphermalResponse').resolves({})
  stub(slack, 'sendChannelResponse').resolves({})
})

test.beforeEach(t => {
  slack.sendEphermalResponse.reset()
  slack.sendChannelResponse.reset()
})

test('invalid request', async t => {
  const error = await t.throws(exec('antony', ''))
  t.is(error.message, 'Incorrect usage of /demo command. See the docs.')
})

test.serial('successful progress response', async t => {
  await exec('antony', 'simon', responseUrl)

  t.is(slack.sendEphermalResponse.callCount, 1)
  t.deepEqual(slack.sendEphermalResponse.firstCall.args[0], responseUrl)
  t.deepEqual(slack.sendEphermalResponse.firstCall.args[1], 'Okay')
  t.deepEqual(slack.sendEphermalResponse.firstCall.args[2][0].text, `I'll say hello to simon for you, antony.`)
})

test('successful redeployment channel message', async t => {
  await exec('antony', 'simon', responseUrl)

  t.is(slack.sendChannelResponse.callCount, 1)
  t.is(slack.sendChannelResponse.firstCall.args[1], 'Hello, simon')
})
