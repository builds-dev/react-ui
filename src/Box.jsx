import React, { forwardRef } from 'react'
import {
	box,
	compute_style_for_layout_y_parent,
	use_computation_y_context_value
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'

/*
	TODO: limit to one child: {React.Children.only(props.children)}
	Multiple words of text count as multiple children, so text cannot be direct children if this is in place.
*/
export const Box = forwardRef(({ children, ...props }, ref) =>
	<Layout_box
		compute_style_as_layout_parent={compute_style_for_layout_y_parent}
		use_computation_context_value={use_computation_y_context_value}
		layout_class_name={box}
		ref={ref}
		{...props}
	>
		{children}
	</Layout_box>
)
