import { content } from './length.js'
import { to_css_value } from './length.js'
import { css } from '@linaria/core'
import * as align from './align.js'
import { identity } from './util/identity.js'

/*
	ratio of main axis of a content-sized parent is incoherent - the parent's size is based on the child, and the child is expressing a ratio of the parent's size.
	ratio should mean "of space determined by the parent", which in this case is 0.
*/
const compute_layout_length = (parent_length, length) =>
	length.type === 'ratio' && parent_length.type === 'grow' ? 0 : to_css_value(length)

const compute_style_for_cross_axis_height = (length, parent_length) => {
		const { type, value } = length
		if (type === 'grow') {
			return value.factor > 0
				?
					{
						// `alignSelf: 'stretch'` is necessary because percentage height doesn't work on children of flex rows.
						alignSelf: 'stretch'
					}
				:
					null
		} else if (type === 'fill') {
			return {
				// `[length_name]: 0` prevents content from growing this length.
				height: '0',
				// The desired length is instead expressed by `[min_length_name]`.
				minHeight: value.factor > 0
					? `min(100%, ${compute_layout_length(parent_length, value.maximum)})`
					: '0px'
			}
		} else if (type === 'expand') {
			return {
				maxHeight: '100%'
			}
		} else {
			return {
				height: compute_layout_length(parent_length, length)
			}
		}
	}

const compute_style_for_cross_axis_width = (length, parent_length) => {
	const { type, value } = length
	if (type === 'grow') {
		return value.factor > 0
			?
				{
					minWidth: '100%'
				}
			:
				null
	} else if (type === 'fill') {
		return {
			// `[length_name]: 0` prevents content from growing this length.
			width: '0',
			// The desired length is instead expressed by `[min_length_name]`.
			minWidth: value.factor > 0
				? `min(100%, ${compute_layout_length(parent_length, value.maximum)})`
				: '0px'
		}
	} else if (type === 'expand') {
		return {
			maxWidth: '100%'
		}
	} else {
		return {
			width: compute_layout_length(parent_length, length)
		}
	}
}

// TODO: get rid of all whiteSpace, since that will now be a concern of <Text>
const compute_style_for_relative_length = (length_name, max_length_name, min_length_name, length) => {
		const { type, value } = length
		if (type === 'grow') {
			return {
				// `[length_name]: 'max-content'` prevents text wrapping due to the default value `min-content`
				[length_name]: 'max-content',
				whiteSpace: 'nowrap',
				[min_length_name]: value.factor > 0 ? '100%' : 'auto'
			}
		} else if (type === 'fill') {
			return {
				whiteSpace: 'wrap',
				// `[length_name]: 0` prevents content from growing this length.
				[length_name]: '0',
				// The desired length is instead expressed by `[min_length_name]`.
				[min_length_name]: value.factor > 0
					? `min(100%, ${to_css_value(value.maximum)})`
					: '0px'
			}
		} else if (type === 'expand') {
			return {
				[max_length_name]: '100%'
			}
		} else {
			return {
				whiteSpace: 'wrap',
				[length_name]: to_css_value(length)
			}
		}
	}

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
	compute_style_for_relative_length('height', 'maxHeight', 'minHeight', height)

export const compute_width_style_for_relative_child = width =>
	compute_style_for_relative_length('width', 'maxWidth', 'minWidth', width)

const compute_style_for_x_main_axis_length = parent_length => length => {
		const { type, value } = length
		if (type === 'grow') {
			return {
				flex: value.factor + ' 0 auto'
			}
		} else if (type === 'fill') {
			return {
				flex: value.factor + ' 0 0',
				maxWidth: compute_layout_length(parent_length, value.maximum),
				/*
					The default minimum is `min-content`,
					which means the length will be no less than that of children,
					whereas `fill` should constrain the length to the available space,
					causing the children to overflow when there is not enough space.
				*/
				minWidth: 0
			}
		} else if (type === 'expand') {
			return {
				flex: `0 ${1 / value.factor} 100%`,
				maxWidth: 'max-content',
				minWidth: '0'
			}
		} else {
			return {
				/*
					It is important to distinguish the semantics of `flex-basis` from `width`/`height`.
					flex-basis of a child does not affect the height/width of a flex parent that gets its size from the child.
					If a child is 100px wide, then for its flex parent to wrap around it and be 100px wide, the child must express `width: 100px` rather than `flex-basis: 100px`. If the child sets its width to 100px using flex-basis, then the flex parent that gets its width from that child will be 0px wide.
				*/
				flex: '0 0 auto',
				width: compute_layout_length(parent_length, length)
			}
		}
	}

