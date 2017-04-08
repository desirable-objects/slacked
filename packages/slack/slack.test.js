'use strict'

import test from 'ava'
import { buildEphermalResponse, buildChannelResponse } from '.'

test('#buildEphermalResponse()', t => {
  t.deepEqual(buildEphermalResponse('hi'), { text: 'hi' })
})

test('#buildChannelResponse()', t => {
  t.deepEqual(buildChannelResponse('hi'), { response_type: 'in_channel', text: 'hi' })
})
