import * as assert from 'uvu/assert'
import React from 'react'
import { align, Box, Column, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	const content_height = 75

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Box height={grow} width={grow} layout_x={align.center} layout_y={align.center}>
						<Column class_name='x' height={content_height * 1.3333333} width={grow} layout_y={align.end} style={{ background: 'red' }}>
							<Box class_name='a' height={content_height} width={grow} style={{ background: 'black', border: '4px solid gray', opacity: 0.5 }}/>
							<Box class_name='b' height={content_height} width={grow} style={{ background: 'black', border: '4px solid gray', opacity: 0.5 }}/>
						</Column>
					</Box>
				)
			})
	)

	act(render)

	const x = document.querySelector('.x')
	const a = document.querySelector('.a')
	const b = document.querySelector('.b')

	const assert_aligned_bottom = parent_length => {
		assert.ok(
			rendered_px_equal (b.offsetTop + b.offsetHeight) (x.offsetHeight),
			`last child is aligned to bottom of the column`
		)
		assert.ok(
			rendered_px_equal (a.offsetTop + a.offsetHeight) (b.offsetTop),
			`previous child is aligned to bottom of the column, just above next child`
		)
	}

	assert_aligned_bottom()

	return unmount
}