// This would ideally be the same as for the x axis, but `expand` is problematic.
const compute_style_for_y_main_axis_length = parent_length => length => {
		const { type, value } = length
		if (type === 'grow') {
			return {
				flex: value.factor + ' 0 auto'
			}
		} else if (type === 'fill') {
			return {
				flex: value.factor + ' 0 0',
				maxHeight: compute_layout_length(parent_length, value.maximum),
				minHeight: 0
			}
		} else if (type === 'expand') {
			/*
				TODO: this only produces the desired behavior when there is only a single child (e.g. Box)
			*/
			return {
				flex: `0 ${1 / value.factor} auto`,
				maxHeight: '100%',
				minHeight: '0'
			}
		} else {
			return {
				/*
					It is important to distinguish the semantics of `flex-basis` from `width`/`height`.
					flex-basis of a child does not affect the height/width of a flex parent that gets its size from the child.
					If a child is 100px wide, then for its flex parent to wrap around it and be 100px wide, the child must express `width: 100px` rather than `flex-basis: 100px`. If the child sets its width to 100px using flex-basis, then the flex parent that gets its width from that child will be 0px wide.
				*/
				flex: '0 0 auto',
				height: compute_layout_length(parent_length, length)
			}
		}
	}


export const compute_position_style_for_layout_child = (
	anchor_x,
	anchor_y,
	offset_x = 0,
	offset_y = 0
) => ({
	position: 'relative',
	transform: (offset_x || offset_y) && 'translate3d(' + offset_x + 'px, ' + offset_y + 'px, 0)'
})

export const compute_height_style_for_layout_x_child = parent_height => height =>
	compute_style_for_cross_axis_height(
		height,
		parent_height
	)

export const compute_width_style_for_layout_x_child = compute_style_for_x_main_axis_length // ('width', 'maxWidth', 'minWidth')

export const compute_height_style_for_layout_y_child = compute_style_for_y_main_axis_length // ('height', 'maxHeight', 'minHeight')

export const compute_width_style_for_layout_y_child = parent_width => width =>
	compute_style_for_cross_axis_width(
		width,
		parent_width
	)

// export const compute_wrap_and_length_style_for_layout_x_child = (parent_height, parent_width) => (child_height, child_width) => ({
// 	wrap: identity,
// 	style: {
// 		...compute_height_style_for_layout_x_child (parent_height, child_height),
// 		...compute_width_style_for_layout_x_child (parent_width, child_width)
// 	}
// })

// export const compute_wrap_and_length_style_for_layout_y_child = (parent_height, parent_width) => (child_height, child_width) => ({
// 	wrap: identity,
// 	style: {
// 		...compute_height_style_for_layout_y_child (parent_height, child_height),
// 		...compute_width_style_for_layout_y_child (parent_width, child_width)
// 	}
// })

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

// TODO: expressions within this and/or the functions it calls could `useMemo`
export const use_computation_x_context_value = (height, width) =>
	(child_height, child_width) =>
		[
			compute_height_style_for_layout_x_child (height) (child_height),
			compute_width_style_for_layout_x_child (width) (child_width),
			identity
		]

// TODO: expressions within this and/or the functions it calls could `useMemo`
export const use_computation_y_context_value = (height, width) =>
	(child_height, child_width) =>
		[
			compute_height_style_for_layout_y_child (height) (child_height),
			compute_width_style_for_layout_y_child (width) (child_width),
			identity
		]
