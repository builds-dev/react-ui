import { basename, dirname } from 'path-browserify'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import tests from '../build/test-components.js'
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { act } from './util.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const keep_alive = process.env.RUN === 'debug'

// const suites = tests
tests
	.map(({ path: file, export: test_f }) => ({
		test_f,
		test_name: basename(file, '.test.jsx').split('_').join(' '),
		suite_name: basename(dirname(file))
	}))
	.reduce(
		async (promise, { test_f, test_name, suite_name }) => {
			await promise
			console.log(`${suite_name}: ${test_name}`)
			try {
				const unmount = await test_f()
				keep_alive || await act(unmount)
			} catch (error) {
				throw new Error(JSON.stringify({
					code: error.code,
					message: error.message,
					name: error.name,
					suite_name,
					test_name,
					...error
				}))
			}
		},
		Promise.resolve()
	)
		.then(() => keep_alive || window.close())
