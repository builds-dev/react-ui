# builds React UI

A library of React components that abstract over HTML and CSS, for building UIs from high-level, simple expressions.

Inspired by [elm-ui](https://github.com/mdgriffith/elm-ui).

## API

### mount

#### `mount_to_body (options) (layout_box)`

Mounts a [layout box](#layout-boxes) to the dom body, within a `Stack`.

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

##### `anchor_x={[ number, number ]}`, `anchor_y={[ number, number ]}`

These properties only apply to [`relatives`](#relatives).

default: `[ 0, 0 ]`

The first number represents a point on the relative box, and the second number represents a point on the origin box. `0` refers to the start of the box along the axis, and `1` refers to the end of the box along the axis. `anchor_x={[ 0.5, 1 ]}` means to position the horizontal center (0.5) of the relative box on the right (1) of the origin box.

```jsx
<Row
	foreground={[
		<Box anchor_x={[ 0.5, 0.5 ]} anchor_y={[ 0.5, 0.5 ]}>
			This box is horizontally and vertically centered in the row and in front of the row's children.
		</Box>
	]}
>
	{children}
</Row>
```

##### `ascended={[layout_boxes]}`

Place components relatively close to the front of the current [`Stack`](#stack).

See [`Stack`](#stack) and [`relatives`](#relatives).

##### `background={[layout_boxes]}`

Place components behind children.

See [`relatives`](#relatives).

##### `class_name={string}`

Apply [class](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute to the underlying dom node.

##### `descended={[layout_boxes]}`

Place components relatively close to the back of the current [`Stack`](#stack).

See [`Stack`](#stack) and [`relatives`](#relatives).

##### `element_props={object}`

Pass props to the underlying React element. This prop is a temporary approach to accessing some behavior not yet available through this library's API.

```js
<Box element_props={{ onClick: handle_the_click }}></Box>
```

##### `foreground={[layout_boxes]}`

Place components in front of children.

See [`relatives`](#relatives).

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

#### edges

##### `edges (number)`

Shorthand for `{ bottom: number, left: number, right: number, top: number }`.

##### `edges.x (number)`

Shorthand for `{ left: number, right: number }`.

##### `edges.y (number)`

Shorthand for `{ bottom: number, top: number }`.

#### layout

`gap` is a number of pixels of space on the layout axis between layout children.

##### `align.start`, `align.start ({ gap: number })`

Layout children from the start of the layout axis (top edge of column, left edge of row).

`align.start` is shorthand for `align.start ({ gap: 0 })`.

##### `align.center`, `align.start ({ gap: number })`

Layout children from the center of the layout axis (children or centered on the axis).

`align.center` is shorthand for `align.center ({ gap: 0 })`.

##### `align.end`, `align.end ({ gap: number })`

Layout children from the end of the layout axis (botton edge of column, right edge of row).

`align.end` is shorthand for `align.end ({ gap: 0 })`.

##### `align.space_around`

Distribute equal space on each side of layout children.

##### `align.space_between`

Distribute equal space between layout children.

##### `align.space_evenly`

Distribute equal space around layout children.

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

##### `overflow.scroll ({ overscroll = { x = overscroll_default, y = overscroll_default } })`

All overflow is scrollable.

##### `overflow.scroll_x ({ overscroll = overscroll_default })`

Overflow on the `x` axis is scrollable. Overflow on the `y` axis is hidden.

##### `overflow.scroll_y ({ overscroll = overscroll_default })`

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

#### relatives

A relative is a component that is expressed in the `ascended`, `background`, `descended`, or `foreground` properties of a layout box.

A relative is positioned and sized relative to the layout box (origin) on which it is expressed.

A relative has no effect on the size or position of its origin or its origin's children.

Relatives use properties `anchor_x` and `anchor_y` to express x and y position relative to the origin box.

```jsx
import { Box } from '#ui'

{/* This box has a relative box that is horizontally and vertically centered, twice as tall, the same width, and behind its layout children.*/}
<Box
	background={[
		<Box anchor_x={[ 0.5, 0.5 ]} anchor_y={[ 0.5, 0.5 ]} height={ratio(2)} width={fill}></Box>
	]}
>
</Box>

{/* This box has a relative box that is the same height and width and in front of its layout children.*/}
<Box
	foreground={[
		<Box height={fill} width={fill}></Box>
	]}
>
</Box>
```

### Stack

`Stack` is a span of z space, in which all children stack. Each successive child (including its children) is higher than the former (including its children).

Every layout box has a natural position in z space, above the box before it, and before the box after it. It can place other boxes in z space relative to its z position via its `ascended`, `background`, `descended`, and `foreground` properties. These further subdivide z space, and so do not conflict with the natural z stacking of boxes e.g. the foreground of a box is behind the background of its next sibling.

`background` is the z space before the box's children.

`foreground` is the z space after the box's children.

`ascended` expresses the intent for boxes to be as in front as possible without imposing exact opinions of 'how much in front'. This is conceptually similar to `<Box width={fill}>`, where the box expresses intent to take up as much width as possible, leaving the determination of how much width that is to the surrounding context. If from a higher view, you see that some ascended relatives should be restrained to a z space prior to others, you can wrap them in a `Stack` to specify the highest point in z space they can reach.

`ascended` is a nested `Stack` in the z space relatively close to the front of the most immediate `Stack`.

What is meant by "relatively close" is that how close it is to the front of the stack depends the z position of the origin box. If the first and second child of a stack ascend a relative, the second child's relative is closer to the front of the stack because the second child is closer to the front of the stack. 

The ascended z space from a box is itself a `Stack`, so if box A ascends a box, A1, and box B ascends a box, B1, and A1 ascends a box, A1A, then A1A is not above B1, because A1 and A1A are in a stack that is below the stack containing B1.

`descended` is analogous to `ascended`, except it pertains the back of the stack, rather than the front.

This depicts the relative z space positions a layout box can place components.
```
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
```

This depicts the order of relative z space positions including complex combinations e.g. a box in the foreground with a descended box.
```
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
```

Many applications will likely have all their z position concerns handled with this pattern:

```jsx
const App = () => {
	return <>
		<Stack>
			{/* most UI goes here */}
		</Stack>
		{/* modals and other such components go here */}
	</>
}
```
