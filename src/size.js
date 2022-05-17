export const property = type => value => ({ type, value })

export const px = property ('px')

export const ratio = property ('ratio')

export const min_default = property ('px') (0)
export const max_default = property ('px') (Infinity)

const size = type => value => ({ type, value, min: min_default, max: max_default })

export const fill = (fill => Object.assign (fill, fill (1))) (size ('fill'))

export const px_size = size ('px')

export const ratio_size = size ('ratio')

export const flex = grow => shrink => size ('flex') ({ grow, shrink })

export const grow = (grow => Object.assign (grow, grow (1))) (n => flex (n) (0))

export const shrink = (shrink => Object.assign (shrink, shrink (1))) (n => flex (0) (1))

export const content = grow (0)

export const format_size_property = size => typeof size === 'number' ? { type: 'px', value: size } : size

/*
	Due to this being abstraction over css and the possibility of min/max as type: 'ratio',
	it can't be determined whether `min` is greater than the `max`.
	If it were possible to determine, it may make sense to throw an error in that case,
	or have `min (100) (max (50) (75))` mean the value was 75, then 50, then 100,
	but again, this is not possible because ratio and px sizes can't be compared.
	Instead, it will be implemented to work like css, so `min` takes priority over `max`.
	`min` will just update the `min` property,
	`max` will just update the `max` property,
	and they will be output to the corresponding css.

	width={100}
	{ type: 'px', value: 100, min: { type: 'px', value: 0 }, max: { type: 'px', value: Infinity } }
	width={px(100)}
	{ type: 'px', value: 100, min: { type: 'px', value: 0 }, max: { type: 'px', value: Infinity } }
	width={min (50) (100)}
	{ type: 'px', value: 100, min: { type: 'px', value: 50 }, max: { type: 'px', value: Infinity } }
	width={min (50) (max (25) (100))}
	{ type: 'px', value: 100, min: { type: 'px', value: 50 }, max: { type: 'px', value: 25 } }
*/
export const format_size = size =>
	typeof size === 'number'
		?
			px (size)
		:
			{
				max: format_size_property (size.max),
				min: format_size_property (size.min),
				type: size.type,
				value: size.value
			}

const modifier = prop => value => size => ({ ...format_size(size), [prop]: format_size_property(value) })

export const max = modifier ('max')

export const min = modifier ('min')
