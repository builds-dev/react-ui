import React from 'react'
import * as assert from 'uvu/assert'
import { Column, grow, mount_to_body, overflow } from '#ui'
import { act, has_scrollbar } from '../../test/util.js'

export default async () => {
	const { render, unmount } = await act(() =>
		mount_to_body
			({})
			(({ content_height, overflow }) => {
				return (
					<Column class_name={'x'} height={100} width={grow} overflow={overflow} style={{ background: 'orange', }}>
						<Column height={content_height} width={grow} style={{ background: 'pink' }}/>
					</Column>
				)
			})
	)

	act(() => render({ content_height: 50, overflow: overflow.scroll_y() }))
	const x = document.querySelector('.x')
	assert.equal(has_scrollbar ('y') (x), false, 'does not have Y scrollbar when content height is less than column')
	act(() => render({ content_height: 150, overflow: overflow.scroll_y() }))
	assert.equal(has_scrollbar ('y') (x), true, 'has Y scrollbar when content height is greater than column')
	act(() => render({ content_height: 150, overflow: overflow.clip_y }))
	assert.equal(has_scrollbar ('y') (x), false, 'overflow={overflow.clip_y} disables scrolling on the y axis')
	return unmount
}
