import React from 'react'
import { column, layout_y_style, layout_y_child_style } from './layout.js'
import { Layout_parent } from './Layout_parent.jsx'

export const Column = props =>
	<Layout_parent
		{...props}
		layout_class={column}
		layout_child_style={layout_y_child_style}
		layout_style={layout_y_style}
	/>
