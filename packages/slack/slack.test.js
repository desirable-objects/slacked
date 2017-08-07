'use strict'

import test from 'ava'
import nock from 'nock'
import { 
  buildEphermalResponse, 
  buildChannelResponse, 
  sendEphemeralResponse, 
  sendChannelResponse 
} from '.'

function makeUniqueUrl () {
  const suff = Math.floor((Math.random() * 100000) + 1)
  const host = `http://example${suff}.net`
  const path = '/some/stuff'
  return {
    host,
    path,
    url: `${host}${path}`
  }
}

test('#sendEphemeralResponse()', async t => {
  const { host, path, url } = makeUniqueUrl()
  nock(host)
  .post(path, {
    text: 'hi'
  })
  .reply(200)

  await sendEphemeralResponse(url, 'hi')

  t.true(nock.isDone())
})

test('#sendChannelResponse()', async t => {
  const { host, path, url } = makeUniqueUrl()
  nock(host)
  .post(path, {
    response_type: 'in_channel',
    text: 'hi'
  })
  .reply(200)

  await sendChannelResponse(url, 'hi')

  t.true(nock.isDone())
})

test('#sendEphemeralResponse()', async t => {
  const { host, path, url } = makeUniqueUrl()
  nock(host)
  .post(path, {
    text: 'hi',
    attachments: [
      { text: 'hey' }
    ]
  })
  .reply(200)

  await sendEphemeralResponse(url, 'hi', [{ text: 'hey' }])

  t.true(nock.isDone())
})

test('#sendChannelResponse()', async t => {
  const { host, path, url } = makeUniqueUrl()
  nock(host)
  .post(path, {
    response_type: 'in_channel',
    text: 'hi',
    attachments: [
      { text: 'hey' }
    ]
  })
  .reply(200)

  await sendChannelResponse(url, 'hi', [{ text: 'hey' }])

  t.true(nock.isDone())
})

test('#buildEphermalResponse()', t => {
  t.deepEqual(buildEphermalResponse('hi'), { text: 'hi' })
})

test('#buildChannelResponse()', t => {
  t.deepEqual(buildChannelResponse('hi'), { response_type: 'in_channel', text: 'hi' })
})
