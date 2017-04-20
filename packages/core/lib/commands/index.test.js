'use strict'

import test from 'ava'
import { list } from '.'
import { stub } from 'sinon'
import pluginLoader from '../plugin-loader'
import { join } from 'path'

test('#list()', t => {
  process.env.CONFIG_FILE = join(__dirname, '..', '..', '..', '..', 'test', 'config.test.json')
  stub(pluginLoader, 'load').returns({ demo: {} })
  t.deepEqual(list(), ['demo'])
})
