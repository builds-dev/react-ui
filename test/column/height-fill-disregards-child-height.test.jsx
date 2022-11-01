import * as assert from 'uvu/assert'
import React from 'react'
import { Column, Box, fill, mount_to_body } from '../../src/index.js'
import { act } from '../../test/util.js'

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column height={108} style={{ border: '4px solid red' }}>
						<Box height={75} width={fill} style={{ background: 'lightgreen' }}/>
						<Column class_name={'x'} height={fill} width={100} style={{ background: 'orange' }}>
							<Box height={50} width={50} style={{ background: 'lightblue' }}/>
						</Column>
					</Column>
				)
			})
	)

	act(render)

	assert.equal(
		document.querySelector('.x').clientHeight,
		25,
		`height={fill} column took up only the remaining space and did not grow taller due to its child's height`
	)

	return unmount
}
