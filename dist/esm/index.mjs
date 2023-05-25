import React, { createContext, useMemo, useRef, useState, useEffect, cloneElement, forwardRef, useImperativeHandle, useContext } from 'react';
import require$$0 from 'react-dom';

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
	center: center,
	end: end,
	space_around: space_around,
	space_between: space_between,
	space_evenly: space_evenly,
	start: start
});

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

const css_infinity = 100000000;
const convert_value = x => x === Infinity ? css_infinity : x;
const type_to_css = {
  px: value => value + 'px',
  ratio: value => value * 100 + '%'
  // math: ({ name, parameters }) => name + '(' + parameters.map(to_css_value).join(', ') + ')'
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
const expand = (expand => Object.assign(expand, expand({
  factor: 1
})))(value => ({
  type: 'expand',
  value
}));
const fill = (fill => Object.assign(fill, fill({})))(({
  factor = 1,
  maximum = Infinity
}) => ({
  type: 'fill',
  value: {
    factor,
    maximum: format_length(maximum)
  }
}));

// const func = name => parameters => ({ type: 'math', value: { name, parameters: parameters.map(format_length) } })

// export const max = func ('max')

// export const min = func ('min')

const identity = x => x;

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

var css_248z$2 = ".box_bb7yjy4 {\n\tbox-sizing: border-box; \tdisplay: flex; \tflex-direction: column;\n}\n\n.column_c1m6442m {\n\tbox-sizing: border-box; \tdisplay: flex; \tflex-direction: column;\n}\n\n.row_r8o4g34 {\n\tbox-sizing: border-box; \tdisplay: flex;\n\tflex-direction: row;\n}\n\n";
styleInject(css_248z$2);

/*
	ratio of main axis of a content-sized parent is incoherent - the parent's size is based on the child, and the child is expressing a ratio of the parent's size.
	ratio should mean "of space determined by the parent", which in this case is 0.
*/
const compute_layout_length = (parent_length, length) => length.type === 'ratio' && parent_length.type === 'grow' ? 0 : to_css_value(length);
const compute_style_for_cross_axis_height = (length, parent_length) => {
  const {
    type,
    value
  } = length;
  if (type === 'grow') {
    return value.factor > 0 ? {
      // `alignSelf: 'stretch'` is necessary because percentage height doesn't work on children of flex rows.
      alignSelf: 'stretch'
    } : null;
  } else if (type === 'fill') {
    return {
      // `[length_name]: 0` prevents content from growing this length.
      height: '0',
      // The desired length is instead expressed by `[min_length_name]`.
      minHeight: value.factor > 0 ? `min(100%, ${compute_layout_length(parent_length, value.maximum)})` : '0px'
    };
  } else if (type === 'expand') {
    return {
      maxHeight: '100%'
    };
  } else {
    return {
      height: compute_layout_length(parent_length, length)
    };
  }
};
const compute_style_for_cross_axis_width = (length, parent_length) => {
  const {
    type,
    value
  } = length;
  if (type === 'grow') {
    return value.factor > 0 ? {
      minWidth: '100%'
    } : null;
  } else if (type === 'fill') {
    return {
      // `[length_name]: 0` prevents content from growing this length.
      width: '0',
      // The desired length is instead expressed by `[min_length_name]`.
      minWidth: value.factor > 0 ? `min(100%, ${compute_layout_length(parent_length, value.maximum)})` : '0px'
    };
  } else if (type === 'expand') {
    return {
      maxWidth: '100%'
    };
  } else {
    return {
      width: compute_layout_length(parent_length, length)
    };
  }
};

// TODO: get rid of all whiteSpace, since that will now be a concern of <Text>
const compute_style_for_relative_length = (length_name, max_length_name, min_length_name, length) => {
  const {
    type,
    value
  } = length;
  if (type === 'grow') {
    return {
      // `[length_name]: 'max-content'` prevents text wrapping due to the default value `min-content`
      [length_name]: 'max-content',
      whiteSpace: 'nowrap',
      [min_length_name]: value.factor > 0 ? '100%' : 'auto'
    };
  } else if (type === 'fill') {
    return {
      whiteSpace: 'wrap',
      // `[length_name]: 0` prevents content from growing this length.
      [length_name]: '0',
      // The desired length is instead expressed by `[min_length_name]`.
      [min_length_name]: value.factor > 0 ? `min(100%, ${to_css_value(value.maximum)})` : '0px'
    };
  } else if (type === 'expand') {
    return {
      [max_length_name]: '100%'
    };
  } else {
    return {
      whiteSpace: 'wrap',
      [length_name]: to_css_value(length)
    };
  }
};
const compute_position_style_for_relative_child = (anchor_x, anchor_y, offset_x = 0, offset_y = 0) => ({
  position: 'absolute',
  left: anchor_x[1] * 100 + '%',
  top: anchor_y[1] * 100 + '%',
  transform: anchor_x[0] === 0 && anchor_y[0] === 0 && offset_x === 0 && offset_y === 0 ? null : `translate3d(calc(${anchor_x[0] * -100}% + ${offset_x}px), calc(${anchor_y[0] * -100}% + ${offset_y}px), 0)`
});
const compute_height_style_for_relative_child = height => compute_style_for_relative_length('height', 'maxHeight', 'minHeight', height);
const compute_width_style_for_relative_child = width => compute_style_for_relative_length('width', 'maxWidth', 'minWidth', width);
const compute_style_for_x_main_axis_length = parent_length => length => {
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
      maxWidth: compute_layout_length(parent_length, value.maximum),
      /*
      	The default minimum is `min-content`,
      	which means the length will be no less than that of children,
      	whereas `fill` should constrain the length to the available space,
      	causing the children to overflow when there is not enough space.
      */
      minWidth: 0
    };
  } else if (type === 'expand') {
    return {
      flex: `0 ${1 / value.factor} 100%`,
      maxWidth: 'max-content',
      minWidth: '0'
    };
  } else {
    return {
      /*
      	It is important to distinguish the semantics of `flex-basis` from `width`/`height`.
      	flex-basis of a child does not affect the height/width of a flex parent that gets its size from the child.
      	If a child is 100px wide, then for its flex parent to wrap around it and be 100px wide, the child must express `width: 100px` rather than `flex-basis: 100px`. If the child sets its width to 100px using flex-basis, then the flex parent that gets its width from that child will be 0px wide.
      */
      flex: '0 0 auto',
      width: compute_layout_length(parent_length, length)
    };
  }
};

