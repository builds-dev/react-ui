export const inject_style = string => {
	const style = document.createElement('style')
	style.textContent = string
	document.head.append(style)
	return () => style.remove()
}
