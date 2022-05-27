import React from 'react'
import { Layout_child } from './Layout_child.jsx'
import { join_classnames } from './lib.js'
import { Layout_context } from './Layout_context.js'
import * as plane from './plane.js'

const ordered_children_and_relatives = (children, relatives) => {
	if (relatives === undefined || relatives.length === 0) {
		return children
	}
	const react_children = React.Children.toArray(children)
	let index = 0
	for (const [ position, component ] of relatives) {
		const relative = React.cloneElement(component, { key: index++, relative: position })
		position.z === plane.background || position.z === plane.ascended_background
			? react_children.unshift(relative)
			: react_children.push(relative)
	}
	return react_children
}

// TODO: Layout_parent and Layout_child should probably be just one thing: Layout_component
export const Layout_parent = ({
	children,
	class_name,
	layout_class,
	layout_child_style,
	layout_style,
	relatives,
	style,
	...props
}) => {
	const {
		layout_x,
		layout_y,
		overflow,
		...pass_through_props
	} = props
	return (
		<Layout_child
			class_name={join_classnames(layout_class, class_name)}
			style={{
				...layout_style (props),
				...style
			}}
			{...pass_through_props}
		>
			<Layout_context.Provider
				value={{
					layout_child_style: child_props => layout_child_style (props, child_props)
				}}
			>
				{ordered_children_and_relatives(children, relatives)}
			</Layout_context.Provider>
		</Layout_child>
	)
}
