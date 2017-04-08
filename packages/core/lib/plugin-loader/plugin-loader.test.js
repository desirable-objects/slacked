'use strict'

import test from 'ava'
import { join } from 'path'
import { load } from '.'
import demoPlugin from '../../../demo-plugin'

test('#load()', async t => {
  process.env.CONFIG_FILE = join(__dirname, 'plugin-loader.test.json')
  t.deepEqual(load(), { demo: demoPlugin })
})
