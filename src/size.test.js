import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { min, max, px, format_size } from './size.js'

const test = suite('size')

test('format_size', () => {
		console.log(format_size(min (px(200)) (px(100))))
	;[
		[
			px(100),
			{ type: 'px', value: 100, min: { type: 'px', value: 0 }, max: { type: 'px', value: Infinity } }
		],
		[
			format_size(px(100)),
			{ type: 'px', value: 100, min: { type: 'px', value: 0 }, max: { type: 'px', value: Infinity } }
		],
		[
			format_size(100),
			{ type: 'px', value: 100, min: { type: 'px', value: 0 }, max: { type: 'px', value: Infinity } }
		],
		[
			format_size(min (px(200)) (px(100))),
			{ type: 'px', value: 100, min: { type: 'px', value: 200 }, max: { type: 'px', value: Infinity } }
		]
	].forEach(([ actual, expected ]) => assert.equal(actual, expected))
})

test.run()
