import React, {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { join_classnames } from './lib.js'
import { content, format_length, to_css_value } from './length.js'
import {
	Box_child_computation_context,
	Box_child_position_style_context
} from './Box_child_style_context.js'
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

const call5 = (f, a, b, c, d, e) => f(a, b, c, d, e)
const create_object = () => Object.create(null)

export const combine_component_styles = (
	contain,
	overflow,
	padding,
	style_as_layout_parent,
	height_style_as_layout_box_child,
	width_style_as_layout_box_child,
	position_style_as_layout_box_child,
	prop_style
) => ({
	contain,
	padding,
	...overflow,
	...style_as_layout_parent,
	...height_style_as_layout_box_child,
	...width_style_as_layout_box_child,
	...position_style_as_layout_box_child,
	...prop_style
})

const relative_child_computation_context_value = (height, width) => [
	compute_height_style_for_relative_child (height),
	compute_width_style_for_relative_child (width),
	identity
]

const with_default_key = (x, default_key) => x.key === null ? React.cloneElement(x, { key: default_key }) : x
const prepare_relatives = relatives =>
	relatives
		?
			<Box_child_computation_context.Provider value={relative_child_computation_context_value}>
				<Box_child_position_style_context.Provider value={compute_position_style_for_relative_child}>
					{relatives.map(with_default_key)}
				</Box_child_position_style_context.Provider>
			</Box_child_computation_context.Provider>
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
		children,
		class_name,
		compute_style_as_layout_parent,
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
		use_computation_context_value,
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

	const compute_position_style_as_layout_box_child = useContext(Box_child_position_style_context)
	const [
		height_style_as_layout_box_child,
		width_style_as_layout_box_child,
		context_transform
	] = useContext(Box_child_computation_context)(height, width)

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

	const stack = useContext(Stack_context)
	const [ state ] = useState(create_object)

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
			return () => {
				if (state.stack && ascended.length === 0 && descended.length === 0) {
					state.stack.unregister()
					state.stack = null
				}
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
			return () => {
				if (state.stack && ascended.length === 0 && descended.length === 0) {
					state.stack.unregister()
					state.stack = null
				}
			}
		},
		[ descended, ref.current ]
	)

	useEffect(
		() => () => state.stack && state.stack.unregister(),
		[]
	)

	const style = map_all
		(combine_component_styles)
		(
			contain,
			overflow,
			padding,
			style_as_layout_parent,
			height_style_as_layout_box_child,
			width_style_as_layout_box_child,
			position_style_as_layout_box_child,
			prop_style
		)

	const child_computation_context_value = use_computation_context_value(height, width)

	const background = map (prepare_relatives) (prop_background)
	const foreground = map (prepare_relatives) (prop_foreground)

	return context_transform(
		<Tag
			{...element_props}
			className={className}
			ref={ref}
			style={style}
		>
			{background}
			<Box_child_computation_context.Provider value={child_computation_context_value}>
				<Box_child_position_style_context.Provider value={compute_position_style_for_layout_child}>
					{children}
				</Box_child_position_style_context.Provider>
			</Box_child_computation_context.Provider>
			{foreground}
		</Tag>
	)
})
