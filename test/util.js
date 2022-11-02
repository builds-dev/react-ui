import { act as _act } from 'react-dom/test-utils'

export const act = f => {
	let value
	const promise = _act((...args) => {
		value = f(...args)
	})
	// react-dom act() returns a thenable whose .then() doesn't return a thenable, so convert it into a Promise
	return Promise.resolve(promise)
		.then(() => value)
}

export const capitalize = x => x && x[0].toUpperCase() + x.slice(1)

const within = lower => higher => subject => lower <= subject && subject <= higher

export const rendered_px_equal = x => within (x - 0.5) (x + 0.5)

const axis_scroll_property_map = {
	x: 'scrollLeft',
	y: 'scrollTop'
}

// TODO: this could be published and made a dev dependency
export const has_scrollbar = axis => element => {
	const scroll_property = axis_scroll_property_map[axis]
	const computed_style = window.getComputedStyle(element)

	// There is not a scrollbar if overflow is 'hidden' or 'clip'
	const overflow_value = computed_style[`overflow${axis.toUpperCase()}`]
	if (overflow_value === 'hidden' || overflow_value === 'clip') {
		return false
	}

	// There is a scrollbar if overflow is not hidden and element[scroll_property] is greater than 0.
	if (element[scroll_property] > 0) {
		return true
	}

	/*
		There is a scrollbar if overflow is not hidden and element[scroll_property] can remain higher than 0.

		Unfortunately, this requires setting element[scroll_property] higher than 0,
		checking what its value becomes,
		then reverting the change.

		If `scroll-behavior` is set to `smooth`, it will take some time before element[scroll_property] is greater than 0,
		which breaks this check.
		`scroll-behavior` must be set to 'auto' and then reverted
	*/
	const computed_scroll_behavior = computed_style.scrollBehavior
	const element_scroll_behavior = element.style.scrollBehavior
	if (computed_scroll_behavior === 'smooth') {
		element.style.scrollBehavior = 'auto'
	}

	element[scroll_property] = 1
	/*
		The value may become a fraction of a pixel.
		Testing on Chrome 101.0 on Android 12, 5/18/2022, the value becomes `0.761904776096344`.
		Therefore, check whether the value is greater than 0.
	*/
	const result = element[scroll_property] > 0

	// revert changes
	element[scroll_property] = 0
	element.style.scrollBehavior = element_scroll_behavior

	return result
}
