import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import glob_module_files from 'glob-module-file'
import _linaria from '@linaria/rollup'
import babel_config from './.babelrc.json' assert { type: 'json' }
import postcss from 'rollup-plugin-postcss'
import virtual from '@rollup/plugin-virtual'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
const linaria = _linaria.default
import * as playwright from 'playwright'

export default async () => ({
	input: 'test/test.js',
	output: {
		file: 'build/app.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		virtual({
			'./build/test-components.js': await glob_module_files({
				pattern: process.env.GLOB || './{src,test,tests}/**/*.{spec,test}.jsx',
				format: 'es',
				exportWithPath: true
			})
		}),
		nodeResolve({
			browser: true,
			preferBuiltins: false
		}),
		commonjs(),
		replace({
			preventAssignment: false,
			values: {
				'process.env.NODE_ENV': JSON.stringify('development'),
				'process.env.RUN': JSON.stringify(process.env.RUN)
			}
		}),
		linaria({
			preprocessor: 'none',
			sourceMap: process.env.NODE_ENV !== 'production'
		}),
		postcss({
		  extract: false,
			plugins: []
		}),
		babel({
			babelrc: false,
			babelHelpers: 'bundled',
			sourceMaps: 'inline',
			compact: true,
			presets: babel_config.presets
		}),
		...(
			process.env.RUN === 'debug' && process.env.ROLLUP_WATCH
				? [
					serve({
						open: true,
						contentBase: './build'
					}),
					livereload({ watch: './build/app.js' })
				]
				: []
		),
		process.env.RUN === 'test'
			&& {
				generateBundle: async (options, bundle) => {
					const browser = await playwright['chromium'].launch({ headless: true })
					const page = await browser.newPage()
					page.on('console', console.log)
					const close = new Promise(resolve => page.on('close', resolve))
					const crash = new Promise(resolve => page.on('crash', resolve))
					const pageerror = new Promise(resolve => page.on('pageerror', resolve))
					try {
						await page.evaluate(bundle['app.js'].code)
						const result = await Promise.race([ close, crash, pageerror ])
						if (result instanceof Error) {
							const error = result
							if (result.message.startsWith('{')) {
								const data = JSON.parse(error.message.replace(/^Error: /, ''))
								console.error(data.suite_name, data.test_name)
								console.error(data.message)
								console.error(data.operator)
								console.error(data.details)
							} else {
								console.error(error)
							}
							process.exit(1)
						}
					} catch (error) {
						console.error(error)
						process.exit(1)
					}

					// await browser.close()
					// const browser = browser_run({ browser: 'electron' })
					// await pipeline(
					// 	Readable.from(bundle['app.js'].code),
					// 	browser,
					// 	process.stdout
					// )
				}
			}
	]
})
