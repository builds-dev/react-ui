import React from 'react'
import { row, layout_x_style, layout_x_child_style } from './layout.js'
import { Layout_parent } from './Layout_parent.jsx'

export const Row = props =>
	<Layout_parent
		{...props}
		layout_class={row}
		layout_child_style={layout_x_child_style}
		layout_style={layout_x_style}
	/>
