const css_infinity = 100000000

const convert_value = x => x === Infinity ? css_infinity : x

const type_to_css = {
	px: value => value + 'px',
	ratio: value => value * 100 + '%',
	math: ({ name, parameters }) => name + '(' + parameters.map(to_css_value).join(', ') + ')'
}

export const to_css_value = ({ type, value }) => type_to_css[type](convert_value(value))

export const px = value => ({ type: 'px', value })

export const format_length = length => typeof length === 'number' ? px(length) : length

export const ratio = value => ({ type: 'ratio', value })

export const grow = (grow => Object.assign (grow, grow ({ factor: 1 }))) (value => ({ type: 'grow', value }))

export const content = grow ({ factor: 0 })

export const fill = (fill => Object.assign (fill, fill ({})))
	(({ factor = 1, minimum = 0, maximum = Infinity }) => ({
		type: 'fill',
		value: {
			factor,
			maximum: format_length(maximum),
			minimum: format_length(minimum)
		}
	}))

const func = name => parameters => ({ type: 'math', value: { name, parameters: parameters.map(format_length) } })

export const max = func ('max')

export const min = func ('min')
