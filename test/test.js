import { basename, dirname } from 'path-browserify'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import tests from '../build/test-components.js'
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { act } from './util.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const keep_alive = process.env.RUN === 'debug'

const suites = tests
	.map(({ path: file, export: test_f }) => ({
		test_f,
		test_name: basename(file, '.test.jsx').split('_').join(' '),
		suite_name: basename(dirname(file))
	}))
	.reduce(
		(suites, { suite_name, ...test }) => {
			suites[suite_name] = suites[suite_name] || []
			suites[suite_name].push(test)
			return suites
		},
		{}
	)

Object.entries(suites)
	.reduce(
		(previous_suite_promise, [ suite_name, tests ]) =>
			previous_suite_promise.then(() => {
				return tests.reduce(
					(previous_test_promise, { test_name, test_f }) =>
						previous_test_promise.then(() => {
							return new Promise(resolve => {
								test(`${suite_name}: ${test_name}`, async () => {
									const unmount = await Promise.resolve(test_f())
									keep_alive || await act(unmount)
									resolve()
								})
								return test.run()
							})
						})
					,
					Promise.resolve()
				)
			})
		,
		Promise.resolve()
	)
	.finally(() => keep_alive || window.close())
