import React from 'react'
import { css } from '@linaria/core'
import { Column, Row, mount_to_body, ratio, content, fill, grow } from '../../src/index.js'

export default () =>
	mount_to_body
		({})
		(({ destroy }) =>
			<Column height={200} width={grow} style={{ border: '4px solid orange' }}>
				<Column height={grow} width={grow} style={{ border: '4px solid red' }}>
					<Row height={grow} width={grow}>
						<Row width={grow} style={{ border: '4px solid lightgreen' }}><p>foo</p></Row>
						<Row height={grow} width={grow} style={{ border: '4px solid lightblue' }}><p>foo</p></Row>
						<Column style={{ border: '4px solid lightblue' }}>
							<p>foo</p>
							<button onClick={destroy}>Close</button>
						</Column>
					</Row>
				</Column>
				<Column height={ratio(1)} style={{ border: '4px solid lightblue' }}>
					<p>foo</p>
				</Column>
			</Column>
		)
