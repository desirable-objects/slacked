'use strict'

import test from 'ava'
import { ready } from '../../../app'
import { stub } from 'sinon'
import commands from '../../../commands'
import slack from 'slacked-slack'
import { join } from 'path'

test.before(t => {
  process.env.CONFIG_FILE = join(__dirname, '..', '..', '..', '..', 'test', 'config.test.json')
  stub(commands, 'respond')
  stub(commands, 'list')
  stub(slack, 'sendEphemeralResponse')
})

test.beforeEach(async t => {
  commands.list.returns(['stuff'])
  t.context.server = await ready()
})

test.afterEach(t => {
  commands.respond.reset()
})

test('invalid slack token', async t => {
  const res = await t.context.server.inject({
    method: 'post',
    url: '/commands/stuff',
    payload: {
      token: 'xxx'
    }
  })
  t.is(res.statusCode, 400)
  t.is(res.result.message, 'child "Slack token" fails because ["Slack token" is incorrect]')
})

test.serial('invalid command', async t => {
  const command = 'i-do-not-exist'
  const user = 'diggy'
  const res = await t.context.server.inject({
    method: 'post',
    url: `/commands/${command}`,
    payload: {
      user_name: user,
      token: 'no-key-defined',
      text: 'xxx',
      response_url: 'http://example.com'
    }
  })
  t.is(res.statusCode, 200)
  t.is(res.result.text, `Sorry ${user}, I don't know anything about the command /${command}`)
})

test.serial('calls stuff command', async t => {
  commands.respond.resolves()

  const payload = {
    token: 'no-key-defined',
    text: 'dk-qa',
    response_url: 'http://example.com',
    user_name: 'antony'
  }

  const res = await t.context.server.inject({
    method: 'post',
    url: '/commands/stuff',
    payload
  })
  t.is(res.statusCode, 200)
  t.is(commands.respond.callCount, 1)
  t.is(commands.respond.firstCall.args[0], 'stuff')
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
    url: '/commands/stuff',
    payload
  })
  t.is(res.statusCode, 200)
  t.is(slack.sendEphemeralResponse.callCount, 1)
  t.is(slack.sendEphemeralResponse.firstCall.args[0], payload.response_url)
  t.is(slack.sendEphemeralResponse.firstCall.args[1], `Sorry ${payload.user_name}, ${message}`)
})