// This would ideally be the same as for the x axis, but `expand` is problematic.
const compute_style_for_y_main_axis_length = parent_length => length => {
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
      maxHeight: compute_layout_length(parent_length, value.maximum),
      minHeight: 0
    };
  } else if (type === 'expand') {
    /*
    	TODO: this only produces the desired behavior when there is only a single child (e.g. Box)
    */
    return {
      flex: `0 ${1 / value.factor} auto`,
      maxHeight: '100%',
      minHeight: '0'
    };
  } else {
    return {
      /*
      	It is important to distinguish the semantics of `flex-basis` from `width`/`height`.
      	flex-basis of a child does not affect the height/width of a flex parent that gets its size from the child.
      	If a child is 100px wide, then for its flex parent to wrap around it and be 100px wide, the child must express `width: 100px` rather than `flex-basis: 100px`. If the child sets its width to 100px using flex-basis, then the flex parent that gets its width from that child will be 0px wide.
      */
      flex: '0 0 auto',
      height: compute_layout_length(parent_length, length)
    };
  }
};
const compute_position_style_for_layout_child = (anchor_x, anchor_y, offset_x, offset_y) => ({
  position: 'relative',
  transform: (offset_x || offset_y) && 'translate3d(' + offset_x + 'px, ' + offset_y + 'px, 0)'
});
const compute_height_style_for_layout_x_child = parent_height => height => compute_style_for_cross_axis_height(height, parent_height);
const compute_width_style_for_layout_x_child = compute_style_for_x_main_axis_length; // ('width', 'maxWidth', 'minWidth')

