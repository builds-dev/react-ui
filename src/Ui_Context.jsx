import React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	Box_child_computation_context,
	Box_child_position_style_context
} from './Box_child_style_context.js'
import {
	compute_height_style_for_layout_x_child,
	compute_position_style_for_layout_child,
	compute_width_style_for_layout_x_child,
} from './layout.js'
import { fill } from './length.js'
import { Stack } from './Stack.jsx'
import { identity } from './util/identity.js'

// TODO: expressions within this and/or the functions it calls could `useMemo`
const child_computation_context_value = (height, width) => [
	compute_height_style_for_layout_x_child (fill) (height),
	compute_width_style_for_layout_x_child (fill) (width),
	identity
]

// TODO: accept only one child!
export const Ui_Context = ({ children }) => (
	<Stack>
		<Box_child_computation_context.Provider value={child_computation_context_value}>
			<Box_child_position_style_context.Provider value={compute_position_style_for_layout_child}>
				{ children }
			</Box_child_position_style_context.Provider>
		</Box_child_computation_context.Provider>
	</Stack>
)
