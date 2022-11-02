import React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	Box_child_height_style_context,
	Box_child_position_style_context,
	Box_child_width_style_context
} from './Box_child_style_context.js'
import { Box_transformation_context } from './Box_transformation_context.js'
import {
	compute_height_style_for_layout_x_child,
	compute_position_style_for_layout_child,
	compute_width_style_for_layout_x_child
} from './layout.js'
import { fill } from './length.js'
import { Stack } from './Stack.jsx'
import { identity } from './util/identity.js'

// TODO: accept only one child!
export const Ui_Context = ({ children }) => (
	<Stack>
		<Box_child_height_style_context.Provider value={compute_height_style_for_layout_x_child (fill)}>
			<Box_child_width_style_context.Provider value={compute_width_style_for_layout_x_child (fill)}>
				<Box_child_position_style_context.Provider value={compute_position_style_for_layout_child}>
					<Box_transformation_context.Provider value={identity}>
						{ children }
					</Box_transformation_context.Provider>
				</Box_child_position_style_context.Provider>
			</Box_child_width_style_context.Provider>
		</Box_child_height_style_context.Provider>
	</Stack>
)
