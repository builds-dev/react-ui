import { createRoot } from 'react-dom/client'
import React, {
	cloneElement,
	createContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { map, map_all } from './util/react.js'
import { to_css_value } from './length.js'
import {
	Box_child_computation_context,
	Box_child_position_style_context
} from './Box_child_style_context.js'
import { identity } from './util/identity.js'

const random_id = () =>
  window.crypto.getRandomValues(new Uint32Array(1))
		[0]
		.toString(16)

export const Stack_context = createContext()

const find_insert_index = (nodes, node) => {
	let i = nodes.size
	while (i > 0) {
		const x = node.compareDocumentPosition(nodes.get(i - 1))
		if (x & Node.DOCUMENT_POSITION_PRECEDING) {
			break
		}
		--i
	}
	return i
}

const assign_keys = elements =>
	elements
		.map((x, index) =>
			x
				? x.key === null ? cloneElement(x, { key: index }) : null
				: null
		)

const compute_style_for_distant_length = (length_name, min_length_name) => parent_px => length => {
	const { type, value } = length
	if (type === 'grow') {
		return {
			[length_name]: 'max-content',
			[min_length_name]: value.factor > 0 ? parent_px : 'auto'
		}
	} else if (type === 'fill') {
		return {
			[length_name]: '0px',
			[min_length_name]: value.factor > 0
				? `min(${parent_px}px, ${to_css_value(value.maximum)})`
				: '0px'
		}
	} else if (type === 'ratio') {
		return {
			[length_name]: parent_px * value + 'px'
		}
	} else {
		return {
			[length_name]: to_css_value(length)
		}
	}
}

const compute_style_for_distant_height = compute_style_for_distant_length ('height', 'minHeight')
const compute_style_for_distant_width = compute_style_for_distant_length ('width', 'minWidth')

const Representative = ({ node, origin_node, children }) => {
	const [ node_height, set_node_height ] = useState(0)
	const [ node_width, set_node_width ] = useState(0)
	const [ position_offset, set_position_offset ] = useState(null)

	useEffect(
		() => {
			if (!node) {
				return
			}
			let frame_request_id
			let cached_rect = {}
			let cached_origin_rect = {}
			const loop = () => {
				frame_request_id = window.requestAnimationFrame(() => {
					const rect = node.getBoundingClientRect()
					const origin_rect = origin_node.getBoundingClientRect()
					if (rect.height !== cached_rect.height) {
						set_node_height(rect.height)
					}
					if (rect.width !== cached_rect.width) {
						set_node_width(rect.width)
					}
					if (rect.left !== cached_rect.left || rect.top !== cached_rect.top || origin_rect.left !== cached_origin_rect.left || origin_rect.top !== cached_origin_rect.top) {
						set_position_offset({ left: rect.left - origin_rect.left, top: rect.top - origin_rect.top })
					}
					cached_rect = rect
					cached_origin_rect = origin_rect
					loop()
				})
			}
			loop()
			return () => window.cancelAnimationFrame(frame_request_id)
		},
		[ node ]
	)

	const box_child_height_style_context_value = map
		(compute_style_for_distant_height)
		(node_height)

	const box_child_width_style_context_value = map
		(compute_style_for_distant_width)
		(node_width)

	const box_child_position_style_context_value = map_all
		((position_offset, parent_height, parent_width) => (anchor_x, anchor_y, offset_x = 0, offset_y = 0, ref) =>
			position_offset === null
				? { display: 'none' }
				:
					{
						position: 'absolute',
						transform: `translate3d(calc(${anchor_x[0] * -100}% + ${position_offset.left + (parent_width * anchor_x[1]) + offset_x}px), calc(${anchor_y[0] * -100}% + ${position_offset.top + (parent_height * anchor_y[1]) + offset_y}px), 0)`
					}
		)
		(position_offset, node_height, node_width)

	// TODO: useMemo? All the child height/width context stuff is an inefficient mess.
	const child_computation_context_value = (height, width) => [
		box_child_height_style_context_value (height),
		box_child_width_style_context_value (width),
		identity
	]

	return (
		<Box_child_computation_context.Provider value={child_computation_context_value}>
			<Box_child_position_style_context.Provider value={box_child_position_style_context_value}>
				{children}
			</Box_child_position_style_context.Provider>
		</Box_child_computation_context.Provider>
	)
}

export const Stack = ({ children }) => {
	const stack_dom_ref = useRef()
	const [ ascendants, set_ascendants ] = useState([])
	const [ descendants, set_descendants ] = useState([])

	const [ state ] = useState(() => {
		const state = {
			ascendant_groups: [],
			descendant_groups: [],
			indexes: new Map(),
			/*
				`initializing` is used to avoid comparing dom nodes to determine the index of a component when a component registers during the first render of a `Stack`.
				During the first render, every call to `register` should be for a subsequent component in the source order, so it will just use the next index.
			*/
			initializing: true,
			members: new Map(),
			register: node => {
				const id = random_id()

				/*
				const index = state.members.size === 0
					? 0
					: find_insert_index (state.indexes, node)
				*/

				const index = state.initializing
					? state.members.size
					: find_insert_index(state.indexes, node)

				for (let i = state.members.size - 1; i >= index; --i) {
					const node = state.indexes.get(i)
					const index = i + 1
					state.members.set(node, index)
					state.indexes.set(index, node)
					state.ascendant_groups[index] = state.ascendant_groups[i]
					state.descendant_groups[index] = state.descendant_groups[i]
				}

				state.members.set(node, index)
				state.indexes.set(index, node)

				return {
					update_ascendants: ascendants => {
						const index = state.members.get(node)
						state.ascendant_groups[index] = <Representative key={id} node={node} origin_node={stack_dom_ref.current.parentNode}>{assign_keys(ascendants)}</Representative>
						set_ascendants(state.ascendant_groups.flat())
					},
					update_descendants: descendants => {
						const index = state.members.get(node)
						state.descendant_groups[index] = <Representative key={id} node={node} origin_node={stack_dom_ref.current.parentNode}>{assign_keys(descendants)}</Representative>
						set_descendants(state.descendant_groups.flat())
					},
					unregister: () => {
						const index = state.members.get(node)
						state.members.delete(node)
						state.indexes.delete(index)
						for (let i = index + 1; i < state.members.size; ++i) {
							const node = state.indexes.get(i)
							const index = i - 1
							state.members.set(node, index)
							state.indexes.set(index, node)
							state.ascendant_groups[index] = state.ascendant_groups[i]
							state.descendant_groups[index] = state.descendant_groups[i]
							delete state.ascendant_groups[i]
							delete state.descendant_groups[i]
						}
						set_ascendants(state.ascendant_groups.flat())
						set_descendants(state.descendant_groups.flat())
					}
				}
			}
		}

		return state
	})

	useEffect(() => {
		state.initializing = false
	}, [ state ])

	return (
		<>
			<div style={{ display: 'none' }} ref={stack_dom_ref}></div>
			<Stack_context.Provider value={state}>
				{descendants.length
					?
						<Stack>{descendants}</Stack>
					:
						null
				}
				{children}
				{ascendants.length
					?
						<Stack>{ascendants}</Stack>
					:
						null
				}
			</Stack_context.Provider>
		</>
	)
}
