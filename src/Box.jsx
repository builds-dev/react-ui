import React from 'react'
import { box, layout_y_style, layout_y_child_style } from './layout.js'
import { Layout_parent } from './Layout_parent.jsx'

// TODO: use propTypes to limit to one child
export const Box = props =>
	<Layout_parent
		{...props}
		layout_class={box}
		layout_child_style={layout_y_child_style}
		layout_style={layout_y_style}
	/>
