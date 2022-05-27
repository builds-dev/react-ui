const align = flex => ({ gap }) => ({ flex, gap })

const create_align = flex => {
	const x = options => ({ flex, ...options })
	Object.assign(x, { flex })
	return x
}

export const start = create_align ('flex-start')
export const center = create_align ('center')
export const end = create_align ('flex-end')
export const space_around = { flex: 'space-around' }
export const space_between = { flex: 'space-between' }
export const space_evenly = { flex: 'space-evenly' }
