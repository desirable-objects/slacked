'use strict'

import test from 'ava'
import nock from 'nock'
import { reconfigure, apiUrl } from '.'

test('#reconfigure()', async t => {
  nock(apiUrl)
  .patch('/service/12345/', {
    image: 'myimage:mytag'
  })
  .reply(200)

  await reconfigure({serviceId: '12345', image: 'myimage'}, 'mytag')
  t.truthy(nock.isDone())
})
