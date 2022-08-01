import React, { forwardRef } from 'react'
import {
	column,
	compute_style_for_layout_y_parent,
	compute_height_style_for_layout_y_child,
	compute_width_style_for_layout_y_child,
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'

export const Column = forwardRef((props, ref) =>
	<Layout_box
		ref={ref}
		layout_class_name={column}
		compute_style_as_layout_parent={compute_style_for_layout_y_parent}
		compute_height_style_for_layout_child={compute_height_style_for_layout_y_child}
		compute_width_style_for_layout_child={compute_width_style_for_layout_y_child}
		{...props}
	/>
)
