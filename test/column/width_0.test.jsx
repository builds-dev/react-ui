import * as assert from 'uvu/assert'
import React from 'react'
import { Column, mount_to_body } from '#ui'
import { act } from '../../test/util.js'

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Column class_name={'x'} width={0}>
						<Column class_name={'y'} width={50} height={50} style={{ border: '4px solid orange' }}></Column>
					</Column>
				)
			})
	)

	act(render)

	assert.equal(
		document.querySelector('.x').clientWidth,
		0,
		`width={0} column has 0 width, despite its content`
	)

	return unmount
}
