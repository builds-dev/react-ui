import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { css } from '@linaria/core'
import { inject_style } from './util/inject_style.js'
import { Ui_Context } from './Ui_Context.jsx'

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

export const inject_body_style = () => inject_style(`body { ${body_css} }`)

export const body = css`${body_css}`
export const body_root_element = css`${body_root_element_css}`

export const create_mount_to_body = ({ createRoot }) =>
	options => App => {
		const root_element = document.createElement('div')
		const root = createRoot(root_element)
		const unmount = () => {
			root.unmount()
			root_element.remove()
			uninject_body_style()
		}
		root_element.classList.add(body_root_element)
		const uninject_body_style = inject_body_style()
		document.body.append(root_element)
		return {
			unmount,
			render: props => root.render(<Ui_Context><App {...props}/></Ui_Context>)
		}
	}

export const mount_to_body = create_mount_to_body({ createRoot: ReactDOM.createRoot })
