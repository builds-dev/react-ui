import React, { useContext, useImperativeHandle, useMemo, useRef } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { join_classnames } from './lib.js'
import { content, format_length, to_css_value } from './length.js'
import {
	Box_child_height_style_context,
	Box_child_position_style_context,
	Box_child_width_style_context
} from './Box_child_style_context.js'
import { Box_transformation_context } from './Box_transformation_context.js'
import {
	compute_contain,
	compute_position_style_for_layout_child,
	compute_height_style_for_relative_child,
	compute_width_style_for_relative_child,
	compute_position_style_for_relative_child
} from './layout.js'
import * as align from './align.js'
import { padding_to_css } from './lib.js'
import { Stack_context } from './Stack.jsx'
import { map, map_all } from './util/react.js'
import { identity } from './util/identity.js'

const call = (f, x) => f(x)
const call5 = (f, a, b, c, d, e) => f(a, b, c, d, e)

const prepare_relatives = relatives =>
	relatives
		?
			<Box_child_height_style_context.Provider value={compute_height_style_for_relative_child}>
				<Box_child_width_style_context.Provider value={compute_width_style_for_relative_child}>
					<Box_child_position_style_context.Provider value={compute_position_style_for_relative_child}>
						<Box_transformation_context.Provider value={identity}>
							{relatives.map((x, index) => x.key === null ? React.cloneElement(x, { key: index }) : x)}
						</Box_transformation_context.Provider>
					</Box_child_position_style_context.Provider>
				</Box_child_width_style_context.Provider>
			</Box_child_height_style_context.Provider>
		:
			null

/*
	Layout boxes do not know whether they are layout children or relatives, nor anything about their parent.
	A layout box must consume a function from context that interprets its props according to the parent's concerns.
	A layout box's parent provides a function that takes the child's props and returns style computed from props of the parent and the child.
	When the layout box is a relative, the parent provides a function that takes the child's props and returns relative style.

	layout box's style has 3 main parts:
		- compute_style_as_layout_box - box properties that are not relevant to its role as parent or child e.g padding
		- compute_style_as_layout_parent - box properties that are relevant to its role as layout parent
		- compute_style_as_layout_box_child - box properties that are relevant to its role as box child
	
	For practical/performance reasons, the code is not cleanly organized/abstracted as discussed here,
	and layout box style is also implemented with a class name:
		- layout_class_name - static style for Layout_box (child or parent), static style as layout parent (flex-direction), semantic name for inspection
*/

/*
	These props are passed in by Box, Column, and Row, and never change:
		- layout_class_name
		- compute_style_as_layout_parent
		- compute_height_style_for_layout_child
		- compute_width_style_for_layout_child

	Row passes this so that it can wrap height fill children when necessary, and it never changes:
	- child_transformation
*/

const anchor_default = [ 0, 0 ]
const prepare_anchor = x => x || anchor_default
const prepare_layout = x => x || align.start
const prepare_length = x => x == undefined ? content : format_length (x)
const prepare_padding = x => x && padding_to_css (x)
const prepare_tag = x => x || 'div'

