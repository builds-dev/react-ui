const x = n => ({ left: n, right: n })
const y = n => ({ top: n, bottom: n })
const xy = a => b => ({ ...x(a), ...y(b) })

export const edges = Object.assign(
	n => ({ top: n, bottom: n, left: n, right: n }),
	{
		x,
		xy,
		y,
	}
)
