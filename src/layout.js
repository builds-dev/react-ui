import { content } from './length.js'
import { format_length } from './length.js'
import { css } from '@linaria/core'
import * as align from './align.js'
import {
	compute_style_for_isolated_height,
	compute_style_for_isolated_width
} from './Layout_box.jsx'

export const layout_flex = length =>
	length.type === 'flex'
		? length.value.grow + ' ' + length.value.shrink + ' auto'
		: length.type === 'fill'
			? length.value + ' 0 0'
			: '0 0 auto'

const value_for_length = (parent_length, length) =>
	length.type === 'px'
		? length.value + 'px'
		: length.type === 'ratio'
			? parent_length.type === 'flex' ? 0 : (length.value * 100) + '%'
			: undefined

export const compute_style_for_layout_child = (
	main_axis_length_name,
	main_axis_max_length_name,
	main_axis_min_length_name,
	cross_axis_length_name,
	compute_style_for_cross_axis_length,
) => (parent_props, child_props) => {
	const main_axis_length = child_props[main_axis_length_name]
	const parent_main_axis_length = parent_props[main_axis_length_name]
	const { offset_x, offset_y } = child_props
	return {
		flex: layout_flex (main_axis_length),
		[main_axis_length_name]: value_for_length (parent_main_axis_length, main_axis_length),
		[main_axis_max_length_name]: main_axis_length.maximum.value === Infinity ? undefined : value_for_length(parent_main_axis_length, main_axis_length.maximum),
		// NOTE: [main_axis_min_length_name] must be explicitly set in order for `fill` to work on the main axis.
		[main_axis_min_length_name]: value_for_length(parent_main_axis_length, main_axis_length.minimum),
		...compute_style_for_cross_axis_length(child_props[cross_axis_length_name]),
		/* NOTE:
			If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
			also look at these rules in `compute_style_for_relative_child`.
		*/
		position: 'relative',
		transform: (offset_x || offset_y) && 'translate3d(' + offset_x + 'px), calc(' + offset_y + 'px), 0)'
	}
}

export const compute_style_for_layout_x_child = compute_style_for_layout_child ('width', 'maxWidth', 'minWidth', 'height', compute_style_for_isolated_height)

export const compute_style_for_layout_y_child = compute_style_for_layout_child ('height', 'maxHeight', 'minHeight', 'width', compute_style_for_isolated_width)

const cross_axis_align = {
	'flex-start': 'flex-start',
	'center': 'center',
	'flex-end': 'flex-end',
	'space-around': 'center',
	'space-between': 'flex-start',
	'space-evenly': 'center'
}

const contains_size = length => length.type === 'px' || length.type === 'ratio'

export const compute_style_for_layout_parent = (
	gapProperty,
	main_axis_layout = align.start,
	cross_axis_layout = align.start,
	height,
	width,
	overflow
) => ({
	alignItems: cross_axis_align[cross_axis_layout.flex],
	contain: (overflow && overflow.overflowX === 'hidden' && overflow.overflowY === 'hidden' ? 'layout paint' : '')
		+ (height && width && contains_size (height) && contains_size (width) ? ' size' : '')
	,
	justifyContent: main_axis_layout.flex,
	[gapProperty]: main_axis_layout.gap && main_axis_layout.gap + 'px',
	...overflow
})

export const compute_style_for_layout_x_parent = props => compute_style_for_layout_parent(
	'rowGap',
	props.layout_x,
	props.layout_y,
	props.height,
	props.width,
	props.overflow
)

export const compute_style_for_layout_y_parent = props => compute_style_for_layout_parent(
	'columnGap',
	props.layout_y,
	props.layout_x,
	props.height,
	props.width,
	props.overflow
)

export const layout_box_child_css = `
	box-sizing: border-box;
	display: flex;
`

export const column_css = `
	${layout_box_child_css}
	flex-direction: column;
`

export const box = css`
	${column_css}
`

export const column = css`
	${column_css}
`

export const row = css`
	${layout_box_child_css}
	flex-direction: row;
`
