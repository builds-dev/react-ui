import * as assert from 'uvu/assert'
import React from 'react'
import { Row, fill, mount_to_body } from '../../src/index.js'
import { act } from '../../test/util.js'

export default async () => {
	const width = 50

	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Row class_name='ancestor'>
						<Row>
							<Row>
								<Row width={width}/>
							</Row>
						</Row>
					</Row>
				)
			})
	)

	act(render)

	assert.equal(
		document.querySelector('.ancestor').clientWidth,
		width,
	)

	return unmount
}
