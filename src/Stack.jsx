import { createRoot } from 'react-dom/client'
import React, {
	cloneElement,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'

// TODO: temporary
import {
	Box_child_height_style_context,
	Box_child_position_style_context,
	Box_child_width_style_context
} from './Box_child_style_context.js'
import {
	compute_height_style_for_relative_child,
	compute_width_style_for_relative_child,
	compute_position_style_for_relative_child
} from './layout.js'

/*
ascended<---
           |
           |
foreground |
         >--
children
         >--
background |
           |
           |
descended<--

					foreground ascendants
				ascendants
			children ascendants
		background ascendants
	foreground
children
	background
		foreground descendants
			children descendants
				descendants
					background descendants
*/

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

const assign_keys = (id, elements) =>
	elements
		.map((x, index) =>
			x
				? x.key === null ? cloneElement(x, { key: x.key == null ? `${id}_${index}` : x.key }) : null
				: null
		)

const prepare_relatives = (node, id, relatives) => (
	<Box_child_height_style_context.Provider value={compute_height_style_for_relative_child}>
		<Box_child_width_style_context.Provider value={compute_width_style_for_relative_child}>
			<Box_child_position_style_context.Provider value={compute_position_style_for_relative_child}>
				{relatives}
			</Box_child_position_style_context.Provider>
		</Box_child_width_style_context.Provider>
	</Box_child_height_style_context.Provider>
)

export const Stack = ({ children }) => {
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
				const id = crypto.randomUUID()

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
						state.ascendant_groups[index] = prepare_relatives(node, id, assign_keys(id, ascendants))
						set_ascendants(state.ascendant_groups.flat())
					},
					update_descendants: descendants => {
						const index = state.members.get(node)
						state.descendant_groups[index] = prepare_relatives(node, id, assign_keys(id, descendants))
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
