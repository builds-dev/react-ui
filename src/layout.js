import { content } from './length.js'
import { format_length } from './length.js'
import { css } from '@linaria/core'
import * as align from './align.js'

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

// TODO: this is wrong - the cross axis style in these cases should be `min[Length_name]: 100%`.
export const value_for_cross_axis_length = (parent_length, length) =>
	(length.type === 'flex' && length.value.grow > 0 || length.type === 'fill')
		? '100%'
		: value_for_length (parent_length, length)

const relative_value_for_length = length =>
	length.type === 'px'
		? length.value + 'px'
		: length.type === 'ratio'
			? (length.value * 100) + '%'
				: (length.type === 'fill' && length.value > 0)
					? '100%'
					: undefined

/*
	TODO: this current implementation is wrong
	relative width/height should be implemented with min/max[Length_name]: 100%, also taking into account the given minimum/maximum boundaries

	[length_name]={grow} should mean min[Length_name]: 100%
	[length_name]={shrink} should mean min[Length_name]: min-content (probably the same as not setting any length?)
	[length_name]={conform} should mean it's at least the length of referenced component (100%) and as small as it can be to fit in the referenced component.
		[length_name]: 100%; min[Length_name]: min-content
*/
const relative_value_for_cross_axis_length = length =>
	(length.type === 'flex' && length.value.grow > 0 || length.type === 'fill')
		? '100%'
		: relative_value_for_length (length)

// TODO: [cross_axis_length]={shrink} probably doesn't work. Test and fix. May require min/max/fit-content (WARNING! height: fit-content does not work on firefox!)
export const layout_child_style = (
	main_axis_length_name,
	Main_axis_length_name,
	cross_axis_length_name,
	Cross_axis_length_name,
) => (parent_props, child_props) => {
	const main_axis_length = child_props[main_axis_length_name] === undefined ? content : format_length(child_props[main_axis_length_name])
	const cross_axis_length = child_props[cross_axis_length_name] === undefined ? content : format_length(child_props[cross_axis_length_name])
	// TODO: this undefined handling should not be a concern of this, and it's inefficient. needs refactor asap.
	const parent_main_axis_length = parent_props[main_axis_length_name] === undefined ? content : format_length(parent_props[main_axis_length_name])
	const parent_cross_axis_length = parent_props[cross_axis_length_name] === undefined ? content : format_length(parent_props[cross_axis_length_name])
	if (child_props.relative) {
		return {
			[cross_axis_length_name]: relative_value_for_cross_axis_length (cross_axis_length),
			[main_axis_length_name]: relative_value_for_length (main_axis_length)
			// ['min' + Cross_axis_length_name]: relative_value_for_length(cross_axis_length.minimum),
			// ['min' + Main_axis_length_name]: value_for_length(main_axis_length.minimum),
			// 	: (length.type === 'flex' && length.value.grow > 0)
		}
	}
	return {
		flex: layout_flex (main_axis_length),
		[cross_axis_length_name]: value_for_cross_axis_length (parent_cross_axis_length, cross_axis_length),
		[main_axis_length_name]: value_for_length (parent_main_axis_length, main_axis_length),
		// NOTE: [`min${Main_axis_length_name}`] must be explicitly set for `fill` to work on the main axis.
		['min' + Cross_axis_length_name]: value_for_length(parent_cross_axis_length, cross_axis_length.minimum),
		['min' + Main_axis_length_name]: value_for_length(parent_main_axis_length, main_axis_length.minimum),
		['max' + Cross_axis_length_name]: cross_axis_length.maximum.value === Infinity ? undefined : value_for_length(parent_cross_axis_length, cross_axis_length.maximum),
		['max' + Main_axis_length_name]: main_axis_length.maximum.value === Infinity ? undefined : value_for_length(parent_main_axis_length, main_axis_length.maximum)
	}
}

export const layout_x_child_style = layout_child_style ('width', 'Width', 'height', 'Height')

export const layout_y_child_style = layout_child_style ('height', 'Height', 'width', 'Width')

const cross_axis_align = {
	'flex-start': 'flex-start',
	'center': 'center',
	'flex-end': 'flex-end',
	'space-around': 'center',
	'space-between': 'flex-start',
	'space-evenly': 'center'
}

const contains_size = length => length.type === 'px' || length.type === 'ratio'

export const layout_style = (main_axis_layout = align.start, cross_axis_layout = align.start, height, width, overflow) => ({
	alignItems: cross_axis_align[cross_axis_layout.flex],
	contain: 'layout'
		+ (overflow && overflow.overflowX === 'hidden' && overflow.overflowY === 'hidden' ? ' paint' : '')
		+ (height && width && contains_size (height) && contains_size (width) ? ' size' : '')
	,
	rowGap: main_axis_layout.gap && main_axis_layout.gap + 'px',
	justifyContent: main_axis_layout.flex,
	...overflow
})

export const layout_x_style = props => layout_style(props.layout_x, props.layout_y, props.height, props.width, props.overflow)

export const layout_y_style = props => layout_style(props.layout_y, props.layout_x, props.height, props.width, props.overflow)

export const layout_child_css = `
	box-sizing: border-box;
	display: flex;
`

export const layout_parent_css = `
	${layout_child_css}
`

export const column = css`
	${layout_parent_css}
	flex-direction: column;
`

export const row = css`
	${layout_parent_css}
	flex-direction: row;
`

export const box = css`
	${layout_parent_css}
	flex-direction: column;
`
