export const property = type => value => ({ type, value })

export const px = property ('px')

export const ratio = property ('ratio')

export const minimum_default = property ('px') (0)
export const maximum_default = property ('px') (Infinity)

const length = type => value => ({ type, value, minimum: minimum_default, maximum: maximum_default })

export const px_length = length ('px')

export const ratio_length = length ('ratio')

export const flex = grow => shrink => length ('flex') ({ grow, shrink })

export const conform = flex (1) (1)

export const grow = (grow => Object.assign (grow, grow (1))) (n => flex (n) (0))

export const shrink = (shrink => Object.assign (shrink, shrink (1))) (n => flex (0) (1))

export const content = grow (0)

export const fill = (fill => Object.assign (fill, fill (1))) (length ('fill'))

export const format_length_property = length => typeof length === 'number' ? { type: 'px', value: length } : length

/*
	Due to this being abstraction over css and the possibility of minimum/maximum as type: 'ratio',
	it can't be determined whether `minimum` is greater than the `maximum`.
	If it were possible to determine, it may make sense to throw an error in that case,
	or have `minimum (100) (maximum (50) (75))` mean the value was 75, then 50, then 100,
	but again, this is not possible because ratio and px lengths can't be compared.
	Instead, it will be implemented to work like css, so `minimum` takes priority over `maximum`.
	`minimum` will just update the `minimum` property,
	`maximum` will just update the `maximum` property,
	and they will be output to the corresponding css.

	width={100}
	{ type: 'px', value: 100, minimum: { type: 'px', value: 0 }, maximum: { type: 'px', value: Infinity } }
	width={px(100)}
	{ type: 'px', value: 100, minimum: { type: 'px', value: 0 }, maximum: { type: 'px', value: Infinity } }
	width={minimum (50) (100)}
	{ type: 'px', value: 100, minimum: { type: 'px', value: 50 }, maximum: { type: 'px', value: Infinity } }
	width={minimum (50) (maximum (25) (100))}
	{ type: 'px', value: 100, minimum: { type: 'px', value: 50 }, maximum: { type: 'px', value: 25 } }
*/
export const format_length = length =>
	typeof length === 'number'
		?
			Object.assign(px (length), { maximum: maximum_default, minimum: minimum_default })
		:
			{
				maximum: length.maximum === undefined ? maximum_default : format_length_property (length.maximum),
				minimum: length.minimum === undefined ? minimum_default : format_length_property (length.minimum),
				type: length.type,
				value: length.value
			}

const modifier = prop => value => length => ({ ...format_length(length), [prop]: format_length_property(value) })

export const maximum = modifier ('maximum')

export const minimum = modifier ('minimum')
