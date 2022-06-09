import React from 'react'
import { row, compute_style_for_layout_x_parent, compute_style_for_layout_x_child } from './layout.js'
import { Layout_box } from './Layout_box.jsx'

export const Row = props =>
	<Layout_box
		layout_class_name={row}
		compute_style_as_layout_parent={compute_style_for_layout_x_parent}
		compute_style_for_layout_child={compute_style_for_layout_x_child}
		{...props}
	/>