const compute_height_style_for_layout_y_child = compute_style_for_y_main_axis_length; // ('height', 'maxHeight', 'minHeight')

const compute_width_style_for_layout_y_child = parent_width => width => compute_style_for_cross_axis_width(width, parent_width);

// export const compute_wrap_and_length_style_for_layout_x_child = (parent_height, parent_width) => (child_height, child_width) => ({
// 	wrap: identity,
// 	style: {
// 		...compute_height_style_for_layout_x_child (parent_height, child_height),
// 		...compute_width_style_for_layout_x_child (parent_width, child_width)
// 	}
// })

// export const compute_wrap_and_length_style_for_layout_y_child = (parent_height, parent_width) => (child_height, child_width) => ({
// 	wrap: identity,
// 	style: {
// 		...compute_height_style_for_layout_y_child (parent_height, child_height),
// 		...compute_width_style_for_layout_y_child (parent_width, child_width)
// 	}
// })

const cross_axis_align = {
  'flex-start': 'flex-start',
  'center': 'center',
  'flex-end': 'flex-end',
  'space-around': 'center',
  'space-between': 'flex-start',
  'space-evenly': 'center'
};
const contains_size = length => length.type === 'px' || length.type === 'ratio';
const compute_contain = (height, width, overflow) => (overflow && overflow.overflowX === 'hidden' && overflow.overflowY === 'hidden' ? 'layout paint' : '') + (height && width && contains_size(height) && contains_size(width) ? ' size' : '');
const compute_style_for_layout_x_parent = (layout_x, layout_y) => ({
  alignItems: cross_axis_align[layout_y.flex],
  justifyContent: layout_x.flex,
  columnGap: layout_x.gap && layout_x.gap + 'px'
});
const compute_style_for_layout_y_parent = (layout_x, layout_y) => ({
  alignItems: cross_axis_align[layout_x.flex],
  justifyContent: layout_y.flex,
  rowGap: layout_y.gap && layout_y.gap + 'px'
});
const box = "box_bb7yjy4";
const column = "column_c1m6442m";
const row = "row_r8o4g34";

// TODO: expressions within this and/or the functions it calls could `useMemo`
const use_computation_y_context_value = (height, width) => (child_height, child_width) => [compute_height_style_for_layout_y_child(height)(child_height), compute_width_style_for_layout_y_child(width)(child_width), identity];

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

const Box_child_computation_context = /*#__PURE__*/createContext();
const Box_child_position_style_context = /*#__PURE__*/createContext();

var createRoot;
var m = require$$0;
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

const map = f => x => useMemo(() => f(x), [x]);
const map_all = f => (...x) => useMemo(() => f(...x), x);

