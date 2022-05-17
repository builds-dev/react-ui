import { content } from './size.js'
import { cloneElement } from 'react'
import { format_size } from './size.js'
import { css } from '@linaria/core'

/*
	TODO: what should `ratio` mean here??
	<Column height={grow}>
		<Column height={ratio(0.5)}></Column>
	</Column>
	It currently gets no height, whereas I naturally expect the child to be half the height of the parent.
	However, that could also be odd because the `grow` parent's size should be based on the child's size.
*/
/*
	In some cases `grow` can be used rather than ratio.
	Possibly the only necessary use of `ratio` is to size an anchored child relative to the parent.
	It's tempting to only allow `ratio` when anchoring, but if `ratio` is going to be a thing anywhere, it ought to have clear semantics that make sense wherever it could be expressed.
	I've also had the idea to express an anchored element with 4 points, which would position, size, and even skew an element,
	but that seems to work out the same as providing a size and skew.
	So as long as it's nice to express layout with flex size, it sounds good to have `ratio`.
*/

export const layout_x_flex = ({ width = content }) =>
	width.type === 'flex'
		? width.value.grow + ' ' + width.value.shrink + ' auto'
		: '0 0 auto' // TODO: `fill`

// TODO: `fill`
export const layout_y_flex = ({ height = content }) =>
	height.type === 'flex'
		? height.value.grow + ' ' + height.value.shrink + ' auto'
		: '0 0 auto'

const value_for_size = (parent_size, size) =>
	size.type === 'px'
		? size.value + 'px'
		: size.type === 'ratio'
			? parent_size.type === 'ratio' ? (size.value * 100) + '%' : '0'
			: 'auto'

export const layout_x_height = (parent_height, height) =>
	(height.type === 'flex' && height.value.grow > 0)
		? '100%'
		: value_for_size(parent_height, height)

export const layout_y_width = (parent_width, width) =>
	(width.type === 'flex' && width.value.grow > 0)
		? '100%'
		: value_for_size(parent_width, width)

// TODO: these === undefined checks can be moved to the calling code
export const layout_y_child_style = (parent_props, { height, width }) => {
	height = height === undefined ? content : format_size(height)
	width = width === undefined ? content : format_size(width)
	return {
		flex: layout_y_flex ({ height }),
		height: value_for_size(parent_props.height, height),
		width: layout_y_width (parent_props.width, width)
	}
}

// TODO: these === undefined checks can be moved to the calling code
export const layout_x_child_style = (parent_props, { height, width }) => {
	height = height === undefined ? content : format_size(height)
	width = width === undefined ? content : format_size(width)
	return {
		flex: layout_x_flex ({ width }),
		height: layout_x_height(parent_props.height, height),
		width: value_for_size (parent_props.wiidth, width)
	}
}

export const layout_child = (layout_child_style, parent_props, child) =>
	cloneElement(
		child,
		{
			style: {
				...layout_child_style (parent_props, child.props),
				...child.props.style
			}
		}
	)

export const layout_child_css = `
	box-sizing: border-box;
	display: flex;
`

export const layout_parent_css = `
	${layout_child_css}
	align-items: flex-start;
`

export const column = css`
	${layout_parent_css}
	flex-direction: column;
`

export const row = css`
	${layout_parent_css}
	flex-direction: row;
`
