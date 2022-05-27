import React from 'react'
import { Layout_context } from './Layout_context.js'
import { padding_to_css } from './lib.js'

/*
	TODO: Layout_context could provide the single value `layout_child_style` rather than an object with only that property, if no other properties are added.
*/
export const Layout_child = props => {
	const {
		// TODO: background={color}. How do we want to represent 'color'? e.g. hsla as [ radians, ratio, ratio, ratio ] ?
		class_name,
		height,
		width,
		offset_x,
		offset_y,
		padding,
		relative,
		style,
		tag: Tag = 'div',
		...pass_through_props
	} = props
	return (
		<Layout_context.Consumer>
			{({ layout_child_style }) =>
				<Tag
					className={class_name}
					style={{
						...layout_child_style (props),

						padding: padding && padding_to_css (padding),

						/* styles to `offset` this element and to position it when its a relative */
						position: relative ? 'absolute' : 'relative',
						// TODO: it might be good for offset_x and offset_y to accept a ratio
						left: relative && relative.x && relative.x[1] * 100 + '%',
						marginRight: relative && relative.x && relative.x[1] * -100 + '%',
						top: relative && relative.y && relative.y[1] * 100 + '%',
						transform: offset_x || offset_y || relative
							&& `translate3d(calc(${(relative?.x?.[0] ?? 0) * -100}% + ${offset_x ?? 0}px), calc(${(relative?.y?.[0] ?? 0) * -100}% + ${offset_y ?? 0}px), 0)`
						,

						...style
					}}
					{...pass_through_props}
				/>
			}
		</Layout_context.Consumer>
	)
}
