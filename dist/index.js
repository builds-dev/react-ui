'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var require$$0 = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

const create_align = flex => {
  const x = options => ({
    flex,
    ...options
  });

  Object.assign(x, {
    flex
  });
  return x;
};

const start = create_align('flex-start');
const center = create_align('center');
const end = create_align('flex-end');
const space_around = {
  flex: 'space-around'
};
const space_between = {
  flex: 'space-between'
};
const space_evenly = {
  flex: 'space-evenly'
};

var align = /*#__PURE__*/Object.freeze({
	__proto__: null,
	start: start,
	center: center,
	end: end,
	space_around: space_around,
	space_between: space_between,
	space_evenly: space_evenly
});

const edges = Object.assign(n => ({
  top: n,
  bottom: n,
  left: n,
  right: n
}), {
  x: n => ({
    left: n,
    right: n
  }),
  y: n => ({
    top: n,
    bottom: n
  })
});

const css_infinity = 100000000;

const convert_value = x => x === Infinity ? css_infinity : x;

const type_to_css = {
  px: value => value + 'px',
  ratio: value => value * 100 + '%',
  math: ({
    name,
    parameters
  }) => name + '(' + parameters.map(to_css_value).join(', ') + ')'
};
const to_css_value = ({
  type,
  value
}) => type_to_css[type](convert_value(value));
const px = value => ({
  type: 'px',
  value
});
const format_length = length => typeof length === 'number' ? px(length) : length;
const ratio = value => ({
  type: 'ratio',
  value
});
const grow = (grow => Object.assign(grow, grow({
  factor: 1
})))(value => ({
  type: 'grow',
  value
}));
const content = grow({
  factor: 0
});
const fill = (fill => Object.assign(fill, fill({})))(({
  factor = 1,
  minimum = 0,
  maximum = Infinity
}) => ({
  type: 'fill',
  value: {
    factor,
    maximum: format_length(maximum),
    minimum: format_length(minimum)
  }
}));

const func = name => parameters => ({
  type: 'math',
  value: {
    name,
    parameters: parameters.map(format_length)
  }
});

const max = func('max');
const min = func('min');

const join_classnames = (...a) => {
  if (a[0]) {
    let x = a[0];

    for (let i = 1; i < a.length; ++i) {
      if (a[i]) {
        x = x + ' ' + a[i];
      }
    }

    return x;
  }
};
const padding_to_css = ({
  bottom = 0,
  left = 0,
  right = 0,
  top = 0
}) => top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".box_bb7yjy4 {\n\tbox-sizing: border-box; \tdisplay: flex; \tflex-direction: column;\n}\n\n.column_c1m6442m {\n\tbox-sizing: border-box; \tdisplay: flex; \tflex-direction: column;\n}\n\n.row_r8o4g34 {\n\tbox-sizing: border-box; \tdisplay: flex;\n\tflex-direction: row;\n}\n\n";
styleInject(css_248z$1);

/*
	ratio of main axis of a content-sized parent is incoherent - the parent's size is based on the child, and the child is expressing a ratio of the parent's size.
	ratio should mean "of space determined by the parent", which in this case is 0.
*/

const compute_layout_length = (parent_length, length) => length.type === 'ratio' && parent_length.type === 'grow' ? 0 : to_css_value(length);

const compute_style_as_layout_box = ({
  padding
}) => ({
  padding: padding && padding_to_css(padding)
});
/*
	This function takes `to_css_value` so that `compute_style_for_layout_length` can pass a function that accounts for ratio lengths of `content` length parents
*/

const compute_style_for_isolated_length = (length_name, min_length_name) => (length, to_css_value) => {
  const {
    type,
    value
  } = length;

  if (type === 'grow') {
    return {
      [length_name]: 'max-content',
      [min_length_name]: value.factor > 0 ? '100%' : 'auto'
    };
  } else if (type === 'fill') {
    return {
      [length_name]: `min(100%, ${to_css_value(value.maximum)})`,
      [min_length_name]: to_css_value(value.minimum)
    };
  } else {
    return {
      [length_name]: to_css_value(length)
    };
  }
};

const compute_style_for_isolated_height = compute_style_for_isolated_length('height', 'minHeight');
const compute_style_for_isolated_width = compute_style_for_isolated_length('width', 'minWidth');
/* NOTE:
	If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
	also look at these properties in `compute_style_for_layout_child`.
*/

