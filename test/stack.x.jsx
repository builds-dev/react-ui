import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, Stack, align, content, edges, fill, ratio, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

// TODO: this test won't pass when run with the others and there are lots of warnings regarding act()

const colors = {
	a: 'rgb(185, 139, 103)',
	b: 'rgb(74, 150, 190)',
	c: '#7d6ba0',
	d: '#a8607a',
	e: '#1f2026',
	f: '#0b0b0d',
	g: '#77e2fb'
}

export default async () => {
	const { unmount, render } = await act(() =>
		mount_to_body
			({})
			(() => {
				return (
					<Box height={fill} width={fill} layout_x={align.center} layout_y={align.center}>
						<Column width={fill} layout_y={align.start({ gap: 20 })}>
							<Row height={100} width={fill} layout_x={align.start({ gap: 20 })} layout_y={align.start({ gap: 20 })}>
								<Box height={fill} width={fill} style={{ background: colors.a }}></Box>
								<Box
									ascended={[
										<Box
											class_name='ascended'
											anchor_x={[ 1, 0 ]}
											anchor_y={[ 0, 1 ]}
											height={fill}
											width={ratio(0.5)}
											layout_x={align.center}
											layout_y={align.center}
											padding={edges (20)}
											style={{ background: 'rgb(32, 35, 42)', border: '3px solid rgb(22, 24, 29)', opacity: 0.925 }}
										>
										</Box>
									]}
									height={fill}
									width={fill}
									style={{ background: colors.b, border: '3px solid rgb(22, 24, 29)' }}
								></Box>
								<Box height={fill} width={fill} style={{ background: colors.c }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.d }}></Box>
							</Row>
							<Stack>
								<Row height={100} width={fill} layout_x={align.start({ gap: 20 })} layout_y={align.start({ gap: 20 })}>
									<Box height={fill} width={fill} style={{ background: colors.d }}></Box>
									<Box height={fill} width={fill} style={{ background: colors.c }}></Box>
									<Box
										descended={[
											<Box
												class_name='descended'
												anchor_x={[ 0, 1 ]}
												anchor_y={[ 1, 0 ]}
												height={fill}
												width={ratio(0.5)}
												layout_x={align.center}
												layout_y={align.center}
												padding={edges (20)}
												style={{ background: 'rgb(32, 35, 42)', border: '3px solid rgb(22, 24, 29)', opacity: 0.925 }}
											>
											</Box>
										]}
										height={fill}
										width={fill}
										style={{ background: colors.b, border: '3px solid rgb(22, 24, 29)' }}
									></Box>
									<Box height={fill} width={fill} style={{ background: colors.a }}></Box>
								</Row>
							</Stack>
						</Column>
					</Box>
				)
			})
	)

	act(render)

	await new Promise(resolve => setTimeout(resolve, 100))

	const ascended = document.querySelector('.ascended')
	const descended = document.querySelector('.descended')

	;(() => {
		const { bottom, left } = ascended.getBoundingClientRect()

		assert.ok(
			Object.is(
				document.elementFromPoint(left, bottom - 1),
				ascended
			),
			'ascended element is in front'
		)
	})()

	;(() => {
		const { right, top } = descended.getBoundingClientRect()

		assert.ok(
			Object.is(
				document.elementFromPoint(right - 1, top),
				descended
			),
			'descended element is behind'
		)
	})

	return unmount
}
