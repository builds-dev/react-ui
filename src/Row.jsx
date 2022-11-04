import React, { forwardRef } from 'react'
import {
	row,
	compute_style_for_layout_x_parent,
	compute_height_style_for_layout_x_child,
	compute_width_style_for_layout_x_child,
} from './layout.js'
import { Layout_box } from './Layout_box.jsx'
import { css } from '@linaria/core'
import { identity } from './util/identity.js'

const row_height_fill_child_wrapper = css`
	align-self: stretch;
	& > * {
		height: 100%;
	}
`

const wrap = (component, parent_width, child_width) =>
	<div
		className={row_height_fill_child_wrapper}
		style={compute_width_style_for_layout_x_child (parent_width) (child_width)}
	>
		{component}
	</div>

const wrap_height_fill_child = (height, width) =>
	(child_height, child_width) =>
		child_height.type === 'fill'
			?
				[
					compute_height_style_for_layout_x_child (height) (child_height),
					null,
					component => wrap (component, width, child_width)
				]
			:
				not_wrapped
					(height, width)
					(child_height, child_width)

const not_wrapped = (height, width) => (child_height, child_width) => [
	compute_height_style_for_layout_x_child (height) (child_height),
	compute_width_style_for_layout_x_child (width) (child_width),
	identity
]

// TODO: expressions within this and/or the functions it calls could `useMemo`
const use_computation_context_value = (height, width) =>
	(height.type === 'grow'
		? wrap_height_fill_child
		: not_wrapped
	)
	(height, width)

export const Row = forwardRef((props, ref) =>
	<Layout_box
		compute_style_as_layout_parent={compute_style_for_layout_x_parent}
		use_computation_context_value={use_computation_context_value}
		layout_class_name={row}
		ref={ref}
			{...props}
	/>
)