const compute_style_for_relative_child = (props, {
  height = content,
  width = content,
  offset_x = 0,
  offset_y = 0
}, {
  x,
  y,
  z
}) => ({
  left: x[1] * 100 + '%',
  position: 'absolute',
  top: y[1] * 100 + '%',
  // TODO: `transform` isn't necessary when x[0] === 0 && y[0] === 0 && offset_x === 0 && offset_y === 0, but implementing Stack will probably change that.
  transform: `translate3d(calc(${x[0] * -100}% + ${offset_x}px), calc(${y[0] * -100}% + ${offset_y}px), 0)`,
  ...compute_style_for_isolated_height(height, to_css_value),
  ...compute_style_for_isolated_width(width, to_css_value)
});

const compute_style_for_main_axis_length = (max_length_name, min_length_name, parent_length, length) => {
  const {
    type,
    value
  } = length;

  if (type === 'grow') {
    return {
      flex: value.factor + ' 0 auto'
    };
  } else if (type === 'fill') {
    return {
      flex: value.factor + ' 0 0',
      [max_length_name]: compute_layout_length(parent_length, value.maximum),
      // NOTE: [main_axis_min_length_name] must be explicitly set in order for `fill` to work on the main axis.
      // [min_length_name]: compute_layout_length(parent_length, value.minimum)
      [min_length_name]: 0
    };
  } else {
    return {
      // to use flex-basis to set exact length, the min length must be set to 0
      flex: '0 0 ' + compute_layout_length(parent_length, length),
      [min_length_name]: 0
    };
  }
};

const compute_transform = ({
  offset_x,
  offset_y
}) => (offset_x || offset_y) && 'translate3d(' + offset_x + 'px), calc(' + offset_y + 'px), 0)';

const compute_style_for_layout_child = (main_axis_length_name, main_axis_max_length_name, main_axis_min_length_name, cross_axis_length_name, compute_style_for_cross_axis_length) => (parent_props, child_props) => {
  const main_axis_length = child_props[main_axis_length_name];
  const parent_main_axis_length = parent_props[main_axis_length_name];
  return { ...compute_style_for_main_axis_length(main_axis_max_length_name, main_axis_min_length_name, parent_main_axis_length, main_axis_length),
    ...compute_style_for_cross_axis_length(child_props[cross_axis_length_name], length => compute_layout_length(parent_props[cross_axis_length_name], length)),

    /* NOTE:
    	If adjusting `position` or `transform`, or changing the implementation of `offset_x` or `offset_y`,
    	also look at these rules in `compute_style_for_relative_child`.
    */
    position: 'relative',
    transform: compute_transform(child_props)
  };
};
/*
	`compute_style_for_isolated_[length]` and its `to_css_value` are a bit ugly. Be welcome to refactor.
*/

const compute_style_for_layout_x_child = compute_style_for_layout_child('width', 'maxWidth', 'minWidth', 'height', compute_style_for_isolated_height);
const compute_style_for_layout_y_child = compute_style_for_layout_child('height', 'maxHeight', 'minHeight', 'width', compute_style_for_isolated_width);
const cross_axis_align = {
  'flex-start': 'flex-start',
  'center': 'center',
  'flex-end': 'flex-end',
  'space-around': 'center',
  'space-between': 'flex-start',
  'space-evenly': 'center'
};

const contains_size = length => length.type === 'px' || length.type === 'ratio';

const compute_style_for_layout_parent = (gapProperty, main_axis_layout = start, cross_axis_layout = start, height, width, overflow) => ({
  alignItems: cross_axis_align[cross_axis_layout.flex],
  contain: (overflow && overflow.overflowX === 'hidden' && overflow.overflowY === 'hidden' ? 'layout paint' : '') + (height && width && contains_size(height) && contains_size(width) ? ' size' : ''),
  justifyContent: main_axis_layout.flex,
  [gapProperty]: main_axis_layout.gap && main_axis_layout.gap + 'px',
  ...overflow
});
const compute_style_for_layout_x_parent = props => compute_style_for_layout_parent('columnGap', props.layout_x, props.layout_y, props.height, props.width, props.overflow);
const compute_style_for_layout_y_parent = props => compute_style_for_layout_parent('rowGap', props.layout_y, props.layout_x, props.height, props.width, props.overflow);
const box = "box_bb7yjy4";
const column = "column_c1m6442m";
const row = "row_r8o4g34";

const ascended_background = 'ascended_background';
const background = 'background';
const foreground = 'foreground';

const Box_child_style_context = /*#__PURE__*/React.createContext();

