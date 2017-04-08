'use strict'

import test from 'ava'
import { ready } from '../../../app'

test.beforeEach(async t => {
  t.context.server = await ready()
})

test('#health()', async t => {
  const res = await t.context.server.inject({ url: '/health' })
  t.is(res.result, 'Healthy')
})
