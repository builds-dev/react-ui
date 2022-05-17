import React from 'react'
import { Layout_child } from './Layout_child.jsx'
import { padding_to_css } from './lib.js'
import { layout_child } from './layout.js'

export const Layout_parent = ({
	children,
	layout_class,
	layout_child_style,
	layout_style,
	padding = 0,
	...props
}) =>
	<Layout_child
		className={layout_class}
		style={{
			...props.style,
			...layout_style (props),
			padding: padding_to_css (padding)
		}}
	>
		{
			React.Children.map(
				children,
				child =>
					layout_child (layout_child_style, props, child)
			)
		}
	</Layout_child>
