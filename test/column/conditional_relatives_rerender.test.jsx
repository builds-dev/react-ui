import * as assert from 'uvu/assert'
import React, { useEffect, useState } from 'react'
import { Box, Column, Row, align, fill, ratio, mount_to_body } from '../../src/index'
import { act, rendered_px_equal } from '../../test/util.js'

export default async () => {
	const Child = () => (<Box class_name='child'>I am a child</Box>)

	const App = ({ show_relatives }) => {
		return (
			<Column>
				<Box
					class_name='parent'
					style={{ border: "4px solid orange" }}
					relatives={
						show_relatives
							?
								[
									[
										{ x: [ 0, 1 ], y: [ 0, 1 ] },
										<Box class_name='relative' style={{ border: '4px solid red' }}>I am a relative</Box>
									]
								]
							:
								[]
					}
				>
					<Child/>
				</Box>
			</Column>
		)
	}

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(props => <App {...props}/>)
	)

	await act(() => render({ show_relatives: true }))

	const parent = document.querySelector('.parent')
	const child = document.querySelector('.child')

	assert.ok(document.querySelector('.relative'), 'relative is rendered')
	assert.ok(child, 'child is rendered')
	assert.ok(parent, 'parent is rendered')

	await act(() => render({ show_relatives: false }))

	assert.equal(document.querySelector('.relative'), null, 'relative is not rendered')
	assert.ok(Object.is(child, document.querySelector('.child')), 'child did not get recreated')
	assert.ok(Object.is(parent, document.querySelector('.parent')), 'parent did not get recreated')

	await act(() => render({ show_relatives: true }))

	assert.ok(document.querySelector('.relative'), 'relative is rendered')
	assert.ok(Object.is(child, document.querySelector('.child')), 'child did not get recreated')
	assert.ok(Object.is(parent, document.querySelector('.parent')), 'parent did not get recreated')

	return unmount
}
