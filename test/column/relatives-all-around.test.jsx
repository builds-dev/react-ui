import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, content, edges, fill, ratio, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let parent_width = 100
	const child_width = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Box height={fill} width={fill} layout_x={align.center} layout_y={align.center}>
						<Column
							class_name='parent'
							background={[
								<Box class_name='in_back' width={fill} layout_x={align.center}>in back</Box>
							]}
							foreground={[
								<Box class_name='above' anchor_y={[ 1, 0 ]} width={fill} layout_x={align.center}>above</Box>,
								<Box class_name='below' anchor_y={[ 0, 1 ]} width={fill} layout_x={align.center}>below</Box>,
								<Box class_name='on_left' anchor_x={[ 1, 0 ]} anchor_y={[ 0.5, 0.5 ]}>on left</Box>,
								<Box class_name='on_right' anchor_x={[ 0, 1 ]} anchor_y={[ 0.5, 0.5 ]}>on right</Box>,
								<Box class_name='in_front' anchor_x={[ 0.5, 0.5 ]} anchor_y={[ 1, 1 ]}>in front</Box>
							]}
						>
							<Box
								class_name='child'
								height={100}
								width={100}
								layout_x={align.center}
								layout_y={align.center}
								padding={edges (20)}
								style={{ background: 'rgb(32, 35, 42)', border: '3px solid rgb(22, 24, 29)', opacity: 0.925 }}
							>
								<img
									src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
									style={{ height: '100%', width: '100%' }}
								/>
							</Box>
						</Column>
					</Box>
				)
			})
	)

	act(render)

	const assert_relatives_correctly_positioned = () => {
		const parent_rect = parent.getBoundingClientRect()
		const child_rect = child.getBoundingClientRect()
		const in_back_rect = in_back.getBoundingClientRect()
		const in_front_rect = in_front.getBoundingClientRect()
		const above_rect = above.getBoundingClientRect()
		const below_rect = below.getBoundingClientRect()
		const on_left_rect = on_left.getBoundingClientRect()
		const on_right_rect = on_right.getBoundingClientRect()

		assert.ok(
			rendered_px_equal (above_rect.bottom) (parent_rect.top),
			`bottom of 'above' is the top of 'parent'`
		)
		assert.equal(
			below_rect.top,
			parent_rect.bottom,
			`top of 'bottom' is the bottom of 'parent'`
		)
		assert.ok(
			rendered_px_equal (on_left_rect.right) (child_rect.left),
			`right of 'left' is the left of 'parent'`
		)
		assert.equal(
			on_right_rect.left,
			parent_rect.right,
			`left of 'right' is the right of 'parent'`
		)
		assert.equal(
			in_back_rect.top,
			parent_rect.top,
			`top of 'in_back' is top of 'parent'`
		)
		assert.equal(
			in_front_rect.bottom,
			parent_rect.bottom,
			`bottom of 'in_front' is bottom of 'parent'`
		)
	}

	const parent = document.querySelector('.parent')
	const child = document.querySelector('.child')
	const above = document.querySelector('.above')
	const below = document.querySelector('.below')
	const on_left = document.querySelector('.on_left')
	const on_right = document.querySelector('.on_right')
	const in_back = document.querySelector('.in_back')
	const in_front = document.querySelector('.in_front')

	assert_relatives_correctly_positioned()

	return unmount
}
