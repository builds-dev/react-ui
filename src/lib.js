export const padding_array_to_string = a => {
	let x = a[0] + 'px'
	for (let i = 1; i < a.length; ++i) { x = x + ' ' + a[i] + 'px' }
	return x
}

export const padding_to_css = padding =>
	Array.isArray(padding)
		? padding_array_to_string(padding)
		: padding + 'px'
