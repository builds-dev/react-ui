import React, { forwardRef } from 'react'
import {
	box,
	compute_style_for_layout_y_parent,
	compute_height_style_for_layout_y_child,
	compute_width_style_for_layout_y_child
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'

/*
	TODO: limit to one child: {React.Children.only(props.children)}
	Multiple words of text count as multiple children, so text cannot be direct children if this is in place.
*/
export const Box = forwardRef(({ children, ...props }, ref) =>
	<Layout_box
		ref={ref}
		layout_class_name={box}
		compute_style_as_layout_parent={compute_style_for_layout_y_parent}
		compute_height_style_for_layout_child={compute_height_style_for_layout_y_child}
		compute_width_style_for_layout_child={compute_width_style_for_layout_y_child}
		{...props}
	>
		{children}
	</Layout_box>
)
