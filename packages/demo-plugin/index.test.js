'use strict'

import test from 'ava'
import { exec } from '.'
import { stub } from 'sinon'
import slack from 'slacked-slack'

const responseUrl = 'http://example.net/blah'

test.before(t => {
  stub(slack, 'sendResponse').returns({})
})

test('invalid request', async t => {
  const error = await t.throws(exec('antony', ''))
  t.is(error.message, 'Incorrect usage of /demo command. See the docs.')
})

test.serial('successful progress response', async t => {
  slack.sendResponse.reset()
  await await exec('antony', 'simon', responseUrl)

  t.is(slack.sendResponse.callCount, 1)
  t.deepEqual(slack.sendResponse.firstCall.args[0], responseUrl)
  t.deepEqual(slack.sendResponse.firstCall.args[1].text, `Okay`)
  t.deepEqual(slack.sendResponse.firstCall.args[1].attachments[0].text, `I'll say hello to simon for you, antony.`)
})

test('successful redeployment channel message', async t => {
  const response = await await exec('antony', 'simon', responseUrl)

  t.is(response.response_type, 'in_channel')
  t.is(response.text, 'Hello, simon')
})
