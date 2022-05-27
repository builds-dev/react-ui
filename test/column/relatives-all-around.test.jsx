import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, conform, shrink, fill, ratio, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	let parent_width = 100
	const content_width = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Box height={fill} width={fill} layout_x={align.center} layout_y={align.center}>
						<Column
							relatives={[
								[
									{ y: [ 1, 0 ] },
									<Box class_name='above' width={fill} layout_x={align.center}>above</Box>
								],
								[
									{ y: [ 0, 1 ] },
									<Box class_name='below' width={fill} layout_x={align.center}>below</Box>
								],
								[
									{ x: [ 1, 0 ] },
									<Box class_name='on_left' height={grow} layout_y={align.center}>on left</Box>
								],
								[
									{ x: [ 0, 1 ] },
									<Box class_name='on_right' height={ratio(1)} layout_y={align.center}>on right</Box>
								]
							]}
						>
							{/*
							<In_back>
								<Box bind:ref={in_back} height={fill} width={fill} center_y padding={10}>back</Box>
							</In_back>
							*/}
							<Box class_name='content' height={100} width={100} layout_x={align.center} layout_y={align.center} padding={20}>
								<Row width={grow} style={{ background: 'red' }}>
									<Box width={shrink} style={{ background: 'lightblue' }}>foo bar</Box>
								</Row>
								{/*
								<Image
									opacity={1}
									src='https://svelte.dev/svelte-logo-horizontal.svg'
									origin_x={0}
									origin_y={0}
									height={fill}
									width={fill}
								/>
								*/}
							</Box>
							{/*
							<In_front>
								<Box bind:ref={in_front} height={fill} width={fill} center_y align_right padding={10} style="background: rgba(255, 62, 0, 0.4)">front</Box>
							</In_front>
							*/}
						</Column>
					</Box>
				)
			})
	)

	act(render)

	const assert_relatives_correctly_positioned = () => {
		const content_rect = content.getBoundingClientRect()
		// const in_back_rect = in_back.getBoundingClientRect()
		// const in_front_rect = in_front.getBoundingClientRect()
		const above_rect = above.getBoundingClientRect()
		const below_rect = below.getBoundingClientRect()
		const on_left_rect = on_left.getBoundingClientRect()
		const on_right_rect = on_right.getBoundingClientRect()

		assert.ok(
			rendered_px_equal (above_rect.bottom) (content_rect.top),
			'bottom of above area is the top of the regular content area'
		)
		assert.equal(
			below_rect.top,
			content_rect.bottom,
			'top of bottom area is the bottom of the regular content area'
		)
		assert.ok(
			rendered_px_equal (on_left_rect.right) (content_rect.left),
			'right of left area is the left of the regular content area'
		)
		assert.equal(
			on_right_rect.left,
			content_rect.right,
			'left of right area is the right of the regular content area'
		)
		// assert.equal(
		// 	in_back_rect,
		// 	content_rect,
		// 	'in_back is in the same area as regular content'
		// )
		// assert.equal(
		// 	in_front_rect,
		// 	content_rect,
		// 	'in_front is in the same area as regular content'
		// )
	}


	const content = document.querySelector('.content')
	const above = document.querySelector('.above')
	const below = document.querySelector('.below')
	const on_left = document.querySelector('.on_left')
	const on_right = document.querySelector('.on_right')

	assert_relatives_correctly_positioned()

	return unmount
}