const random_id = () => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
const Stack_context = /*#__PURE__*/createContext();
const find_insert_index = (nodes, node) => {
  let i = nodes.size;
  while (i > 0) {
    const x = node.compareDocumentPosition(nodes.get(i - 1));
    if (x & Node.DOCUMENT_POSITION_PRECEDING) {
      break;
    }
    --i;
  }
  return i;
};
const assign_keys = elements => elements.map((x, index) => x ? x.key === null ? /*#__PURE__*/cloneElement(x, {
  key: index
}) : x : null);
const compute_style_for_distant_length = (length_name, min_length_name) => parent_px => length => {
  const {
    type,
    value
  } = length;
  if (type === 'grow') {
    return {
      [length_name]: 'max-content',
      [min_length_name]: value.factor > 0 ? parent_px : 'auto'
    };
  } else if (type === 'fill') {
    return {
      [length_name]: '0px',
      [min_length_name]: value.factor > 0 ? `min(${parent_px}px, ${to_css_value(value.maximum)})` : '0px'
    };
  } else if (type === 'ratio') {
    return {
      [length_name]: parent_px * value + 'px'
    };
  } else {
    return {
      [length_name]: to_css_value(length)
    };
  }
};
const compute_style_for_distant_height = compute_style_for_distant_length('height', 'minHeight');
const compute_style_for_distant_width = compute_style_for_distant_length('width', 'minWidth');
const Representative = ({
  node,
  origin_node,
  children
}) => {
  const [node_height, set_node_height] = useState(0);
  const [node_width, set_node_width] = useState(0);
  const [position_offset, set_position_offset] = useState(null);
  useEffect(() => {
    if (!node) {
      return;
    }
    let frame_request_id;
    let cached_rect = {};
    let cached_origin_rect = {};
    const loop = () => {
      frame_request_id = window.requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const origin_rect = origin_node.getBoundingClientRect();
        if (rect.height !== cached_rect.height) {
          set_node_height(rect.height);
        }
        if (rect.width !== cached_rect.width) {
          set_node_width(rect.width);
        }
        if (rect.left !== cached_rect.left || rect.top !== cached_rect.top || origin_rect.left !== cached_origin_rect.left || origin_rect.top !== cached_origin_rect.top) {
          set_position_offset({
            left: rect.left - origin_rect.left,
            top: rect.top - origin_rect.top
          });
        }
        cached_rect = rect;
        cached_origin_rect = origin_rect;
        loop();
      });
    };
    loop();
    return () => window.cancelAnimationFrame(frame_request_id);
  }, [node]);
  const box_child_height_style_context_value = map(compute_style_for_distant_height)(node_height);
  const box_child_width_style_context_value = map(compute_style_for_distant_width)(node_width);
  const box_child_position_style_context_value = map_all((position_offset, parent_height, parent_width) => (anchor_x, anchor_y, offset_x = 0, offset_y = 0, ref) => position_offset === null ? {
    display: 'none'
  } : {
    position: 'absolute',
    transform: `translate3d(calc(${anchor_x[0] * -100}% + ${position_offset.left + parent_width * anchor_x[1] + offset_x}px), calc(${anchor_y[0] * -100}% + ${position_offset.top + parent_height * anchor_y[1] + offset_y}px), 0)`
  })(position_offset, node_height, node_width);

  // TODO: useMemo? All the child height/width context stuff is an inefficient mess.
  const child_computation_context_value = (height, width) => [box_child_height_style_context_value(height), box_child_width_style_context_value(width), identity];
  return /*#__PURE__*/React.createElement(Box_child_computation_context.Provider, {
    value: child_computation_context_value
  }, /*#__PURE__*/React.createElement(Box_child_position_style_context.Provider, {
    value: box_child_position_style_context_value
  }, children));
};
const Stack = ({
  children
}) => {
  const stack_dom_ref = useRef();
  const [ascendants, set_ascendants] = useState([]);
  const [descendants, set_descendants] = useState([]);
  const [state] = useState(() => {
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
        const id = random_id();

        /*
        const index = state.members.size === 0
        	? 0
        	: find_insert_index (state.indexes, node)
        */

        const index = state.initializing ? state.members.size : find_insert_index(state.indexes, node);
        for (let i = state.members.size - 1; i >= index; --i) {
          const node = state.indexes.get(i);
          const index = i + 1;
          state.members.set(node, index);
          state.indexes.set(index, node);
          state.ascendant_groups[index] = state.ascendant_groups[i];
          state.descendant_groups[index] = state.descendant_groups[i];
        }
        state.members.set(node, index);
        state.indexes.set(index, node);
        return {
          update_ascendants: ascendants => {
            const index = state.members.get(node);
            state.ascendant_groups[index] = /*#__PURE__*/React.createElement(Representative, {
              key: id,
              node: node,
              origin_node: stack_dom_ref.current.parentNode
            }, assign_keys(ascendants));
            set_ascendants(state.ascendant_groups.flat());
          },
          update_descendants: descendants => {
            const index = state.members.get(node);
            state.descendant_groups[index] = /*#__PURE__*/React.createElement(Representative, {
              key: id,
              node: node,
              origin_node: stack_dom_ref.current.parentNode
            }, assign_keys(descendants));
            set_descendants(state.descendant_groups.flat());
          },
          unregister: () => {
            const index = state.members.get(node);
            state.members.delete(node);
            state.indexes.delete(index);
            for (let i = index + 1; i < state.members.size; ++i) {
              const node = state.indexes.get(i);
              const index = i - 1;
              state.members.set(node, index);
              state.indexes.set(index, node);
              state.ascendant_groups[index] = state.ascendant_groups[i];
              state.descendant_groups[index] = state.descendant_groups[i];
              delete state.ascendant_groups[i];
              delete state.descendant_groups[i];
            }
            set_ascendants(state.ascendant_groups.flat());
            set_descendants(state.descendant_groups.flat());
          }
        };
      }
    };
    return state;
  });
  useEffect(() => {
    state.initializing = false;
  }, [state]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'none'
    },
    ref: stack_dom_ref
  }), /*#__PURE__*/React.createElement(Stack_context.Provider, {
    value: state
  }, descendants.length ? /*#__PURE__*/React.createElement(Stack, null, descendants) : null, children, ascendants.length ? /*#__PURE__*/React.createElement(Stack, null, ascendants) : null));
};

