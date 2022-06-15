import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import browser_run from 'browser-run'
import glob_module_files from 'glob-module-file'
import linaria from '@linaria/rollup'
import babel_config from './.babelrc.json'
import postcss from 'rollup-plugin-postcss'
import virtual from '@rollup/plugin-virtual'

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
			compact: false,
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
				generateBundle: (options, bundle) => {
					const browser = browser_run({ browser: 'electron' })
					browser.write(bundle['app.js'].code)
					browser.pipe(process.stdout)
					browser.end()
				}
			}
	]
})