const layout_children = (compute_style_for_layout_child, props) => /*#__PURE__*/React__default["default"].createElement(Box_child_style_context.Provider, {
  value: child_props => compute_style_for_layout_child(props, child_props)
}, props.children);

const Relative_child = ({
  props,
  child,
  position
}) => /*#__PURE__*/React__default["default"].createElement(Box_child_style_context.Provider, {
  value: child_props => compute_style_for_relative_child(props, child_props, position)
}, child);

const relative_position_defaults = {
  x: [0, 0],
  y: [0, 0],
  z: foreground
}; // TODO: the z ordering may be wrong here... e.g. maybe ascended relatives need to be ordered more precisely in front of all foreground relatives.

const prepare_relatives = props => {
  const background_relatives = [];
  const foreground_relatives = [];
  let index = 0;

  for (const [input_position, component] of props.relatives) {
    const position = { ...relative_position_defaults,
      ...input_position
    };
    const relative_child = /*#__PURE__*/React__default["default"].createElement(Relative_child, {
      props,
      child: component,
      position,
      key: index++
    });
    position.z === background || position.z === ascended_background ? background_relatives.push(relative_child) : foreground_relatives.push(relative_child);
  }

  return {
    background_relatives,
    foreground_relatives
  };
};

const layout_children_and_relatives = (compute_style_for_layout_child, props) => {
  const {
    background_relatives,
    foreground_relatives
  } = prepare_relatives(props);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, background_relatives, layout_children(compute_style_for_layout_child, props), foreground_relatives);
};
/*
	Layout boxes do not know whether they are layout children or relatives, nor anything about their parent.
	A layout box must consume a function from context that interprets its props according to the parent's concerns.
	When the layout box is a layout child, the parent provides a function that takes the child's props and returns layout child style.
	When the layout box is a relative, the parent provides a function that takes the child's props and returns relative style.

	The code could be organized such that a layout box's style is computed in 3 parts:
		- compute_style_as_layout_box - box properties that are not relevant to its role as parent or child e.g padding
		- compute_style_as_layout_parent - box properties that are relevant to its role as layout parent
		- compute_style_as_layout_box_child - box properties that are relevant to its role as box child
	
	For practical reasons, layout box style will also be implemented with a class name:
		- layout_class_name - static style for Layout_box (child or parent), static style as layout parent (flex-direction), semantic name for inspection
*/


const format_props = props => ({ ...props,
  height: props.height == undefined ? content : format_length(props.height),
  width: props.width == undefined ? content : format_length(props.width),
  tag: props.tag || 'div'
});

const Layout_box = /*#__PURE__*/React.forwardRef((_props, ref) => {
  const props = format_props(_props);
  const {
    class_name,
    element_props,
    layout_class_name,
    compute_style_as_layout_parent,
    compute_style_for_layout_child,
    tag: Tag
  } = props;
  return /*#__PURE__*/React__default["default"].createElement(Box_child_style_context.Consumer, null, compute_style_as_layout_box_child => /*#__PURE__*/React__default["default"].createElement(Tag, _extends__default["default"]({
    className: join_classnames(props.layout_class_name, props.class_name)
  }, element_props, {
    ref: ref,
    style: { ...compute_style_as_layout_parent(props),
      ...compute_style_as_layout_box_child(props),
      ...compute_style_as_layout_box(props),
      ...props.style
    }
  }), props.relatives && props.relatives.length > 0 ? layout_children_and_relatives(compute_style_for_layout_child, props) : layout_children(compute_style_for_layout_child, props)));
});

/*
	TODO: limit to one child: {React.Children.only(props.children)}
	Multiple words of text count as multiple children, so text cannot be direct children if this is in place.
*/

const Box = ({
  children,
  ...props
}) => /*#__PURE__*/React__default["default"].createElement(Layout_box, _extends__default["default"]({
  layout_class_name: box,
  compute_style_as_layout_parent: compute_style_for_layout_y_parent,
  compute_style_for_layout_child: compute_style_for_layout_y_child
}, props), children);

const Column = props => /*#__PURE__*/React__default["default"].createElement(Layout_box, _extends__default["default"]({
  layout_class_name: column,
  compute_style_as_layout_parent: compute_style_for_layout_y_parent,
  compute_style_for_layout_child: compute_style_for_layout_y_child
}, props));

var createRoot;

var m = require$$0__default["default"];

if (process.env.NODE_ENV === 'production') {
  createRoot = m.createRoot;
  m.hydrateRoot;
} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  createRoot = function (c, o) {
    i.usingClientEntryPoint = true;

    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}

