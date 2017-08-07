'use strict'

const got = require('got')

function buildEphermalResponse (text, attachments) {
  const json = { text }

  if (attachments) {
    json.attachments = attachments
  }

  return json
}

function buildChannelResponse (text, attachments) {
  const json = buildEphermalResponse(text, attachments)
  json.response_type = 'in_channel'
  return json
}

function sendResponse (url, body) {
  return got(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'commander/slack'
    },
    body: JSON.stringify(body)
  })
}

async function sendChannelResponse (url, text, attachments) {
  const response = buildChannelResponse(text, attachments)
  await sendResponse(url, response)
}

async function sendEphemeralResponse (url, text, attachments) {
  const response = buildEphermalResponse(text, attachments)
  await sendResponse(url, response)
}

module.exports = {
  sendResponse,
  sendChannelResponse,
  sendEphemeralResponse,
  buildEphermalResponse,
  buildChannelResponse
}
