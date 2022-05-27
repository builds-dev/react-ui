import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, align, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let content_height = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column class_name='x' layout_x={align.center}>
						<Box class_name='a' height={content_height}/>
						<Box class_name='b' height={content_height}/>
					</Column>
				)
			})
	)

	act(render)

	const x = document.querySelector('.x')
	const a = document.querySelector('.a')
	const b = document.querySelector('.b')

	const assert_centered_y = parent_length => {
		assert.ok(
			rendered_px_equal
				(a.offsetTop + content_height)
				(x.clientHeight / 2)
			,
			'first of two children rests on the vertical center of the column'
		)
		assert.ok(
			rendered_px_equal
				(b.offsetTop)
				(x.clientHeight / 2)
			,
			'second of two children hangs from the vertical center of the column'
		)
	}

	assert_centered_y()

	return unmount
}
