import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import _linaria from '@linaria/rollup'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import babel_config from './.babelrc.json' assert { type: 'json' }
import pkg from './package.json' assert { type: 'json' }
const linaria = _linaria.default

const plugins = [
	resolve({
		browser: true
	}),
	commonjs(),
	linaria({
		preprocessor: 'none',
		sourceMap: false
	}),
	postcss({
		extract: false,
		plugins: []
	}),
	babel({
		babelrc: false,
		babelHelpers: 'runtime',
		sourceMaps: false,
		compact: false,
		...babel_config
	})
]

export default {
	external: [
		/@babel\/runtime/,
		...Object.keys(pkg.peerDependencies)
	],
	input: './src/index.js',
	output: [
		{
			format: 'esm',
			file: pkg.module,
			sourcemap: false
		},
		{
			format: 'cjs',
			file: pkg.main,
			sourcemap: false
		}
	],
	plugins
}