var css_248z = ".body_b1yx4jx3 {display: flex; \tflex-direction: row; \tflex-wrap: nowrap; \talign-items: flex-start; \tjustify-content: flex-start; \tmin-height: 100vh; \tmargin: 0; \tpadding: 0;}\n\n.body_root_element_b1dynhyx {display: flex; \tflex-direction: row; \tflex-wrap: nowrap; \talign-items: flex-start; \tjustify-content: flex-start; \tflex: 1 1 100%; \talign-self: stretch;}\n\n";
styleInject(css_248z);

const container_css = `
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: flex-start;
	justify-content: flex-start;
`;
const body_css = `
	${container_css}
	min-height: 100vh;
	margin: 0;
	padding: 0;
`;
const body = "body_b1yx4jx3";
const body_root_element = "body_root_element_b1dynhyx";

const inject_style = string => {
  const style = document.createElement('style');
  style.textContent = string;
  document.head.append(style);
  return () => style.remove();
};

const mount_to_body = props => App => {
  const root_element = document.createElement('div');
  const root = createRoot(root_element);

  const unmount = () => {
    root.unmount();
    root_element.remove();
    uninject_body_style();
  };

  const create_app = props => /*#__PURE__*/React__default["default"].createElement(Box_child_style_context.Provider, {
    value: child_props => compute_style_for_layout_x_child({
      width: fill,
      height: fill
    }, child_props)
  }, /*#__PURE__*/React__default["default"].createElement(App, props));

  root_element.classList.add(body_root_element);
  const uninject_body_style = inject_style(`body { ${body_css} }`);
  document.body.append(root_element);
  return {
    unmount,
    render: props => root.render(create_app(props))
  };
};

/*
	overscroll-behavior configures scroll "chaining" and "affordances".
	When chaining is enabled, affordances must also be enabled, so `{ chaining: true, affordances: false }` expresses an invalid configuration,
	so this is not a good grammar for this API.

	As of 5-16-2022:
		Safari (15) does not support overscroll-behavior.
		Firefox has many strange behaviors related to overscroll-behavior on the body.
		The overscroll settings should be taken as suggestions.
*/
const overscroll_default = 'auto';
const overscroll_disabled = 'none';
const overscroll_contained = 'contain';
const clip = {
  overflowX: 'hidden',
  overflowY: 'hidden'
};
const clip_x = {
  overflowX: 'hidden',
  overflowY: 'visible'
};
const clip_y = {
  overflowX: 'visible',
  overflowY: 'hidden'
};
const scroll = ({
  overscroll: {
    x: overscroll_x = overscroll_default,
    y: overscroll_y = overscroll_default
  } = {}
} = {}) => ({
  overflowX: 'auto',
  overflowY: 'auto',
  overscrollBehaviorX: overscroll_x,
  overscrollBehaviorY: overscroll_y
});
const scroll_x = ({
  overscroll = overscroll_default
} = {}) => ({
  overflowX: 'auto',
  overflowY: 'hidden',
  overscrollBehaviorX: overscroll
});
const scroll_y = ({
  overscroll = overscroll_default
} = {}) => ({
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehaviorY: overscroll
});
const visible = {
  overflow: 'visible'
};

var overflow = /*#__PURE__*/Object.freeze({
	__proto__: null,
	overscroll_default: overscroll_default,
	overscroll_disabled: overscroll_disabled,
	overscroll_contained: overscroll_contained,
	clip: clip,
	clip_x: clip_x,
	clip_y: clip_y,
	scroll: scroll,
	scroll_x: scroll_x,
	scroll_y: scroll_y,
	visible: visible
});

const Row = props => /*#__PURE__*/React__default["default"].createElement(Layout_box, _extends__default["default"]({
  layout_class_name: row,
  compute_style_as_layout_parent: compute_style_for_layout_x_parent,
  compute_style_for_layout_child: compute_style_for_layout_x_child
}, props));

exports.Box = Box;
exports.Column = Column;
exports.Row = Row;
exports.align = align;
exports.body = body;
exports.body_root_element = body_root_element;
exports.content = content;
exports.edges = edges;
exports.fill = fill;
exports.format_length = format_length;
exports.grow = grow;
exports.max = max;
exports.min = min;
exports.mount_to_body = mount_to_body;
exports.overflow = overflow;
exports.px = px;
exports.ratio = ratio;
exports.to_css_value = to_css_value;
