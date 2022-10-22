import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { css } from '@linaria/core'
import {
	Box_child_height_style_context,
	Box_child_position_style_context,
	Box_child_width_style_context
} from './Box_child_style_context.js'
import {
	compute_height_style_for_layout_x_child,
	compute_position_style_for_layout_child,
	compute_width_style_for_layout_x_child
} from './layout.js'
import { fill } from './length.js'
import { Stack } from './Stack.jsx'

const container_css = `
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: flex-start;
	justify-content: flex-start;
`

const body_css = `
	${container_css}
	min-height: 100vh;
	margin: 0;
	padding: 0;
`

const body_root_element_css = `
	${container_css}
	flex: 1 1 100%;
	align-self: stretch;
`

export const body = css`${body_css}`
export const body_root_element = css`${body_root_element_css}`

const inject_style = string => {
	const style = document.createElement('style')
	style.textContent = string
	document.head.append(style)
	return () => style.remove()
}

export const mount_to_body = options => App => {
	const root_element = document.createElement('div')
	const root = ReactDOM.createRoot(root_element)
	const unmount = () => {
		root.unmount()
		root_element.remove()
		uninject_body_style()
	}
	const create_app = props => (
		<Stack>
			<Box_child_height_style_context.Provider value={compute_height_style_for_layout_x_child (fill)}>
				<Box_child_width_style_context.Provider value={compute_width_style_for_layout_x_child (fill)}>
					<Box_child_position_style_context.Provider value={compute_position_style_for_layout_child}>
						<App {...props}/>
					</Box_child_position_style_context.Provider>
				</Box_child_width_style_context.Provider>
			</Box_child_height_style_context.Provider>
		</Stack>
	)
	root_element.classList.add(body_root_element)
	const uninject_body_style = inject_style(`body { ${body_css} }`)
	document.body.append(root_element)
	return {
		unmount,
		render: props => root.render(create_app(props))
	}
}
