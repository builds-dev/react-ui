// import Layout_context, { get_layout_context } from './Layout_context.svelte'
// import { element, element_style } from './element'
// import { content, format_length } from './length'
// import { concat as classname_concat } from './util/classname'
import React from 'react'
import { css } from '@linaria/core'

/*
	height: ${props => props.context_height(props)};
	flex: ${props => props.context_flex(props)};
	max-height: ${props => value_for_max(props.height.max)};
	min-height: ${props => value_for_modifier(props.height.min)};
	overflow-x: ${({ overflow }) => overflow_x[overflow || visible]};
	overflow-y: ${({ overflow }) => overflow_y[overflow || visible]};
*/

export const Element = ({ children, style }) => {
	return (
		<div className={element} style={style}>{ children }</div>
	)
}
