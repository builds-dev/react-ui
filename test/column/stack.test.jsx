import * as assert from 'uvu/assert'
import React from 'react'
import { Box, Column, Row, align, content, edges, fill, ratio, grow, mount_to_body } from '#ui'
import { act, rendered_px_equal } from '../../test/util.js'

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
								<Box
									ascended={[
										<Box
											class_name='child'
											anchor_x={[ 0, 1 ]}
											anchor_y={[ 0, 1 ]}
											height={fill}
											width={ratio(0.5)}
											layout_x={align.center}
											layout_y={align.center}
											padding={edges (20)}
											style={{ background: 'rgb(32, 35, 42)', border: '3px solid rgb(22, 24, 29)', opacity: 0.925 }}
										>
											<img
												src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
												style={{ height: '100px', width: '100px' }}
											/>
										</Box>
									]}
									height={fill} width={fill} style={{ background: colors.a }}
								></Box>
								<Box height={fill} width={fill} style={{ background: colors.b }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.c }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.d }}></Box>
							</Row>
							<Row height={100} width={fill} layout_x={align.start({ gap: 20 })} layout_y={align.start({ gap: 20 })}>
								<Box height={fill} width={fill} style={{ background: colors.a }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.b }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.c }}></Box>
								<Box height={fill} width={fill} style={{ background: colors.d }}></Box>
							</Row>
						</Column>
					</Box>
				)
			})
	)

	act(render)

	return unmount
}
