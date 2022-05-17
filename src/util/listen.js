export const listen = (target, name, listener, options) => {
	target.addEventListener(name, listener, options)
	return () => target.removeEventListener(name, listener, options)
}
