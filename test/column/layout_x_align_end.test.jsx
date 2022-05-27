import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, align, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let parent_width = 100
	const content_width = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column class_name='x' height={50} width={parent_width} layout_x={align.end} style={{ border: '4px solid orange' }}>
						<Box class_name='a' height={grow} width={content_width} style={{ border: '4px solid lightblue' }}/>
						<Box class_name='b' height={grow} width={content_width} style={{ border: '4px solid lightgreen' }}/>
					</Column>
				)
			})
	)

	act(render)

	const x = document.querySelector('.x')
	const a = document.querySelector('.a')
	const b = document.querySelector('.b')

	const assert_aligned_right = parent_length => {
		;[ a, b ].forEach((child, i) =>
			assert.ok(
				rendered_px_equal (child.offsetLeft + child.offsetWidth) (x.clientWidth),
				`parent ${parent_length}: child ${i} is aligned to right of the column`
			)
		)
	}

	assert_aligned_right('px(100)')

	parent_width = grow
	act(render)

	assert_aligned_right('grow')

	return unmount
}
