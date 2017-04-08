'use strict'

import test from 'ava'
import { ready } from './app'

test('#list()', async t => {
  const server = await ready()
  t.truthy(server.hasOwnProperty('connections'))
})
