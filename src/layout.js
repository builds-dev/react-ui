import { content } from './length.js'
import { to_css_value } from './length.js'
import { css } from '@linaria/core'
import * as align from './align.js'

/*
	ratio of main axis of a content-sized parent is incoherent - the parent's size is based on the child, and the child is expressing a ratio of the parent's size.
	ratio should mean "of space determined by the parent", which in this case is 0.
*/
const compute_layout_length = (parent_length, length) =>
	length.type === 'ratio' && parent_length.type === 'grow' ? 0 : to_css_value(length)

/*
	This function takes `to_css_value` so that `compute_style_for_layout_length` can pass a function that accounts for ratio lengths of `content` length parents
	TODO: try to refactor so the above hopefully won't be necessary
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
				[length_name]: value.factor > 0
					? `min(100%, ${to_css_value(value.maximum)})`
					: '0px'
				,
				[min_length_name]: to_css_value(value.minimum)
			}
		} else {
			return {
				[length_name]: to_css_value(length)
			}
		}
	}

// TODO: can probably get rid of these
const compute_style_for_isolated_height = compute_style_for_isolated_length ('height', 'minHeight')

const compute_style_for_isolated_width = compute_style_for_isolated_length ('width', 'minWidth')

export const compute_position_style_for_relative_child = (
	anchor_x,
	anchor_y,
	offset_x = 0,
	offset_y = 0
) => ({
	position: 'absolute',
	left: anchor_x[1] * 100 + '%',
	top: anchor_y[1] * 100 + '%',
	transform: anchor_x[0] === 0 && anchor_y[0] === 0 && offset_x === 0 && offset_y === 0
		?
			null
		:
			`translate3d(calc(${anchor_x[0] * -100}% + ${offset_x}px), calc(${anchor_y[0] * -100}% + ${offset_y}px), 0)`
})

export const compute_height_style_for_relative_child = height =>
	compute_style_for_isolated_height(height, to_css_value)

export const compute_width_style_for_relative_child = width =>
	compute_style_for_isolated_width(width, to_css_value)

const compute_style_for_main_axis_length = (length_name, max_length_name, min_length_name) =>
	parent_length => length => {
		const { type, value } = length
		if (type === 'grow') {
			return {
				flex: value.factor + ' 0 auto'
			}
		} else if (type === 'fill') {
			return {
				flex: value.factor + ' 0 0',
				[max_length_name]: compute_layout_length(parent_length, value.maximum),
				// [min_length_name] must be explicitly set in order for `fill` to work on the main axis.
				[min_length_name]: 0
			}
		} else {
			return {
				flex: '0 0 auto',
				[length_name]: compute_layout_length(parent_length, length)
			}
		}
	}

export const compute_position_style_for_layout_child = (
	anchor_x,
	anchor_y,
	offset_x,
	offset_y
) => ({
	position: 'relative',
	transform: (offset_x || offset_y) && 'translate3d(' + offset_x + 'px), calc(' + offset_y + 'px), 0)'
})

export const compute_height_style_for_layout_x_child = parent_height => height =>
	compute_style_for_isolated_height(
		height,
		// TODO: it seems pointless/awkward to use this function here... try refactoring
		height => compute_layout_length(parent_height, height)
	)

export const compute_width_style_for_layout_x_child = compute_style_for_main_axis_length ('width', 'maxWidth', 'minWidth')

export const compute_height_style_for_layout_y_child = compute_style_for_main_axis_length ('height', 'maxHeight', 'minHeight')

export const compute_width_style_for_layout_y_child = parent_width => width =>
	compute_style_for_isolated_width(
		width,
		// TODO: it seems pointless/awkward to use this function here... try refactoring
		width => compute_layout_length(parent_width, width)
	)

const cross_axis_align = {
	'flex-start': 'flex-start',
	'center': 'center',
	'flex-end': 'flex-end',
	'space-around': 'center',
	'space-between': 'flex-start',
	'space-evenly': 'center'
}

const contains_size = length => length.type === 'px' || length.type === 'ratio'

export const compute_contain = (height, width, overflow) =>
	(overflow && overflow.overflowX === 'hidden' && overflow.overflowY === 'hidden' ? 'layout paint' : '')
		+ (height && width && contains_size (height) && contains_size (width) ? ' size' : '')

export const compute_style_for_layout_x_parent = (
	layout_x,
	layout_y
) => ({
	alignItems: cross_axis_align[layout_y.flex],
	justifyContent: layout_x.flex,
	columnGap: layout_x.gap && layout_x.gap + 'px',
})

export const compute_style_for_layout_y_parent = (
	layout_x,
	layout_y
) => ({
	alignItems: cross_axis_align[layout_x.flex],
	justifyContent: layout_y.flex,
	rowGap: layout_y.gap && layout_y.gap + 'px',
})

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
