import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, fill, grow, mount_to_body } from '../src/index.js'
import { act } from './util.js'
import { capitalize } from './util.js'

export default async () => {
	const content_length = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(({ Layout, cross_axis_length_name, main_axis_length_name }) => (
				<Layout {...{ [main_axis_length_name]: fill, style: { background: 'pink' } }}>
					<Layout {...{
							class_name: 'child',
							[cross_axis_length_name]: fill,
							[main_axis_length_name]: fill,
							layout_x: align.start({ gap: 10 }),
							style: { background: 'lightblue' }
					}}>
						<Box {...{
							[cross_axis_length_name]: content_length * 2,
							[main_axis_length_name]: 100,
							style: { background: 'lightgreen', opacity: 0.4 }
						}}/>
						<Box {...{
							[cross_axis_length_name]: content_length * 2,
							[main_axis_length_name]: 100,
							style: { background: 'lightgreen', opacity: 0.4 }
						}}/>
					</Layout>
					<Box {...{
						[cross_axis_length_name]: content_length,
						[main_axis_length_name]: fill,
						style: { background: 'purple' }
					}}/>
				</Layout>
			))
	)

	;[
		{
			Layout: Column,
			main_axis_length_name: 'height',
			cross_axis_length_name: 'width'
		},
		{
			Layout: Row,
			main_axis_length_name: 'width',
			cross_axis_length_name: 'height'
		}
	].forEach(props => {
		act(() => render(props))

		const child = document.querySelector('.child')

		assert.equal(
			child['client' + capitalize(props.cross_axis_length_name)],
			content_length,
			'child filled up all, and no more, of the main axis space made available by its sibling'
		)
	})

	return unmount
}
