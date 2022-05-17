import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import tests from '../build/test-components.js'
import React from 'react'
import * as ReactDOM from 'react-dom/client'

// import { layout, layout_y } from '../src/layout'

const keep_alive = !navigator.userAgent.toLowerCase().includes('electron')

const suites = tests
	.map(({ path: file, export: test_f }) => ({
		test_f,
		test_name: test_f.name.split('_').slice(0, -1).join(' '),
		suite_name: file.split('/').slice(-2)[0]
	}))
	.reduce(
		(suites, { suite_name, ...test }) => {
			suites[suite_name] = suites[suite_name] || []
			suites[suite_name].push(test)
			return suites
		},
		{}
	)

// document.body.className = `${layout} ${layout_y}`
// Object.assign(document.body.style, {
// 	margin: 0,
// 	padding: 0,
// 	minHeight: '100vh'
// })

const animation_frame = () => new Promise(resolve => window.requestAnimationFrame(resolve))

Promise.all(
	Object.entries(suites)
		.map(([ suite_name, tests ]) => {
			const test = suite(suite_name)
			const promises = tests.map(({ test_name, test_f }) => new Promise(resolve => {
				test(test_name, async () => {
					try {
						let async_work = () => Promise.resolve()
						const destroy_after = f => async_work = f
						// const component = ReactDOM.createRoot(document.body).render(React.createElement(Component, { destroy_after }))
						const destroy = test_f()
						await animation_frame()
						// await async_work().finally(() => keep_alive || component.stop())
						await async_work().finally(() => keep_alive || destroy())
					} finally {
						resolve()
					}
				})
			}))
			test.run()
			return Promise.all(promises)
		})
)
	.then(animation_frame)
	.then(() => keep_alive || window.close())
