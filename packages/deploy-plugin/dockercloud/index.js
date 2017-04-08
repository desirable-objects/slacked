'use strict'

const got = require('got')

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'slacked/deploy-plugin',
  Authorization: 'Basic ' + Buffer.from(`${process.env.DOCKERCLOUD_PASSWORD}:${process.env.DOCKERCLOUD_PASSWORD}`).toString('base64')
}

const apiUrl = 'https://cloud.docker.com/api/app/v1'

function reconfigure (app, tag) {
  const options = {
    method: 'patch',
    body: JSON.stringify({
      image: `${app.image}:${tag}`
    }),
    headers: headers,
    json: true
  }

  return got(`${apiUrl}/service/${app.serviceId}/`, options)
}

function redeploy (app) {
  const options = {
    method: 'post',
    headers: headers,
    json: true
  }

  return got(`${apiUrl}/service/${app.serviceId}/redeploy/`, options)
}

module.exports = {
  apiUrl,
  reconfigure,
  redeploy
}
