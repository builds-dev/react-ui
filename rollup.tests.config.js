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

export default {
	input: 'test/test.js',
	output: {
		file: 'build/app.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		{
			// resolveId: source =>
			// 	source === '../build/test-components.js'
			// 		? { id: 'build/test-components.js' }
			// 		: null
			// ,
			load: async id => {
				// return id === 'build/test-components.js'
				return id.includes('build/test-components.js')
					? {
						code: await glob_module_files({
							pattern: process.env.GLOB || './{src,test,tests}/**/*.{spec,test}.jsx',
							format: 'es',
							pathPrefix: '../',
							exportWithPath: true
						})
					}
					: null
			}
		},
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
}
