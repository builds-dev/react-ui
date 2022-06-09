import React from 'react'
import { forwardRef } from 'react'
// import { Layout_child } from './Layout_child.jsx'
import { join_classnames } from './lib.js'
import * as plane from './plane.js'
import { padding_to_css } from './lib.js'
import { content, format_length } from './length.js'
import { Box_child_style_context } from './Box_child_style_context.js'

const compute_style_as_layout_box = ({ padding }) => ({
	padding: padding && padding_to_css (padding)
})

/* NOTE:
	If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
	also look at these rules in `compute_style_for_layout_child`.
*/

/*
	TODO: px|ratio.value_css is awkward.
*/
const compute_style_for_isolated_length = (length_name, max_length_name, min_length_name) =>
	({ type, value, value_css, minimum, maximum }) => {
		if (type === 'flex') {
			if (value.shrink > 0) {
				if (value.grow > 0) {
					// conform
					return {
						[length_name]: 'min-content',
						[min_length_name]: `max(min(100%, ${maximum.value_css}), ${minimum.value_css}`
					}
				} else {
					// shrink
					return {
						[length_name]: 'max-content',
						/*
							TODO: if only this would work :/
								```
								[min_length_name]: `max(min-content, ${minimum.value_css})`,
								```
								If that or something equivalent is ever possible, isolated length shrink can be implemented without an extra element.
						*/
						[min_length_name]: 'min-content',
						[max_length_name]: `min(100%, ${maximum.value_css})`,
					}
				}
			} else {
				// grow/content
				return {
					[length_name]: 'max-content',
					[min_length_name]: value.grow > 0
						? `max(100%, ${minimum.value_css}` // grow
						: minimum.value_css // content
					,
					[max_length_name]: maximum.value_css,
				}
			}
		} else if (type === 'ratio' || type === 'px') {
			return {
				[length_name]: value_css,
				[max_length_name]: maximum.value_css,
				[min_length_name]: minimum.value_css
			}
		} else if (type === 'fill') {
			return {
				[length_name]: '100%',
				[max_length_name]: maximum.value_css,
				[min_length_name]: minimum.value_css
			}
		}
	}

export const compute_style_for_isolated_height = compute_style_for_isolated_length ('height', 'maxHeight', 'minHeight')
export const compute_style_for_isolated_width = compute_style_for_isolated_length ('width', 'maxWidth', 'minWidth')

const compute_style_for_relative_child = (props, { height = content, width = content, offset_x = 0, offset_y = 0 }, { x, y, z }) => ({
	left: x[1] * 100 + '%',
	position: 'absolute',
	top: y[1] * 100 + '%',
	// TODO: `transform` isn't necessary when x[0] === 0 && y[0] === 0 && offset_x === 0 && offset_y === 0, but implementing Stack will probably change that.
	transform: `translate3d(calc(${x[0] * -100}% + ${offset_x}px), calc(${y[0] * -100}% + ${offset_y}px), 0)`,
	...compute_style_for_isolated_height(height),
	...compute_style_for_isolated_width(width),
})

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
	height: props.height ? format_length (props.height) : content,
	width: props.width ? format_length (props.width) : content,
	tag: props.tag || 'div'
})

export const Layout_box = forwardRef((_props, ref) => {
	const props = format_props(_props)
	const {
		class_name,
		layout_class_name,
		compute_style_as_layout_parent,
		compute_style_for_layout_child,
		tag: Tag
	} = props
	/*
		TODO: with only one element, shrink can only be implemented correctly on a flex child for the main axis of its flex parent
		For isolated lengths (both lengths of relatives or or cross axis length of layout children), a correct implementation of `shrink` requires an additional element.
		For a Column, the isolated length is `width`,
		For a Row, the isolated length is `height`.
		For a relative, the isolated lengths are `height` and `width`.
		The implementation should check whether a length is isolated (this knowledge comes from the parent), and whether that length's value is `shrink`.
		If there is a shrink value for an isolated length, output the extra dom node with whatever other styles are necessary in that case,
		otherwise use the single-element implementation that works for all other cases.
	*/
	return (
		<Box_child_style_context.Consumer>
			{compute_style_as_layout_box_child => (
				<Tag
					className={join_classnames(props.layout_class_name, props.class_name)}
					ref={ref}
					style={{
						...compute_style_as_layout_parent(props),
						...compute_style_as_layout_box_child(props),
						...compute_style_as_layout_box(props),
						...props.style
					}}
				>
					{props.relatives && props.relatives.length > 0
						? layout_children_and_relatives(compute_style_for_layout_child, props)
						: layout_children(compute_style_for_layout_child, props)
					}
				</Tag>
			)}
		</Box_child_style_context.Consumer>
	)
})
