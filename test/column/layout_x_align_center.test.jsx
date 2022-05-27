import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, grow, mount_to_body, ratio } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let parent_width = 100
	const content_width = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column class_name='x' height={50} width={parent_width} layout_x={align.center} style={{ border: '4px solid orange' }}>
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

	const assert_centered_x = parent_length => {
		;[ a, b ].forEach((child, i) =>
			assert.ok(
				rendered_px_equal (child.offsetLeft + (child.offsetWidth / 2)) (x.clientWidth / 2),
				`parent ${parent_length}: child ${i} is horizontally centered`
			)
		)
	}

	assert_centered_x('px(100)')

	parent_width = grow

	act(render)

	assert_centered_x('grow')

	return unmount
}
