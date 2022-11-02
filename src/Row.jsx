import React, { forwardRef } from 'react'
import {
	row,
	compute_style_for_layout_x_parent,
	compute_height_style_for_layout_x_child,
	compute_width_style_for_layout_x_child
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'
import { css } from '@linaria/core'

const row_height_fill_child_wrapper = css`
	align-self: stretch;
`
const wrap_height_fill_child = (parent_height) => (child, child_height) =>
	child_height.type === 'fill' && (parent_height.type === 'fill' || parent_height.type === 'grow')
		? <div className={row_height_fill_child_wrapper}>{child}</div>
		: child

export const Row = forwardRef((props, ref) =>
	<Layout_box
		ref={ref}
		layout_class_name={row}
		child_transformation={wrap_height_fill_child}
		compute_style_as_layout_parent={compute_style_for_layout_x_parent}
		compute_height_style_for_layout_child={compute_height_style_for_layout_x_child}
		compute_width_style_for_layout_child={compute_width_style_for_layout_x_child}
		{...props}
	/>
)
