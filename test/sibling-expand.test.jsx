import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, expand, fill, grow, ratio, mount_to_body } from '../src/index.js'
import { act } from './util.js'

const uppercase = string => string[0].toUpperCase() + string.slice(1)

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(({
				Context,
				Expand_Component,
				expand_length_name,
				other_length_name,
				child_expand_length,
				context_expand_length
			}) => {
				return (
					<Box {...{ [expand_length_name]: 200 } }>
						<Context
							class_name='context'
							style={{ background: '#cccccc' }}
							{...{
								[expand_length_name]: context_expand_length,
								[other_length_name]: 75,
							} }
						>
							<Expand_Component
								class_name='expand_sibling'
								style={{ background: '#888888' }}
								{...{
									[other_length_name]: 50,
									[expand_length_name]: expand
								} }
							>
								<Box
									style={{ background: 'lightblue' }}
									{...{
										[expand_length_name]: child_expand_length,
										[other_length_name]: ratio(0.5)
									} }
								>
								</Box>
							</Expand_Component>
							<Box
								class_name='other_sibling'
								style={{ background: 'green' }}
								{...{
									[expand_length_name]: grow,
									[other_length_name]: fill
								} }
							>
								<Box
									style={{ background: 'lightgreen' }}
									{...{
										[expand_length_name]: 50,
										[other_length_name]: fill
									} }
								>
								</Box>
							</Box>
						</Context>
					</Box>
				)
			})
	)

	;[
		{ expand_length_name: 'width', other_length_name: 'height' },
		// { expand_length_name: 'height', other_length_name: 'width' },
	].forEach(({
		expand_length_name,
		other_length_name
	}) => {
		// ;[ 200, fill, grow ].forEach(context_expand_length => {
		;[ 200 ].forEach(context_expand_length => {
			;[
				{ context_component_name: 'Row', Context: Row },
				// { context_component_name: 'Column', Context: Column },
			].forEach(({ context_component_name, Context }) => {
				;[
					{ expand_component_name: 'Row', Expand_Component: Row },
					// { expand_component_name: 'Column', Expand_Component: Column }
				].forEach(({ expand_component_name, Expand_Component }) => {
					// console.log({ context_expand_length, context_component_name, expand_component_name })
					act(() => render({
						Context,
						Expand_Component,
						child_expand_length: 100,
						context_expand_length,
						expand_length_name,
						other_length_name
					}))

					return

					const context = document.querySelector('.context')
					const expand_sibling = document.querySelector('.expand_sibling')
					const other_sibling = document.querySelector('.other_sibling')

					assert.equal(
						parent[`client${uppercase(expand_length_name)}`],
						child[`client${uppercase(expand_length_name)}`],
						`As a ${context_component_name} child, ${expand_component_name} with ${expand_length_name}={expand} is equal to child ${expand_length_name} when that ${expand_length_name} is less than the space available.`
					)

					act(() => render({
						Context,
						Expand_Component,
						child_expand_length: 250,
						context_expand_length,
						expand_length_name,
						other_length_name
					}))

					assert.equal(
						Math.min(
							context[`client${uppercase(expand_length_name)}`],
							child[`client${uppercase(expand_length_name)}`]
						),
						parent[`client${uppercase(expand_length_name)}`],
						`As a ${context_component_name} child, ${expand_component_name} with ${expand_length_name}={expand} is the lesser of the space available and the child's ${expand_length_name}.`
					)
				})
			})
		})
	})

	return unmount
}
