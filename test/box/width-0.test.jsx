import * as assert from 'uvu/assert'
import { Box, mount_to_body } from '#ui'

export default () => {
	let box
	return mount_to_body
		({ })
		(() => {
			const box = React.useRef(null)
			onMount(() => {
				assert.equal(
					box.clientWidth,
					0,
					`width={0} box has 0 width, despite its content`
				)
			})
			return (
				Box dom_ref={box} width={0} style='border: 4px solid red;'>
					<Box>foo bar baz</Box>
				</Box>
			)
		})
}
