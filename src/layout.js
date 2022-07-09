import { content } from './length.js'
import { to_css_value } from './length.js'
import { css } from '@linaria/core'
import * as align from './align.js'
import { padding_to_css } from './lib.js'

/*
	ratio of main axis of a content-sized parent is incoherent - the parent's size is based on the child, and the child is expressing a ratio of the parent's size.
	ratio should mean "of space determined by the parent", which in this case is 0.
*/
const compute_layout_length = (parent_length, length) =>
	length.type === 'ratio' && parent_length.type === 'grow' ? 0 : to_css_value(length)

export const compute_style_as_layout_box = ({ padding }) => ({
	padding: padding && padding_to_css (padding)
})

/*
	This function takes `to_css_value` so that `compute_style_for_layout_length` can pass a function that accounts for ratio lengths of `content` length parents
*/
const compute_style_for_isolated_length = (length_name, min_length_name) =>
	(length, to_css_value) => {
		const { type, value } = length
		if (type === 'grow') {
			return {
				[length_name]: 'max-content',
				[min_length_name]: value.factor > 0 ? '100%' : 'auto'
			}
		} else if (type === 'fill') {
			return {
				[length_name]: `min(100%, ${to_css_value(value.maximum)})`,
				[min_length_name]: to_css_value(value.minimum)
			}
		} else {
			return {
				[length_name]: to_css_value(length)
			}
		}
	}

const compute_style_for_isolated_height = compute_style_for_isolated_length ('height', 'minHeight')

const compute_style_for_isolated_width = compute_style_for_isolated_length ('width', 'minWidth')

/* NOTE:
	If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
	also look at these properties in `compute_style_for_layout_child`.
*/
export const compute_style_for_relative_child = (props, { height = content, width = content, offset_x = 0, offset_y = 0 }, { x, y, z }) => ({
	left: x[1] * 100 + '%',
	position: 'absolute',
	top: y[1] * 100 + '%',
	// TODO: `transform` isn't necessary when x[0] === 0 && y[0] === 0 && offset_x === 0 && offset_y === 0, but implementing Stack will probably change that.
	transform: `translate3d(calc(${x[0] * -100}% + ${offset_x}px), calc(${y[0] * -100}% + ${offset_y}px), 0)`,
	...compute_style_for_isolated_height(height, to_css_value),
	...compute_style_for_isolated_width(width, to_css_value),
})

const compute_style_for_main_axis_length = (
	max_length_name,
	min_length_name,
	parent_length,
	length,
) => {
	const { type, value } = length
	if (type === 'grow') {
		return {
			flex: value.factor + ' 0 auto'
		}
	} else if (type === 'fill') {
		return {
			flex: value.factor + ' 0 0',
			[max_length_name]: compute_layout_length(parent_length, value.maximum),
			// NOTE: [main_axis_min_length_name] must be explicitly set in order for `fill` to work on the main axis.
			// [min_length_name]: compute_layout_length(parent_length, value.minimum)
			[min_length_name]: 0
		}
	} else {
		return {
			// to use flex-basis to set exact length, the min length must be set to 0
			flex: '0 0 ' + compute_layout_length(parent_length, length),
			[min_length_name]: 0
		}
	}
}

const compute_transform =  ({ offset_x, offset_y }) =>
	(offset_x || offset_y) && 'translate3d(' + offset_x + 'px), calc(' + offset_y + 'px), 0)'

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
		...compute_style_for_main_axis_length (main_axis_max_length_name, main_axis_min_length_name, parent_main_axis_length, main_axis_length),
		...compute_style_for_cross_axis_length(
			child_props[cross_axis_length_name],
			length => compute_layout_length(parent_props[cross_axis_length_name], length)
		),
		/* NOTE:
			If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
			also look at these rules in `compute_style_for_relative_child`.
		*/
		position: 'relative',
		transform: compute_transform (child_props)
	}
}

/*
	`compute_style_for_isolated_[length]` and its `to_css_value` are a bit ugly. Be welcome to refactor.
*/
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
	'columnGap',
	props.layout_x,
	props.layout_y,
	props.height,
	props.width,
	props.overflow
)

export const compute_style_for_layout_y_parent = props => compute_style_for_layout_parent(
	'rowGap',
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
