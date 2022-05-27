import React from 'react'
import { css } from '@linaria/core'
import { layout_y_child_style } from './layout.js'
import * as ReactDOM from 'react-dom/client'
import { Layout_context } from './Layout_context.js'
import { grow } from './length.js'

const container_css = `
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	align-items: flex-start;
	justify-content: flex-start;
`

const html_css = `
	height: 100%;
`

const body_css = `
	${container_css}
	margin: 0;
	min-height: 100%;
	padding: 0;
`

const body_root_element_css = `
	${container_css}
	flex: 1 0 auto;
	width: 100%;
`

export const body = css`${body_css}`
export const body_root_element = css`${body_root_element_css}`

const inject_style = string => {
	const style = document.createElement('style')
	style.textContent = string
	document.head.append(style)
	return () => style.remove()
}

export const mount_to_body = props => App => {
	const root_element = document.createElement('div')
	const root = ReactDOM.createRoot(root_element)
	const unmount = () => {
		root.unmount()
		root_element.remove()
		uninject_body_style()
		uninject_html_style()
	}
	let resolve
	const create_app = props => React.createElement(
		Layout_context.Provider,
		{ value: { layout_child_style: child_props => layout_y_child_style ({ ...props, width: grow, height: grow }, child_props) } },
		React.createElement(App, props)
	)
	// checkPropTypes(prop_types, app.props, 'prop', App.name)
	// const app_ui = layout_child(layout_y_child_style, props, app.props.children[0])
	root_element.classList.add(body_root_element)
	const uninject_body_style = inject_style(`body { ${body_css} }`)
	const uninject_html_style = inject_style(`html { ${html_css} }`)
	document.body.append(root_element)
	return {
		unmount,
		render: props => root.render(create_app(props))
	}
}
