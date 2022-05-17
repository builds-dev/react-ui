import React from 'react'
import { css } from '@linaria/core'
import { layout_child, layout_y_child_style } from './layout.js'
import * as ReactDOM from 'react-dom/client'

const container_css = `
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	align-items: flex-start;
	justify-content: flex-start;
`

const body_css = `
	${container_css}
	margin: 0;
	min-height: 100vh;
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
	const destroy = () => {
		root.unmount()
		root_element.remove()
		uninject_body_style()
	}
	const app = React.createElement(App, { destroy })
	console.log(app)
	// checkPropTypes(prop_types, app.props, 'prop', App.name)
	const app_ui = layout_child(layout_y_child_style, props, app.props.children[0])
	root_element.classList.add(body_root_element)
	const uninject_body_style = inject_style(`body { ${body_css} }`)
	document.body.append(root_element)
	root.render(app)
	return destroy
}