const call5 = (f, a, b, c, d, e) => f(a, b, c, d, e);
const create_object = () => Object.create(null);
const combine_component_styles = (contain, overflow, padding, style_as_layout_parent, height_style_as_layout_box_child, width_style_as_layout_box_child, position_style_as_layout_box_child, prop_style) => ({
  contain,
  padding,
  ...overflow,
  ...style_as_layout_parent,
  ...height_style_as_layout_box_child,
  ...width_style_as_layout_box_child,
  ...position_style_as_layout_box_child,
  ...prop_style
});
const relative_child_computation_context_value = (height, width) => [compute_height_style_for_relative_child(height), compute_width_style_for_relative_child(width), identity];
const with_default_key = (x, default_key) => x.key === null ? /*#__PURE__*/React.cloneElement(x, {
  key: default_key
}) : x;
const prepare_relatives = relatives => relatives ? /*#__PURE__*/React.createElement(Box_child_computation_context.Provider, {
  value: relative_child_computation_context_value
}, /*#__PURE__*/React.createElement(Box_child_position_style_context.Provider, {
  value: compute_position_style_for_relative_child
}, relatives.map(with_default_key))) : null;

/*
	Layout boxes do not know whether they are layout children or relatives, nor anything about their parent.
	A layout box must consume a function from context that interprets its props according to the parent's concerns.
	A layout box's parent provides a function that takes the child's props and returns style computed from props of the parent and the child.
	When the layout box is a relative, the parent provides a function that takes the child's props and returns relative style.

	layout box's style has 3 main parts:
		- compute_style_as_layout_box - box properties that are not relevant to its role as parent or child e.g padding
		- compute_style_as_layout_parent - box properties that are relevant to its role as layout parent
		- compute_style_as_layout_box_child - box properties that are relevant to its role as box child
	
	For practical/performance reasons, the code is not cleanly organized/abstracted as discussed here,
	and layout box style is also implemented with a class name:
		- layout_class_name - static style for Layout_box (child or parent), static style as layout parent (flex-direction), semantic name for inspection
*/

/*
	These props are passed in by Box, Column, and Row, and never change:
		- layout_class_name
		- compute_style_as_layout_parent
		- compute_height_style_for_layout_child
		- compute_width_style_for_layout_child
*/

