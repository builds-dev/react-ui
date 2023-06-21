import * as assert from 'uvu/assert'
import React from 'react'
import { Box, mount_to_body } from '#ui'
import { act } from './util.js'

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(props => {
				return (
					<Box class_name={'a'} style={{ background: 'gray' }}>
						<Box
							class_name={'b'}
							height={100}
							width={100}
							style={{ border: '4px solid orange' }}
							{...props}
						>
						</Box>
					</Box>
				)
			})
	)


	act(() => render ({ offset_x: 100 }))

	assert.equal(
		document.querySelector('.b').getBoundingClientRect().x,
		document.querySelector('.a').getBoundingClientRect().x + 100,
		'offset_x={n} offset the box on the x axis by `n` pixels'
	)

	act(() => render ({ offset_y: 100 }))

	assert.equal(
		document.querySelector('.b').getBoundingClientRect().y,
		document.querySelector('.a').getBoundingClientRect().y + 100,
		'offset_y={n} offset the box on the y axis by `n` pixels'
	)


	act(() => render ({ offset_x: 100, offset_y: 100 }))

	assert.equal(
		document.querySelector('.b').getBoundingClientRect().x,
		document.querySelector('.a').getBoundingClientRect().x + 100,
		'offset_x={n} offset the box on the x axis by `n` pixels'
	)

	assert.equal(
		document.querySelector('.b').getBoundingClientRect().y,
		document.querySelector('.a').getBoundingClientRect().y + 100,
		'offset_y={n} offset the box on the y axis by `n` pixels'
	)

	return unmount
}
