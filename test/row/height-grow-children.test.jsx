import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Row, fill, grow, ratio, mount_to_body } from '../../src/index.js'
import { act } from '../../test/util.js'

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Row class_name='parent' width={200}>
						<Box class_name='child1' height={fill} width={fill} style={{ background: 'lightgreen' }}>
							{'foo '.repeat(10)}
						</Box>
						<Box class_name='child2' width={fill} style={{ background: 'pink' }}>
							{'foo '.repeat(5)}
						</Box>
						<Box class_name='child3' height={grow} width={fill} style={{ background: 'orange' }}>foo</Box>
						<Box class_name='child4' height={grow} width={fill} style={{ background: 'purple' }}></Box>
					</Row>
				)
			})
	)

	act(render)

	const parent = document.querySelector('.parent')
	const children = [ ...new Array(4) ].fill().map((_, i) => document.querySelector(`.child${i + 1}`))
	const [
		child1,
		child2,
		child3,
		child4
	] = children

	children.forEach((child, index) => {
		assert.equal(
			parent.clientHeight,
			child.clientHeight,
			`Height of child ${index} is equal to its parent height.`
		)
	})

	return unmount
}
