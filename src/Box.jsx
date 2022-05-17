import React from 'react'
import { Element } from './Element.jsx'
// import Layout_context from './Layout_context.svelte'
// import { content, format_length } from './length'
// import { layout, layout_x, layout_x_style, layout_child, layout_x_child } from './layout'
// import { concat as classname_concat } from './util/classname'
import { format_size } from './size.js'

export const Box = ({ ...props }) => {

	// export let ref = undefined
	// export let style = ''
	// $: height = format_length('height' in $$props ? $$props.height : content)
	// $: width = format_length('width' in $$props ? $$props.width : content)
	// $: context_values = { height, width }
	// $: element_props = {
	// 	...$$restProps,
	// 	class: classname_concat([ $$props.class, 'box', layout_x, layout ]),
	// 	height,
	// 	width
	// }

/*
<Element
	style="{ layout_x_style($$props) }{ style }"
	{ ...element_props }
>
	<Layout_context
		context_style={props => `${layout_child(context_values, props)}${layout_x_child() (props)}`}
	>
		<slot/>
	</Layout_context>
</Element>
*/
	return (
		<Element
			{...props}
			height={format_size(props.height)}
			width={format_size(props.width)}
		/>
	)
}
