'use strict'

import test from 'ava'
import { list } from '.'
import { stub } from 'sinon'
import pluginLoader from '../plugin-loader'

test('#list()', t => {
  stub(pluginLoader, 'load').returns({ demo: {} })
  t.deepEqual(list(), ['demo'])
})
