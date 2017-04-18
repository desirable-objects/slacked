'use strict'

import test from 'ava'
import { ready } from '../../../app'
import { stub } from 'sinon'
import commands from '../../../commands'
import slack from 'slacked-slack'

test.before(t => {
  stub(commands, 'respond')
  stub(slack, 'sendEphermalResponse')
})

test.beforeEach(async t => {
  t.context.server = await ready()
})

test.afterEach(t => {
  commands.respond.reset()
})

test('invalid slack token', async t => {
  const res = await t.context.server.inject({
    method: 'post',
    url: '/commands/poll',
    payload: {
      token: 'xxx'
    }
  })
  t.is(res.statusCode, 400)
  t.is(res.result.message, 'child "Slack token" fails because ["Slack token" is incorrect]')
})

test.serial('calls poll command', async t => {
  commands.respond.resolves()

  const payload = {
    token: 'no-key-defined',
    text: 'dk-qa',
    response_url: 'http://example.com',
    user_name: 'antony'
  }

  const res = await t.context.server.inject({
    method: 'post',
    url: '/commands/poll',
    payload
  })
  t.is(res.statusCode, 200)
  t.is(commands.respond.callCount, 1)
  t.is(commands.respond.firstCall.args[0], 'poll')
  t.is(commands.respond.firstCall.args[1], payload.user_name)
  t.is(commands.respond.firstCall.args[2], payload.response_url)
  t.is(commands.respond.firstCall.args[3], payload.text)
})

test.serial('some error', async t => {
  const message = 'stuff things'
  commands.respond.rejects(new Error(message))

  const payload = {
    token: 'no-key-defined',
    text: 'dk-qa',
    response_url: 'http://example.com',
    user_name: 'antony'
  }

  const res = await t.context.server.inject({
    method: 'post',
    url: '/commands/poll',
    payload
  })
  t.is(res.statusCode, 200)
  t.is(slack.sendEphermalResponse.callCount, 1)
  t.is(slack.sendEphermalResponse.firstCall.args[0], payload.response_url)
  t.is(slack.sendEphermalResponse.firstCall.args[1], `Sorry ${payload.user_name}, ${message}`)
})
