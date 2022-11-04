import React, { forwardRef } from 'react'
import {
	column,
	compute_style_for_layout_y_parent,
	use_computation_y_context_value
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'

export const Column = forwardRef((props, ref) =>
	<Layout_box
		compute_style_as_layout_parent={compute_style_for_layout_y_parent}
		use_computation_context_value={use_computation_y_context_value}
		layout_class_name={column}
		ref={ref}
		{...props}
	/>
)
