import * as assert from 'uvu/assert'
import React, { useEffect, useRef } from 'react'
import { Column, mount_to_body } from '#ui'

export default () => {
	let column
	return mount_to_body
		({})
		(({ unmount }) => {
			const column = useRef(null)
			useEffect(() => {
				assert.equal(
					column.clientWidth,
					0,
					`width={0} column has 0 width, despite its content`
				)
				unmount()
			}, [])
			return (
				<Column dom_ref={column} width={0} style='border: 4px solid red;'>
					<Column>foo bar baz</Column>
				</Column>
			)
		})
}
