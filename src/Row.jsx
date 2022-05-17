import React from 'react'
import { row, layout_x_child_style } from './layout.js'
import { Layout_parent } from './Layout_parent.jsx'

const row_style = ({ gap }) => ({
	gap: `${gap}px 0`
})

export const Row = props =>
	<Layout_parent
		{...props}
		layout_class={row}
		layout_child_style={layout_x_child_style}
		layout_style={row_style}
	/>