export const Layout_box = forwardRef((
	{
		ascended,
		anchor_x: prop_anchor_x,
		anchor_y: prop_anchor_y,
		background: prop_background,
		child_transformation: prop_child_transformation,
		children,
		class_name,
		compute_style_as_layout_parent,
		compute_height_style_for_layout_child,
		compute_width_style_for_layout_child,
		descended,
		element_props,
		foreground: prop_foreground,
		height: prop_height,
		layout_class_name,
		layout_x: prop_layout_x,
		layout_y: prop_layout_y,
		padding: prop_padding,
		offset_x,
		offset_y,
		overflow,
		style: prop_style,
		tag,
		width: prop_width,
	},
	_ref
) => {
	const ref = useRef()

	useImperativeHandle(_ref, () => ref.current)

	const anchor_x = map (prepare_anchor) (prop_anchor_x)
	const anchor_y = map (prepare_anchor) (prop_anchor_y)
	const height = map (prepare_length) (prop_height)
	const layout_x = map (prepare_layout) (prop_layout_x)
	const layout_y = map (prepare_layout) (prop_layout_y)
	const padding = map (prepare_padding) (prop_padding)
	const Tag = map (prepare_tag) (tag)
	const width = map (prepare_length) (prop_width)

	const compute_height_style_as_layout_box_child = useContext(Box_child_height_style_context)
	const compute_position_style_as_layout_box_child = useContext(Box_child_position_style_context)
	const compute_width_style_as_layout_box_child = useContext(Box_child_width_style_context)
	const context_transformation = useContext(Box_transformation_context)
	const child_transformation = prop_child_transformation
		?
			map
			(prop_child_transformation)
			(height)
		: identity

	const className = map (x => join_classnames(layout_class_name, x)) (class_name)

	const contain = map_all
		(compute_contain)
		(height, width, overflow)

	const style_as_layout_parent = map_all
		(compute_style_as_layout_parent)
		(
			layout_x,
			layout_y
		)

	const height_style_as_layout_box_child = map_all
		(call)
		(
			compute_height_style_as_layout_box_child,
			height
		)

	const position_style_as_layout_box_child = map_all
		(call5)
		(
			compute_position_style_as_layout_box_child,
			anchor_x,
			anchor_y,
			offset_x,
			offset_y,
			ref.current
		)

	const width_style_as_layout_box_child = map_all
		(call)
		(
			compute_width_style_as_layout_box_child,
			width
		)

	const stack = useContext(Stack_context)
	const [ state ] = useState(() => ({}))

	useEffect(
		() => {
			if (!ref.current) {
				return
			}
			if (ascended && ascended.length && !state.stack) {
				state.stack = stack.register(ref.current)
			}
			if (state.stack) {
				state.stack.update_ascendants(ascended || [])
			}
		},
		[ ascended, ref.current ]
	)

	useEffect(
		() => {
			if (!ref.current) {
				return
			}
			if (descended && descended.length && !state.stack) {
				state.stack = stack.register(ref.current)
			}
			if (state.stack) {
				state.stack.update_descendants(descended || [])
			}
		},
		[ descended, ref.current ]
	)

	const style = map_all
		((
			contain,
			overflow,
			padding,
			style_as_layout_parent,
			height_style_as_layout_box_child,
			position_style_as_layout_box_child,
			width_style_as_layout_box_child,
			prop_style
		) => ({
			contain,
			padding,
			...overflow,
			...style_as_layout_parent,
			...height_style_as_layout_box_child,
			...position_style_as_layout_box_child,
			...width_style_as_layout_box_child,
			...prop_style
		}))
		(
			contain,
			overflow,
			padding,
			style_as_layout_parent,
			height_style_as_layout_box_child,
			position_style_as_layout_box_child,
			width_style_as_layout_box_child,
			prop_style
		)

	const box_child_height_style_context_value = map
		(compute_height_style_for_layout_child)
		(height)

	const box_child_width_style_context_value = map
		(compute_width_style_for_layout_child)
		(width)

	const background = map (prepare_relatives) (prop_background)
	const foreground = map (prepare_relatives) (prop_foreground)

	return context_transformation(
		<Tag
			{...element_props}
			className={className}
			ref={ref}
			style={style}
		>
			{background}
			<Box_child_height_style_context.Provider value={box_child_height_style_context_value}>
				<Box_child_width_style_context.Provider value={box_child_width_style_context_value}>
					<Box_child_position_style_context.Provider value={compute_position_style_for_layout_child}>
						<Box_transformation_context.Provider value={child_transformation}>
							{children}
						</Box_transformation_context.Provider>
					</Box_child_position_style_context.Provider>
				</Box_child_width_style_context.Provider>
			</Box_child_height_style_context.Provider>
			{foreground}
		</Tag>,
		height
	)
})