const anchor_default = [0, 0];
const prepare_anchor = x => x || anchor_default;
const prepare_layout = x => x || start;
const prepare_length = x => x == undefined ? content : format_length(x);
const prepare_padding = x => x && padding_to_css(x);
const prepare_tag = x => x || 'div';
const Layout_box = /*#__PURE__*/forwardRef(({
  ascended,
  anchor_x: prop_anchor_x,
  anchor_y: prop_anchor_y,
  background: prop_background,
  children,
  class_name,
  compute_style_as_layout_parent,
  descended,
  element_props,
  foreground: prop_foreground,
  height: prop_height,
  layout_class_name,
  layout_x: prop_layout_x,
  layout_y: prop_layout_y,
  padding: prop_padding,
  offset_x,
  offset_y,
  overflow,
  style: prop_style,
  tag,
  use_computation_context_value,
  width: prop_width
}, _ref) => {
  const ref = useRef();
  useImperativeHandle(_ref, () => ref.current);
  const anchor_x = map(prepare_anchor)(prop_anchor_x);
  const anchor_y = map(prepare_anchor)(prop_anchor_y);
  const height = map(prepare_length)(prop_height);
  const layout_x = map(prepare_layout)(prop_layout_x);
  const layout_y = map(prepare_layout)(prop_layout_y);
  const padding = map(prepare_padding)(prop_padding);
  const Tag = map(prepare_tag)(tag);
  const width = map(prepare_length)(prop_width);
  const compute_position_style_as_layout_box_child = useContext(Box_child_position_style_context);
  const [height_style_as_layout_box_child, width_style_as_layout_box_child, context_transform] = useContext(Box_child_computation_context)(height, width);
  const className = map(x => join_classnames(layout_class_name, x))(class_name);
  const contain = map_all(compute_contain)(height, width, overflow);
  const style_as_layout_parent = map_all(compute_style_as_layout_parent)(layout_x, layout_y);
  const position_style_as_layout_box_child = map_all(call5)(compute_position_style_as_layout_box_child, anchor_x, anchor_y, offset_x, offset_y, ref.current);
  const stack = useContext(Stack_context);
  const [state] = useState(create_object);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (ascended && ascended.length && !state.stack) {
      state.stack = stack.register(ref.current);
    }
    if (state.stack) {
      state.stack.update_ascendants(ascended || []);
    }
    return () => {
      if (state.stack && !ascended?.length && !descended?.length) {
        state.stack.unregister();
        state.stack = null;
      }
    };
  }, [ascended, ref.current]);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (descended && descended.length && !state.stack) {
      state.stack = stack.register(ref.current);
    }
    if (state.stack) {
      state.stack.update_descendants(descended || []);
    }
    return () => {
      if (state.stack && !ascended?.length && !descended?.length) {
        state.stack.unregister();
        state.stack = null;
      }
    };
  }, [descended, ref.current]);
  useEffect(() => () => state.stack && state.stack.unregister(), []);
  const style = map_all(combine_component_styles)(contain, overflow, padding, style_as_layout_parent, height_style_as_layout_box_child, width_style_as_layout_box_child, position_style_as_layout_box_child, prop_style);
  const child_computation_context_value = use_computation_context_value(height, width);
  const background = map(prepare_relatives)(prop_background);
  const foreground = map(prepare_relatives)(prop_foreground);
  return context_transform( /*#__PURE__*/React.createElement(Tag, _extends({}, element_props, {
    className: className,
    ref: ref,
    style: style
  }), background, /*#__PURE__*/React.createElement(Box_child_computation_context.Provider, {
    value: child_computation_context_value
  }, /*#__PURE__*/React.createElement(Box_child_position_style_context.Provider, {
    value: compute_position_style_for_layout_child
  }, children)), foreground));
});

/*
	TODO: limit to one child: {React.Children.only(props.children)}
	Multiple words of text count as multiple children, so text cannot be direct children if this is in place.
*/
const Box = /*#__PURE__*/forwardRef(({
  children,
  ...props
}, ref) => /*#__PURE__*/React.createElement(Layout_box, _extends({
  compute_style_as_layout_parent: compute_style_for_layout_y_parent,
  use_computation_context_value: use_computation_y_context_value,
  layout_class_name: box,
  ref: ref
}, props), children));

const Column = /*#__PURE__*/forwardRef((props, ref) => /*#__PURE__*/React.createElement(Layout_box, _extends({
  compute_style_as_layout_parent: compute_style_for_layout_y_parent,
  use_computation_context_value: use_computation_y_context_value,
  layout_class_name: column,
  ref: ref
}, props)));

const x = n => ({
  left: n,
  right: n
});
const y = n => ({
  top: n,
  bottom: n
});
const xy = a => b => ({
  ...x(a),
  ...y(b)
});
const edges = Object.assign(n => ({
  top: n,
  bottom: n,
  left: n,
  right: n
}), {
  x,
  xy,
  y
});

