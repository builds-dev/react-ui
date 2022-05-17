## body

The body background color is used for the whole visible area, even if the body height and width are 0.
Confirmed: 5-15-2022 [Mac] Chrome, Firefox, Safari

Content of the body is visibile, even if the body height and width are 0 and overflow is hidden.
Confirmed: 5-15-2022 [Mac] Chrome, Firefox, Safari

`overflow: hidden` on the body is the same as `overflow: visible` *on any other element* - overflow does not cause scrollbars.

The DOM body will always behave as though its width and height are at least the size of the window,
so it does not make sense to express its height and width,
and `overflow` cannot be `visible`, because it is clipped by the window.

Safari does not support css `overscroll-behavior`.
For the best user experience, the root scrollable element in Safari should be the body element.

The DOM body is low level. It's better to think of the window space where UI can go, and have no thought of an element whose height can vary,
especially because of strange body height semantics like its background covering the window even if its height and width are lesser.

Mounting to the body provides these semantics for the body:
	It represents the window space.
	It is a suitable environment/parent for our high level ui components.
	It has a scrollbar on an axis if UI on that axis extends beyond the window space.
	Its scrollbars behave according to the platform's semantics (non-configurable).

In cases where one may desire to hide body overflow, a component at the root can be used instead:
```jsx
<Box height={fill} width={fill} overflow={clip}></Box>
```

## Safari Overscroll Area color
- Set `background` on the html element.
- Set `background` on the body element.
	Takes precedence over the html color.
- iOS 15+
	```html
	<meta name="theme-color" content="${light_theme_color}" media="(prefers-color-scheme: light)">
	<meta name="theme-color" content="${dark_theme_color}" media="(prefers-color-scheme: dark)">
	```
	This styles the status bar and overscroll area in Safari on iOS 15 and also changes the Tab Bar and overscroll area background colors in Compact Tab layout for Safari 15 on macOS Monterey and Big Sur and iPadOS 15.
	Takes precedence over the html and body color.
- pseudo-elements
	Note that `before` and `after` are arbitrary - either will work in any case. These can be combined into one pseudo-element with both top and bottom set to -50%, which will set the color for both the top and bottom overscroll area.
	Top overscroll area:
	```css
	body::before {
		content: '';
		z-index: -1;
		position: fixed;
		right: 0;
		left: 0;
		top: -50%;
		bottom: 0;
		background: ${color};
	}
	```
	Bottom overscroll area:
	```css
		body::after {
			content: '';
			position: fixed;
			z-index: -1;
			right: 0;
			left: 0;
			top: 0;
			bottom: -50%;
			background: ${color};
		}
	```
	Takes precedence over html, body, and theme color.
