export const join_classnames = (...a) => {
	if (a[0]) {
		let x = a[0]
		for (let i = 1; i < a.length; ++i) {
			if (a[i]) {
				x = x + ' ' + a[i]
			}
		}
		return x
	}
}

export const padding_to_css = ({ bottom = 0, left = 0, right = 0, top = 0 }) =>
	top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'
