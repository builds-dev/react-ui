import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, fill, ratio, mount_to_body } from '../../src/index'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column class_name='a' height={fill} width={fill} style={{ border: '4px solid red' }}>
						<Column class_name='b' height={ratio(0.5)} width={fill} style={{ border: '4px solid orange' }}/>
					</Column>
				)
			})
	)

	act(render)

	const a = document.querySelector('.a')
	const b = document.querySelector('.b')

	assert.ok(
		rendered_px_equal (b.clientHeight, a.clientHeight / 2),
		'height={ratio(x)} child of root height={fill} parent has correct height'
	)

	return unmount
}
