import * as assert from 'uvu/assert'
import React, { useState } from 'react'
import { Box, Column, Row, align, edges, fill, ratio, overflow, mount_to_body } from '../src/index'
import { act, rendered_px_equal } from './util.js'

const X = () => {
	const [ _overflow, setOverflow ] = useState(false)
	return (
		/*
		<Column height={fill} width={fill} padding={edges.y(20)} overflow={overflow.scroll()} style={{ border: '4px solid pink' }}>
			<Column height={fill} width={ratio(_overflow ? 1.02 : 1)} padding={edges.y(0)} style={{ border: '4px solid orange' }}>
				<Box style={{ border: '4px solid red' }}>Hello</Box>
				<Box height={fill}>
					<button onClick={() => setOverflow(!_overflow)}>toggle</button>
				</Box>
				<Box style={{ border: '4px solid red' }}>Hello</Box>
			</Column>
		</Column>
		*/
		<Column 
			relatives={[
				[
					{},
					<Column height={fill} width={ratio(_overflow ? 1.02 : 1)} padding={edges.y(0)} style={{ border: '4px solid orange' }}>
						<Box style={{ border: '4px solid red' }}>Hello</Box>
						<Box height={fill}>
							<button onClick={() => setOverflow(!_overflow)}>toggle</button>
						</Box>
						<Box style={{ border: '4px solid red' }}>Hello</Box>
					</Column>
				]
			]}
			height={fill} width={fill} padding={edges.y(0)} overflow={overflow.scroll()} style={{ border: '4px solid pink' }}>
		</Column>
	)
}

export default async () => {
	const { unmount, render } = mount_to_body
		({})
		(() => {
			return (
				<X/>
			)
		})

	render()

	return unmount
}
