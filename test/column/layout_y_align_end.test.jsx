import * as assert from 'uvu/assert'
import React from 'react'
import { align, content, overflow, Box, Column, Row, fill, ratio, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let parent_height = 100
	const content_height = 25

	const style = {
	}
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Row class_name='x' width={200} height={50} style={{ border: '4px solid orange' }} overflow={overflow.visible}>
						<Box class_name='a' width={content} height={grow} style={{ border: '4px solid lightblue', ...style }}>foo bar</Box>
						<Box class_name='b' width={ratio(0.5)} height={grow} style={{ border: '4px solid lightgreen', ...style }}>foo bar</Box>
						<Box class_name='c' width={content} height={grow} style={{ border: '4px solid lightgreen', ...style }}>foo bar</Box>
						<Box class_name='d' width={fill} height={fill} style={{ border: '4px solid blue', ...style }}>foo bar baz</Box>
					</Row>
				)
			})
	)

	act(render)

	// const x = document.querySelector('.x')
	// const a = document.querySelector('.a')
	// const b = document.querySelector('.b')

	// const assert_aligned_bottom = parent_length => {
	// 	assert.ok(
	// 		rendered_px_equal (b.offsetTop + b.offsetHeight) (x.clientTop + x.clientHeight),
	// 		`parent ${parent_length}: last child is aligned to bottom of the column`
	// 	)
	// 	assert.ok(
	// 		rendered_px_equal (a.offsetTop + a.offsetHeight) (b.offsetTop),
	// 		`parent ${parent_length}: previous child is aligned to bottom of the column, just above next child`
	// 	)
	// }

	// assert_aligned_bottom('px(100)')

	// parent_height = grow

	// act(render)

	// assert_aligned_bottom('grow')

	return unmount
}
