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
					<Box width={100}>
						<Row height={grow} width={fill}>
							<Box height={25}></Box>
							<Box class_name='child1' height={fill} width={20} style={{ background: 'lightblue' }}></Box>
							<Box class_name='child2' height={fill} width={fill} style={{ background: 'lightgreen' }}></Box>
							<Box class_name='child3' height={ratio(2)} width={5} style={{ background: 'red' }}></Box>
						</Row>
					</Box>
				)
			})
	)

	act(render)

	assert.equal(
		document.querySelector('.child1').clientWidth,
		20
	)

	assert.equal(
		document.querySelector('.child2').clientWidth,
		75
	)

	assert.equal(
		document.querySelector('.child1').clientHeight,
		25
	)

	assert.equal(
		document.querySelector('.child2').clientHeight,
		25
	)

	assert.equal(
		document.querySelector('.child2').clientHeight,
		25
	)

	return unmount
}