const inject_style = string => {
  const style = document.createElement('style');
  style.textContent = string;
  document.head.append(style);
  return () => style.remove();
};

// TODO: expressions within this and/or the functions it calls could `useMemo`
const child_computation_context_value = (height, width) => [compute_height_style_for_layout_x_child(fill)(height), compute_width_style_for_layout_x_child(fill)(width), identity];

// TODO: accept only one child!
const Ui_Context = ({
  children
}) => /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(Box_child_computation_context.Provider, {
  value: child_computation_context_value
}, /*#__PURE__*/React.createElement(Box_child_position_style_context.Provider, {
  value: compute_position_style_for_layout_child
}, children)));

var css_248z$1 = ".body_b1yip317 {display: flex; \tflex-direction: row; \tflex-wrap: nowrap; \talign-items: flex-start; \tjustify-content: flex-start; \tmin-height: 100vh; \tmargin: 0; \tpadding: 0;}\n\n.body_root_element_b1hyngkr {display: flex; \tflex-direction: row; \tflex-wrap: nowrap; \talign-items: flex-start; \tjustify-content: flex-start; \tflex: 1 1 100%; \talign-self: stretch;}\n\n";
styleInject(css_248z$1);

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
const inject_body_style = () => inject_style(`body { ${body_css} }`);
const body = "body_b1yip317";
const body_root_element = "body_root_element_b1hyngkr";
const create_mount_to_body = ({
  createRoot
}) => options => App => {
  const root_element = document.createElement('div');
  const root = createRoot(root_element);
  const unmount = () => {
    root.unmount();
    root_element.remove();
    uninject_body_style();
  };
  root_element.classList.add(body_root_element);
  const uninject_body_style = inject_body_style();
  document.body.append(root_element);
  return {
    unmount,
    render: props => root.render( /*#__PURE__*/React.createElement(Ui_Context, null, /*#__PURE__*/React.createElement(App, props)))
  };
};
const mount_to_body = create_mount_to_body({
  createRoot: createRoot
});

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
	clip: clip,
	clip_x: clip_x,
	clip_y: clip_y,
	overscroll_contained: overscroll_contained,
	overscroll_default: overscroll_default,
	overscroll_disabled: overscroll_disabled,
	scroll: scroll,
	scroll_x: scroll_x,
	scroll_y: scroll_y,
	visible: visible
});

var css_248z = ".row_height_fill_child_wrapper_rpzldh1 {\n\talign-self: stretch;\n\t& > * {\n\t\theight: 100%;\n\t}\n}\n\n";
styleInject(css_248z);

const row_height_fill_child_wrapper = "row_height_fill_child_wrapper_rpzldh1";
const wrap = (component, parent_width, child_width) => /*#__PURE__*/React.createElement("div", {
  className: row_height_fill_child_wrapper,
  style: compute_width_style_for_layout_x_child(parent_width)(child_width)
}, component);
const wrap_height_fill_child = (height, width) => (child_height, child_width) => child_height.type === 'fill' ? [compute_height_style_for_layout_x_child(height)(child_height), null, component => wrap(component, width, child_width)] : not_wrapped(height, width)(child_height, child_width);
const not_wrapped = (height, width) => (child_height, child_width) => [compute_height_style_for_layout_x_child(height)(child_height), compute_width_style_for_layout_x_child(width)(child_width), identity];

// TODO: expressions within this and/or the functions it calls could `useMemo`
const use_computation_context_value = (height, width) => (height.type === 'grow' ? wrap_height_fill_child : not_wrapped)(height, width);
const Row = /*#__PURE__*/forwardRef((props, ref) => /*#__PURE__*/React.createElement(Layout_box, _extends({
  compute_style_as_layout_parent: compute_style_for_layout_x_parent,
  use_computation_context_value: use_computation_context_value,
  layout_class_name: row,
  ref: ref
}, props)));

export { Box, Column, Row, Stack, Stack_context, Ui_Context, align, body, body_root_element, content, create_mount_to_body, edges, expand, fill, format_length, grow, inject_body_style, mount_to_body, overflow, px, ratio, to_css_value };
