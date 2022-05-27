/*
	overscroll-behavior configures scroll "chaining" and "affordances".
	When chaining is enabled, affordances must also be enabled, so `{ chaining: true, affordances: false }` expresses an invalid configuration,
	so this is not a good grammar for this API.

	As of 5-16-2022:
		Safari (15) does not support overscroll-behavior.
		Firefox has many strange behaviors related to overscroll-behavior on the body.
		The overscroll settings should be taken as suggestions.
*/
export const overscroll_default = 'auto'
export const overscroll_disabled = 'none'
export const overscroll_contained = 'contain'

export const clip = { overflowX: 'hidden', overflowY: 'hidden' }
export const clip_x = { overflowX: 'hidden', overflowY: 'visible' }
export const clip_y = { overflowX: 'visible', overflowY: 'hidden' }

export const scroll = ({
	overscroll: { x: overscroll_x = overscroll_default, y: overscroll_y = overscroll_default } = {}
} = {}) => ({
	overflowX: 'auto',
	overflowY: 'auto',
	overscrollBehaviorX: overscroll_x,
	overscrollBehaviorY: overscroll_y
})

export const scroll_x = ({ overscroll = overscroll_default } = {}) => ({
	overflowX: 'auto',
	overflowY: 'hidden',
	overscrollBehaviorX: overscroll
})

export const scroll_y = ({ overscroll = overscroll_default } = {}) => ({
	overflowX: 'hidden',
	overflowY: 'auto',
	overscrollBehaviorY: overscroll
})

export const visible = { overflow: 'visible' }
