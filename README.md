# builds React UI

A library of React components that abstract over HTML and CSS, for building UIs from high-level, simple expressions.

Inspired by [elm-ui](https://github.com/mdgriffith/elm-ui).

## API

### mount

#### `mount_to_body (options) (layout_box)`

Mounts a [layout box](#layout_boxes) to the dom body.

Options are not implemented yet, so pass an empty object.

### Layout boxes

Layout boxes are 2d boxes that may contain text or other layout boxes.

#### `Box`

`Box` may have only one child and is no different from a `Column` or `Row` with a single child.

#### `Column`

`Column` lays out its children across the Y axis (vertical).

#### `Row`

`Row` lays out its children across the X axis (horizontal).

#### Layout box props

##### `class_name={string}`

Apply `[class](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class)` attribute to the underlying dom node.

##### `height={length}`

default: `content`

See [length](#length).

##### `width={length}`

default: `content`

See [length](#length).

##### `layout_x={layout}`

See [layout](#layout).

default: `align.start`

##### `layout_y={layout}`

See [layout](#layout).

default: `align.start`

##### `padding={{ bottom = 0, left = 0, right = 0, top = 0 }}`

Apply padding to the inner edges of the box. For convenience, use `edges (n)`, `edges.x (n)` and `edges.y (n)`.

```jsx
import { Box, edges } from '#ui'

<Box padding={{ left: 10 }}></Box>

{/* These are equivalent: */}
<Box padding={{ left: 10, right: 10 }}></Box>
<Box padding={edges.x (10)}></Box>

{/* These are equivalent: */}
<Box padding={{ top: 10, bottom: 10 }}></Box>
<Box padding={edges.y (10)}></Box>

{/* These are equivalent: */}
<Box padding={{ bottom: 10, left: 10, right: 10, top: 10 }}></Box>
<Box padding={edges (10)}></Box>
```

##### `relatives={[ relative ]}`

Relatives are positioned and sized relative to the box they are attached to (origin).

`relative` is `[ position, box ]`.

`position` is `{ x: anchor, y: anchor, z: [plane](#plane) }`. It expresses a relative position in 3d space.

`anchor` is `[ number, number ]`. The first number represents a point on the relative box, and the second number represents a point on the origin box. `0` refers to the start of the box along the axis, and `1` refers to the end of the box along the axis. `{ x: [ 0.5, 1 ] }` means to position the center (0.5) of the relative box on the right (1) of the origin box.

The default `position` is `{ x: [ 0, 0 ], y: [ 0, 0 ], z: plane.foreground }`.

```jsx
import { Box, plane } from '#ui'

{/* This box has a relative box that is horizontally and vertically centered, twice as tall, the same width, and behind its layout children.*/}
<Box
	relatives=[
		[
			{ x: [ 0.5, 0.5 ], y: [ 0.5, 0.5 ], z: plane.background },
			<Box height={ratio(2)} width={fill}></Box>
		]
	]
>
</Box>

{/* This box has a relative box that is the same height and width and in front of its layout children.*/}
<Box
	relatives=[
		[
			{ z: plane.foreground },
			<Box height={fill} width={fill}></Box>
		]
	]
>
</Box>
```

##### `offset_x={number}`

`offset_x` arbitrarily moves a box along the x axis by the given number of pixels. The layout the box is within is unaffected; it is as though the box is in its original position.

##### `offset_y={number}`

`offset_y` arbitrarily moves a box along the x axis by the given number of pixels. The layout the box is within is unaffected; it is as though the box is in its original position.

##### `overflow={overflow}`

See [overflow](#overflow).

default: `overflow.visible`

Configures the handling of overflow, which is when a box's content exceeds its bounds.

##### `style={{ [property]: value }}`

Apply inline styles to the underlying dom node. See [React's style prop](https://reactjs.org/docs/dom-elements.html#style).

##### `tag={string}`

default: `'div'`

The [tag name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) to use to create the underlying dom node.

#### length

These are values that can be provided as `height` and `width`. For convenience, a number can be passed as a length, and it will be interpreted as a number of `px`.

"Content" refers to what is in a box, also known as its "layout child(ren)".

"Remaining length" refers to the parent length minus the lengths specifically claimed by its children (px lengths, `grow` and `content` content lengths).

##### `px (number)`

A number of pixels.

##### `ratio (number)`

A ratio of the parent length not derived from its content.

```jsx
import { Box, Row, ratio } from '#ui'

<Box height={100}>
	{/* The following box has a height of 50px (100 * 0.5). */}
	<Box height={ratio(0.5)}></Box>
</Box>
```

Because `content` and `grow` lengths are computed from content, a ratio of a `content` or `grow` length parent is always 0.

```jsx
<Row height={content} width={content}>
	<Box height={100} width={100}></Box>
	{/* The following box has a height and width of 0, because its parent's height and width are `content` */}
	<Box width={50%}></Box>
</Row>
```

##### `grow`, `grow ({ factor: number })`

`grow` means to be at least the length of content plus a portion of remaining length, which is distributed according to `factor`.
Siblings with `grow ({ factor: 1 })` will grow by equal amounts.

`grow` is shorthand for `grow ({ factor: 1 })`.

##### `content`

`content` means to be same length as content (what is in the box). This is the default value for box `height` and `width`.

`content` is equivalent to `grow ({ factor: 0 })`.

##### `fill`, `fill ({ factor = 0, maximum = Infinity })`

`fill` means to have a length that is a portion of remaining parent length, but no greater than `maximum`.

`fill` is shorthand for `fill ({ factor: 1, maximum: Infinity })`.

#### overflow

Note that `scroll_x` hides overflow on the `y` axis and `scroll_y` hides overflow on the `x` axis. This is by necessity, as there cannot be overflow across a scrollbar.

##### `overflow.clip`

Hide all overflow.

##### `overflow.clip_x`

Hide overflow on the `x` axis.

##### `overflow.clip_y`

Hide overflow on the `y` axis.

##### `scroll ({ overscroll = { x = overscroll_default, y = overscroll_default } })`

All overflow is scrollable.

##### `scroll_x ({ overscroll = overscroll_default })`

Overflow on the `x` axis is scrollable. Overflow on the `y` axis is hidden.

##### `scroll_y ({ overscroll = overscroll_default })`

Overflow on the `y` axis is scrollable. Overflow on the `x` axis is hidden.

##### `overflow.visible`

Render all overflow. This is the default.

#### overscroll

`overscroll` configures [scroll chaining and boundary default actions](https://www.w3.org/TR/css-overscroll-1/#scroll-chaining-and-boundary-default-actions).

##### `overscroll_default`

Use the default scroll chaining and boundary default actions of the user agent.

##### `overscroll_disabled`

Disable scroll chaining and boundary default actions.

##### `overscroll_contained`

Disable scroll chaining. Boundary default actions local to the scroll container (e.g. overscroll glow effect) remain enabled.

#### plane

The values of `plane` refer to relative positions on the `z` axis for a relative box from an origin box.

##### `plane.background`

A relative with `{ z: plane.background }` is positioned on the `z` axis at the back of the origin box.
Layout children are in front of `plane.background`.
Relatives positioned in `plane.background` are ordered as they appear in the list of relatives; earlier relatives are further back.
A box's `background` property is in `plane.background` before relatives.

##### `plane.foreground`

A relative with `{ z: plane.foreground }` is positioned on the `z` axis in front of the origin box.
Layout children are behind `plane.foreground`.
Relatives positioned in `plane.foreground` are ordered as they appear in the list of relatives; later relatives are further forward.

##### `plane.ascended`

**TODO:** `plane.ascended` should be higher _from_ the foreground, so that a parent can include a relative that is in front of the ascended relatives of its children. `plane.ascended_background` ascends _from_ the background, so that a parent can include a relative that is above its surroundings, but behind the ascended relatives of its children. Maybe it should be `plane.ascended` and `plane.ascended_foreground`... This needs to be nailed down and described well. Something for further consideration is the result of a list of relatives including ascended relatives and non-ascended relatives, where the non-ascended relatives also have ascended relatives.
A relative with `{ z: plane.ascended }` is positioned on the `z` axis in front of everything in the current `Stack`.
Boxes positioned in `plane.ascended` are ordered **TODO:**.

Positioning a relative in `plane.ascended` expresses that it should be relatively above its surroundings on the z axis, without knowing about the surroundings or "how high".
`{ z: plane.ascended }` is much like `width={grow}`. An exact width is not specified, but rather the intent to take up available space. The exact width (size on the y axis) depends on the width of its parent box and widths of its siblings. Similarly, the exact position on the z axis depends on the z axis parent - the current `Stack`, and z axis siblings, which are all boxes within the stack.

##### `plane.ascended_background`

A relative with `{ z: plane.ascended_background }` is positioned on the `z` axis **TODO:**.
