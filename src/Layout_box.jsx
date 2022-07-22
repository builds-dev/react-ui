import React from 'react'
import { forwardRef } from 'react'
// import { Layout_child } from './Layout_child.jsx'
import { join_classnames } from './lib.js'
import * as plane from './plane.js'
import { content, format_length, to_css_value } from './length.js'
import { Box_child_style_context } from './Box_child_style_context.js'
import {
	compute_style_as_layout_box,
	compute_style_for_relative_child
} from './layout.js'

const layout_children = (compute_style_for_layout_child, props) => (
	<Box_child_style_context.Provider value={child_props => compute_style_for_layout_child(props, child_props)}>
		{props.children}
	</Box_child_style_context.Provider>
)

const Relative_child = ({ props, child, position }) => (
	<Box_child_style_context.Provider value={child_props => compute_style_for_relative_child(props, child_props, position)}>
		{child}
	</Box_child_style_context.Provider>
)

const relative_position_defaults = { x: [ 0, 0 ], y: [ 0, 0 ], z: plane.foreground }

// TODO: the z ordering may be wrong here... e.g. maybe ascended relatives need to be ordered more precisely in front of all foreground relatives.
const prepare_relatives = props => {
	const background_relatives = []
	const foreground_relatives = []
	let index = 0
	for (const [ input_position, component ] of props.relatives) {
		const position = { ...relative_position_defaults, ...input_position }
		const relative_child = React.createElement(Relative_child, { props, child: component, position, key: index++ })
		position.z === plane.background || position.z === plane.ascended_background
			? background_relatives.push(relative_child)
			: foreground_relatives.push(relative_child)
	}
	return { background_relatives, foreground_relatives }
}

const layout_children_and_relatives = (compute_style_for_layout_child, props) => {
	const { background_relatives, foreground_relatives } = prepare_relatives (props)
	return <>
		{background_relatives}
		{layout_children (compute_style_for_layout_child, props)}
		{foreground_relatives}
	</>
}

/*
	Layout boxes do not know whether they are layout children or relatives, nor anything about their parent.
	A layout box must consume a function from context that interprets its props according to the parent's concerns.
	When the layout box is a layout child, the parent provides a function that takes the child's props and returns layout child style.
	When the layout box is a relative, the parent provides a function that takes the child's props and returns relative style.

	The code could be organized such that a layout box's style is computed in 3 parts:
		- compute_style_as_layout_box - box properties that are not relevant to its role as parent or child e.g padding
		- compute_style_as_layout_parent - box properties that are relevant to its role as layout parent
		- compute_style_as_layout_box_child - box properties that are relevant to its role as box child
	
	For practical reasons, layout box style will also be implemented with a class name:
		- layout_class_name - static style for Layout_box (child or parent), static style as layout parent (flex-direction), semantic name for inspection
*/

const format_props = props => ({
	...props,
	height: props.height == undefined ? content : format_length (props.height),
	width: props.width == undefined ? content : format_length (props.width),
	relatives: props.relatives || [],
	tag: props.tag || 'div'
})

export const Layout_box = forwardRef((_props, ref) => {
	const props = format_props(_props)
	const {
		class_name,
		element_props,
		layout_class_name,
		compute_style_as_layout_parent,
		compute_style_for_layout_child,
		tag: Tag
	} = props
	return (
		<Box_child_style_context.Consumer>
			{compute_style_as_layout_box_child => (
				<Tag
					className={join_classnames(props.layout_class_name, props.class_name)}
					{...element_props}
					ref={ref}
					style={{
						...compute_style_as_layout_parent(props),
						...compute_style_as_layout_box_child(props),
						...compute_style_as_layout_box(props),
						...props.style
					}}
				>
					{layout_children_and_relatives(compute_style_for_layout_child, props)}
				</Tag>
			)}
		</Box_child_style_context.Consumer>
	)
})
