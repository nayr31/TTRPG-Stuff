"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const obsidian = require("obsidian");
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_svg_attributes(node, attributes) {
  for (const key in attributes) {
    attr(node, key, attributes[key]);
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
  const options = { direction: "both" };
  let config = fn(node, params, options);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;
  function clear_animation() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function init2(program, duration) {
    const d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }
  function go(b) {
    const { delay = 0, duration = 300, easing = identity, tick: tick2 = noop, css } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };
    if (!b) {
      program.group = outros;
      outros.r += 1;
    }
    if (running_program || pending_program) {
      pending_program = program;
    } else {
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }
      if (b)
        tick2(0, 1);
      running_program = init2(program, duration);
      add_render_callback(() => dispatch(node, b, "start"));
      loop((now2) => {
        if (pending_program && now2 > pending_program.start) {
          running_program = init2(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, "start");
          if (css) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }
        if (running_program) {
          if (now2 >= running_program.end) {
            tick2(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, "end");
            if (!pending_program) {
              if (running_program.b) {
                clear_animation();
              } else {
                if (!--running_program.group.r)
                  run_all(running_program.group.c);
              }
            }
            running_program = null;
          } else if (now2 >= running_program.start) {
            const p = now2 - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick2(t, 1 - t);
          }
        }
        return !!(running_program || pending_program);
      });
    }
  }
  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          config = config(options);
          go(b);
        });
      } else {
        go(b);
      }
    },
    end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
class State {
  constructor() {
    __publicField(this, "debug", false);
    __publicField(this, "sections");
  }
}
/**
 * @license lucide-svelte v0.331.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const defaultAttributes$1 = defaultAttributes;
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[10] = list[i][0];
  child_ctx[11] = list[i][1];
  return child_ctx;
}
function create_dynamic_element(ctx) {
  let svelte_element;
  let svelte_element_levels = [ctx[11]];
  let svelte_element_data = {};
  for (let i = 0; i < svelte_element_levels.length; i += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  }
  return {
    c() {
      svelte_element = svg_element(ctx[10]);
      set_svg_attributes(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert(target, svelte_element, anchor);
    },
    p(ctx2, dirty) {
      set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & 32 && ctx2[11]]));
    },
    d(detaching) {
      if (detaching)
        detach(svelte_element);
    }
  };
}
function create_each_block$4(ctx) {
  let previous_tag = ctx[10];
  let svelte_element_anchor;
  let svelte_element = ctx[10] && create_dynamic_element(ctx);
  return {
    c() {
      if (svelte_element)
        svelte_element.c();
      svelte_element_anchor = empty();
    },
    m(target, anchor) {
      if (svelte_element)
        svelte_element.m(target, anchor);
      insert(target, svelte_element_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (ctx2[10]) {
        if (!previous_tag) {
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = ctx2[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else if (safe_not_equal(previous_tag, ctx2[10])) {
          svelte_element.d(1);
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = ctx2[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else {
          svelte_element.p(ctx2, dirty);
        }
      } else if (previous_tag) {
        svelte_element.d(1);
        svelte_element = null;
        previous_tag = ctx2[10];
      }
    },
    d(detaching) {
      if (detaching)
        detach(svelte_element_anchor);
      if (svelte_element)
        svelte_element.d(detaching);
    }
  };
}
function create_fragment$h(ctx) {
  var _a;
  let svg;
  let each_1_anchor;
  let svg_stroke_width_value;
  let svg_class_value;
  let current;
  let each_value = ctx[5];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
  }
  const default_slot_template = ctx[9].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[8], null);
  let svg_levels = [
    defaultAttributes$1,
    ctx[6],
    { width: ctx[2] },
    { height: ctx[2] },
    { stroke: ctx[1] },
    {
      "stroke-width": svg_stroke_width_value = ctx[4] ? Number(ctx[3]) * 24 / Number(ctx[2]) : ctx[3]
    },
    {
      class: svg_class_value = `lucide-icon lucide lucide-${ctx[0]} ${(_a = ctx[7].class) != null ? _a : ""}`
    }
  ];
  let svg_data = {};
  for (let i = 0; i < svg_levels.length; i += 1) {
    svg_data = assign(svg_data, svg_levels[i]);
  }
  return {
    c() {
      svg = svg_element("svg");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.c();
      set_svg_attributes(svg, svg_data);
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(svg, null);
        }
      }
      append(svg, each_1_anchor);
      if (default_slot) {
        default_slot.m(svg, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      var _a2;
      if (dirty & 32) {
        each_value = ctx2[5];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$4(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(svg, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 256)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[8],
            !current ? get_all_dirty_from_scope(ctx2[8]) : get_slot_changes(default_slot_template, ctx2[8], dirty, null),
            null
          );
        }
      }
      set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
        defaultAttributes$1,
        dirty & 64 && ctx2[6],
        (!current || dirty & 4) && { width: ctx2[2] },
        (!current || dirty & 4) && { height: ctx2[2] },
        (!current || dirty & 2) && { stroke: ctx2[1] },
        (!current || dirty & 28 && svg_stroke_width_value !== (svg_stroke_width_value = ctx2[4] ? Number(ctx2[3]) * 24 / Number(ctx2[2]) : ctx2[3])) && { "stroke-width": svg_stroke_width_value },
        (!current || dirty & 129 && svg_class_value !== (svg_class_value = `lucide-icon lucide lucide-${ctx2[0]} ${(_a2 = ctx2[7].class) != null ? _a2 : ""}`)) && { class: svg_class_value }
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(svg);
      destroy_each(each_blocks, detaching);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  const omit_props_names = ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { name } = $$props;
  let { color = "currentColor" } = $$props;
  let { size = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode } = $$props;
  $$self.$$set = ($$new_props) => {
    $$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("name" in $$new_props)
      $$invalidate(0, name = $$new_props.name);
    if ("color" in $$new_props)
      $$invalidate(1, color = $$new_props.color);
    if ("size" in $$new_props)
      $$invalidate(2, size = $$new_props.size);
    if ("strokeWidth" in $$new_props)
      $$invalidate(3, strokeWidth = $$new_props.strokeWidth);
    if ("absoluteStrokeWidth" in $$new_props)
      $$invalidate(4, absoluteStrokeWidth = $$new_props.absoluteStrokeWidth);
    if ("iconNode" in $$new_props)
      $$invalidate(5, iconNode = $$new_props.iconNode);
    if ("$$scope" in $$new_props)
      $$invalidate(8, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [
    name,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode,
    $$restProps,
    $$props,
    $$scope,
    slots
  ];
}
class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, {
      name: 0,
      color: 1,
      size: 2,
      strokeWidth: 3,
      absoluteStrokeWidth: 4,
      iconNode: 5
    });
  }
}
const Icon$1 = Icon;
function create_default_slot$9(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$g(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "arrow-down-from-line" },
    ctx[1],
    { iconNode: ctx[0] }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$9] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M19 3H5" }],
    ["path", { "d": "M12 21V7" }],
    ["path", { "d": "m6 15 6 6 6-6" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Arrow_down_from_line extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, {});
  }
}
const ArrowDownFromLine = Arrow_down_from_line;
function create_default_slot$8(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$f(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "arrow-up-from-line" },
    ctx[1],
    { iconNode: ctx[0] }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$8] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "m18 9-6-6-6 6" }],
    ["path", { "d": "M12 3v14" }],
    ["path", { "d": "M5 21h14" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Arrow_up_from_line extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {});
  }
}
const ArrowUpFromLine = Arrow_up_from_line;
function create_default_slot$7(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$e(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "minus-square" },
    ctx[1],
    { iconNode: ctx[0] }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$7] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
      }
    ],
    ["path", { "d": "M8 12h8" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Minus_square extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {});
  }
}
const MinusSquare = Minus_square;
function create_default_slot$6(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$d(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "pause" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$6] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "rect",
      {
        "width": "4",
        "height": "16",
        "x": "6",
        "y": "4"
      }
    ],
    [
      "rect",
      {
        "width": "4",
        "height": "16",
        "x": "14",
        "y": "4"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Pause extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {});
  }
}
const Pause$1 = Pause;
function create_default_slot$5(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$c(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "pie-chart" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$5] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M21.21 15.89A10 10 0 1 1 8 2.83" }],
    ["path", { "d": "M22 12A10 10 0 0 0 12 2v10z" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Pie_chart extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {});
  }
}
const PieChart = Pie_chart;
function create_default_slot$4(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "play" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$4] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["polygon", { "points": "5 3 19 12 5 21 5 3" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Play extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {});
  }
}
const Play$1 = Play;
function create_default_slot$3(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$a(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "plus-square" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$3] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
      }
    ],
    ["path", { "d": "M8 12h8" }],
    ["path", { "d": "M12 8v8" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Plus_square extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {});
  }
}
const PlusSquare = Plus_square;
function create_default_slot$2(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "refresh-ccw" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    ],
    ["path", { "d": "M3 3v5h5" }],
    [
      "path",
      {
        "d": "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
      }
    ],
    ["path", { "d": "M16 16h5v5" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Refresh_ccw extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {});
  }
}
const RefreshCcw = Refresh_ccw;
function create_default_slot$1(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$8(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "timer" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "line",
      {
        "x1": "10",
        "x2": "14",
        "y1": "2",
        "y2": "2"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "15",
        "y1": "14",
        "y2": "11"
      }
    ],
    ["circle", { "cx": "12", "cy": "14", "r": "8" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Timer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {});
  }
}
const Timer$1 = Timer;
function create_default_slot(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$7(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [{ name: "trash-2" }, ctx[1], { iconNode: ctx[0] }];
  let icon_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & 3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & 2 && get_spread_object(ctx2[1]),
        dirty & 1 && { iconNode: ctx2[0] }
      ]) : {};
      if (dirty & 8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      {
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      }
    ],
    [
      "path",
      {
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "10",
        "y1": "11",
        "y2": "17"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "11",
        "y2": "17"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Trash_2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {});
  }
}
const Trash2 = Trash_2;
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function ifClickEquivalent(fn) {
  return (e) => {
    if (["Enter", " "].contains(e.key)) {
      fn(e);
      e.preventDefault();
    }
  };
}
function create_else_block$3(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(input, ctx[2]);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[7]),
          action_destroyer(takeFocus$1.call(null, input)),
          listen(input, "keydown", ctx[5])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 4 && input.value !== ctx2[2]) {
        set_input_value(input, ctx2[2]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$5(ctx) {
  let span;
  let t0;
  let t1;
  let mounted;
  let dispose;
  let if_block = ctx[1] == "" && create_if_block_1$3();
  return {
    c() {
      span = element("span");
      if (if_block)
        if_block.c();
      t0 = space();
      t1 = text(ctx[1]);
      attr(span, "role", "button");
      attr(span, "tabindex", "0");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (if_block)
        if_block.m(span, null);
      append(span, t0);
      append(span, t1);
      ctx[6](span);
      if (!mounted) {
        dispose = [
          listen(span, "click", ctx[4]),
          listen(span, "keydown", ifClickEquivalent(ctx[4]))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (ctx2[1] == "") {
        if (if_block)
          ;
        else {
          if_block = create_if_block_1$3();
          if_block.c();
          if_block.m(span, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 2)
        set_data(t1, ctx2[1]);
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if (if_block)
        if_block.d();
      ctx[6](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$3(ctx) {
  let t;
  return {
    c() {
      t = text("\xA0");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_fragment$6(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[0] === EditMode$1.Read)
      return create_if_block$5;
    return create_else_block$3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
var EditMode$1;
(function(EditMode2) {
  EditMode2[EditMode2["Read"] = 0] = "Read";
  EditMode2[EditMode2["Edit"] = 1] = "Edit";
})(EditMode$1 || (EditMode$1 = {}));
function takeFocus$1(el) {
  el.focus();
  el.select();
}
function instance$6($$self, $$props, $$invalidate) {
  const dispatch2 = createEventDispatcher();
  let { value = "" } = $$props;
  let newValue = value;
  let focusTarget;
  let { mode = EditMode$1.Read } = $$props;
  function startEditing() {
    $$invalidate(0, mode = EditMode$1.Edit);
  }
  function onKeyDown(e) {
    if (e.key === "Enter") {
      $$invalidate(1, value = $$invalidate(2, newValue = newValue.trim()));
      $$invalidate(0, mode = EditMode$1.Read);
      dispatch2("confirmed", { value });
    } else if (e.key === "Escape") {
      $$invalidate(2, newValue = value);
      $$invalidate(0, mode = EditMode$1.Read);
      dispatch2("cancelled", { value });
    }
    tick().then(() => focusTarget === null || focusTarget === void 0 ? void 0 : focusTarget.focus());
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      focusTarget = $$value;
      $$invalidate(3, focusTarget);
    });
  }
  function input_input_handler() {
    newValue = this.value;
    $$invalidate(2, newValue);
  }
  $$self.$$set = ($$props2) => {
    if ("value" in $$props2)
      $$invalidate(1, value = $$props2.value);
    if ("mode" in $$props2)
      $$invalidate(0, mode = $$props2.mode);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      dispatch2("modeChanged", { mode });
    }
  };
  return [
    mode,
    value,
    newValue,
    focusTarget,
    startEditing,
    onKeyDown,
    span_binding,
    input_input_handler
  ];
}
class EditableText extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 1, mode: 0 });
  }
}
function create_else_block$2(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(input, ctx[2]);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[8]),
          action_destroyer(takeFocus.call(null, input)),
          listen(input, "keydown", ctx[5])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 4 && input.value !== ctx2[2]) {
        set_input_value(input, ctx2[2]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$4(ctx) {
  let span;
  let t;
  let mounted;
  let dispose;
  return {
    c() {
      span = element("span");
      t = text(ctx[1]);
      attr(span, "role", "button");
      attr(span, "tabindex", "0");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
      ctx[7](span);
      if (!mounted) {
        dispose = [
          listen(span, "click", prevent_default(ctx[4])),
          listen(span, "keydown", ctx[6])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t, ctx2[1]);
    },
    d(detaching) {
      if (detaching)
        detach(span);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$5(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[0] === EditMode.Read)
      return create_if_block$4;
    return create_else_block$2;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
var EditMode;
(function(EditMode2) {
  EditMode2[EditMode2["Read"] = 0] = "Read";
  EditMode2[EditMode2["Edit"] = 1] = "Edit";
})(EditMode || (EditMode = {}));
function takeFocus(el) {
  el.focus();
  el.select();
}
function instance$5($$self, $$props, $$invalidate) {
  const dispatch2 = createEventDispatcher();
  let { value = 0 } = $$props;
  let newValue = value.toString();
  let focusTarget;
  let { mode = EditMode.Read } = $$props;
  function startEditing() {
    if (!newValue.startsWith("+") && !newValue.startsWith("-")) {
      $$invalidate(2, newValue = value.toString());
    }
    $$invalidate(0, mode = EditMode.Edit);
  }
  function onEditKeyDown(e) {
    if (e.key === "Enter") {
      $$invalidate(2, newValue = newValue.trim());
      if (newValue.startsWith("+") || newValue.startsWith("-")) {
        $$invalidate(1, value += Number(newValue));
      } else {
        $$invalidate(1, value = Number(newValue));
      }
      $$invalidate(0, mode = EditMode.Read);
      dispatch2("confirmed", { value });
    } else if (e.key === "Escape") {
      $$invalidate(0, mode = EditMode.Read);
      dispatch2("cancelled", { value });
    }
    tick().then(() => focusTarget === null || focusTarget === void 0 ? void 0 : focusTarget.focus());
  }
  function onSpanKeyDown(e) {
    if (["Enter", " "].contains(e.key)) {
      startEditing();
      e.preventDefault();
    } else if (["ArrowUp", "ArrowRight"].contains(e.key)) {
      $$invalidate(1, value += 1);
      e.preventDefault();
    } else if (["ArrowDown", "ArrowLeft"].contains(e.key)) {
      $$invalidate(1, value -= 1);
      e.preventDefault();
    }
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      focusTarget = $$value;
      $$invalidate(3, focusTarget);
    });
  }
  function input_input_handler() {
    newValue = this.value;
    $$invalidate(2, newValue);
  }
  $$self.$$set = ($$props2) => {
    if ("value" in $$props2)
      $$invalidate(1, value = $$props2.value);
    if ("mode" in $$props2)
      $$invalidate(0, mode = $$props2.mode);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      dispatch2("modeChanged", { mode });
    }
  };
  return [
    mode,
    value,
    newValue,
    focusTarget,
    startEditing,
    onEditKeyDown,
    onSpanKeyDown,
    span_binding,
    input_input_handler
  ];
}
class EditableNumber extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, { value: 1, mode: 0 });
  }
}
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i].x1;
  child_ctx[12] = list[i].x2;
  child_ctx[13] = list[i].y1;
  child_ctx[14] = list[i].y2;
  child_ctx[15] = list[i].isFilled;
  child_ctx[17] = i;
  return child_ctx;
}
function create_if_block$3(ctx) {
  let each_1_anchor;
  let each_value = ctx[3](ctx[0], ctx[1]);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 11) {
        each_value = ctx2[3](ctx2[0], ctx2[1]);
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_each_block$3(ctx) {
  let path;
  let path_data_filled_value;
  let path_d_value;
  return {
    c() {
      path = svg_element("path");
      attr(path, "data-segment", ctx[17]);
      attr(path, "data-filled", path_data_filled_value = ctx[15]);
      attr(path, "d", path_d_value = "\n        M " + (radius + padding) + " " + (radius + padding) + "\n        L " + ctx[11] + " " + ctx[13] + "\n        A " + radius + " " + radius + " 0 0 1 " + ctx[12] + " " + ctx[14] + "\n        Z");
    },
    m(target, anchor) {
      insert(target, path, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 3 && path_data_filled_value !== (path_data_filled_value = ctx2[15])) {
        attr(path, "data-filled", path_data_filled_value);
      }
      if (dirty & 3 && path_d_value !== (path_d_value = "\n        M " + (radius + padding) + " " + (radius + padding) + "\n        L " + ctx2[11] + " " + ctx2[13] + "\n        A " + radius + " " + radius + " 0 0 1 " + ctx2[12] + " " + ctx2[14] + "\n        Z")) {
        attr(path, "d", path_d_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(path);
    }
  };
}
function create_fragment$4(ctx) {
  let div1;
  let svg;
  let circle;
  let t0;
  let div0;
  let button0;
  let minussquare;
  let t1;
  let button1;
  let plussquare;
  let t2;
  let button2;
  let arrowdownfromline;
  let t3;
  let button3;
  let arrowupfromline;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[0] > 1 && create_if_block$3(ctx);
  minussquare = new MinusSquare({});
  plussquare = new PlusSquare({});
  arrowdownfromline = new ArrowDownFromLine({});
  arrowupfromline = new ArrowUpFromLine({});
  return {
    c() {
      div1 = element("div");
      svg = svg_element("svg");
      if (if_block)
        if_block.c();
      circle = svg_element("circle");
      t0 = space();
      div0 = element("div");
      button0 = element("button");
      create_component(minussquare.$$.fragment);
      t1 = space();
      button1 = element("button");
      create_component(plussquare.$$.fragment);
      t2 = space();
      button2 = element("button");
      create_component(arrowdownfromline.$$.fragment);
      t3 = space();
      button3 = element("button");
      create_component(arrowupfromline.$$.fragment);
      attr(circle, "cx", radius + padding);
      attr(circle, "cy", radius + padding);
      attr(circle, "r", radius);
      attr(circle, "data-filled", ctx[2]);
      attr(svg, "data-segments", ctx[0]);
      attr(svg, "data-filled", ctx[1]);
      attr(svg, "role", "button");
      attr(svg, "tabindex", "0");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "viewBox", "0 0 " + (2 * radius + 2 * padding) + " " + (2 * radius + 2 * padding));
      attr(button0, "class", "progress-clocks-clock__decrement");
      attr(button0, "title", "Unfill one segment");
      attr(button1, "class", "progress-clocks-clock__increment");
      attr(button1, "title", "Fill one segment");
      attr(button2, "class", "progress-clocks-clock__decrement-segments");
      attr(button2, "title", "Remove one segment");
      attr(button3, "class", "progress-clocks-clock__increment-segments");
      attr(button3, "title", "Add another segment");
      attr(div0, "class", "progress-clocks-clock__buttons");
      attr(div1, "class", "progress-clocks-clock");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, svg);
      if (if_block)
        if_block.m(svg, null);
      append(svg, circle);
      append(div1, t0);
      append(div1, div0);
      append(div0, button0);
      mount_component(minussquare, button0, null);
      append(div0, t1);
      append(div0, button1);
      mount_component(plussquare, button1, null);
      append(div0, t2);
      append(div0, button2);
      mount_component(arrowdownfromline, button2, null);
      append(div0, t3);
      append(div0, button3);
      mount_component(arrowupfromline, button3, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(svg, "click", prevent_default(ctx[4])),
          listen(svg, "contextmenu", prevent_default(ctx[5])),
          listen(svg, "keydown", ctx[6]),
          listen(button0, "click", prevent_default(ctx[5])),
          listen(button0, "keydown", ifClickEquivalent(ctx[5])),
          listen(button1, "click", prevent_default(ctx[4])),
          listen(button1, "keydown", ifClickEquivalent(ctx[4])),
          listen(button2, "click", prevent_default(ctx[7])),
          listen(button2, "keydown", function() {
            if (is_function(ifClickEquivalent(ctx[8])))
              ifClickEquivalent(ctx[8]).apply(this, arguments);
          }),
          listen(button3, "click", prevent_default(ctx[9])),
          listen(button3, "keydown", function() {
            if (is_function(ifClickEquivalent(ctx[10])))
              ifClickEquivalent(ctx[10]).apply(this, arguments);
          })
        ];
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (ctx[0] > 1) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block$3(ctx);
          if_block.c();
          if_block.m(svg, circle);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (!current || dirty & 4) {
        attr(circle, "data-filled", ctx[2]);
      }
      if (!current || dirty & 1) {
        attr(svg, "data-segments", ctx[0]);
      }
      if (!current || dirty & 2) {
        attr(svg, "data-filled", ctx[1]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(minussquare.$$.fragment, local);
      transition_in(plussquare.$$.fragment, local);
      transition_in(arrowdownfromline.$$.fragment, local);
      transition_in(arrowupfromline.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(minussquare.$$.fragment, local);
      transition_out(plussquare.$$.fragment, local);
      transition_out(arrowdownfromline.$$.fragment, local);
      transition_out(arrowupfromline.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      if (if_block)
        if_block.d();
      destroy_component(minussquare);
      destroy_component(plussquare);
      destroy_component(arrowdownfromline);
      destroy_component(arrowupfromline);
      mounted = false;
      run_all(dispose);
    }
  };
}
const radius = 50;
const padding = 4;
function instance$4($$self, $$props, $$invalidate) {
  let fillCircle;
  let { segments = 4 } = $$props;
  let { filled = 0 } = $$props;
  function slices(segments2, filled2) {
    const ss = [];
    for (let i = 0; i < segments2; ++i) {
      const x1 = radius * Math.sin(2 * Math.PI * i / segments2) + radius + padding;
      const x2 = radius * Math.sin(2 * Math.PI * (i + 1) / segments2) + radius + padding;
      const y1 = -radius * Math.cos(2 * Math.PI * i / segments2) + radius + padding;
      const y2 = -radius * Math.cos(2 * Math.PI * (i + 1) / segments2) + radius + padding;
      ss.push({ x1, x2, y1, y2, isFilled: i < filled2 });
    }
    return ss;
  }
  function handleIncrement(e) {
    if (e.ctrlKey || e.metaKey) {
      $$invalidate(0, segments += 1);
    } else {
      $$invalidate(1, filled += 1);
    }
  }
  function handleDecrement(e) {
    if (e.ctrlKey || e.metaKey) {
      $$invalidate(0, segments -= 1);
      $$invalidate(1, filled = Math.min(segments, filled));
    } else {
      $$invalidate(1, filled -= 1);
    }
  }
  function handleClockKeyInteraction(e) {
    if (["Enter", " ", "ArrowUp", "ArrowRight"].contains(e.key)) {
      if (e.ctrlKey || e.metaKey) {
        $$invalidate(0, segments += 1);
      } else {
        $$invalidate(1, filled += 1);
      }
      e.preventDefault();
    } else if (["ArrowDown", "ArrowLeft"].contains(e.key)) {
      if (e.ctrlKey || e.metaKey) {
        $$invalidate(0, segments -= 1);
        $$invalidate(1, filled = Math.min(segments, filled));
      } else {
        $$invalidate(1, filled -= 1);
      }
      e.preventDefault();
    }
  }
  const click_handler = () => $$invalidate(0, segments -= 1);
  const keydown_handler = () => $$invalidate(0, segments -= 1);
  const click_handler_1 = () => $$invalidate(0, segments += 1);
  const keydown_handler_1 = () => $$invalidate(0, segments += 1);
  $$self.$$set = ($$props2) => {
    if ("segments" in $$props2)
      $$invalidate(0, segments = $$props2.segments);
    if ("filled" in $$props2)
      $$invalidate(1, filled = $$props2.filled);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $$invalidate(0, segments = Math.max(1, segments));
    }
    if ($$self.$$.dirty & 3) {
      $$invalidate(1, filled = filled < 0 ? segments : filled);
    }
    if ($$self.$$.dirty & 3) {
      $$invalidate(1, filled = filled > segments ? 0 : filled);
    }
    if ($$self.$$.dirty & 3) {
      $$invalidate(2, fillCircle = segments <= 1 ? filled >= 1 : null);
    }
  };
  return [
    segments,
    filled,
    fillCircle,
    slices,
    handleIncrement,
    handleDecrement,
    handleClockKeyInteraction,
    click_handler,
    keydown_handler,
    click_handler_1,
    keydown_handler_1
  ];
}
class Clock extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { segments: 0, filled: 1 });
  }
}
function create_fragment$3(ctx) {
  let div4;
  let div0;
  let editablenumber;
  let updating_value;
  let t0;
  let div3;
  let div1;
  let minussquare;
  let t1;
  let div2;
  let plussquare;
  let current;
  let mounted;
  let dispose;
  function editablenumber_value_binding(value) {
    ctx[3](value);
  }
  let editablenumber_props = {};
  if (ctx[0] !== void 0) {
    editablenumber_props.value = ctx[0];
  }
  editablenumber = new EditableNumber({ props: editablenumber_props });
  binding_callbacks.push(() => bind(editablenumber, "value", editablenumber_value_binding));
  minussquare = new MinusSquare({});
  plussquare = new PlusSquare({});
  return {
    c() {
      div4 = element("div");
      div0 = element("div");
      create_component(editablenumber.$$.fragment);
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      create_component(minussquare.$$.fragment);
      t1 = space();
      div2 = element("div");
      create_component(plussquare.$$.fragment);
      attr(div0, "class", "progress-clocks-counter__value");
      attr(div1, "role", "button");
      attr(div1, "tabindex", "0");
      attr(div1, "class", "progress-clocks-button progress-clocks-counter__decrement");
      attr(div2, "role", "button");
      attr(div2, "tabindex", "0");
      attr(div2, "class", "progress-clocks-button progress-clocks-counter__increment");
      attr(div3, "class", "progress-clocks-counter__buttons");
      attr(div4, "class", "progress-clocks-counter");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div0);
      mount_component(editablenumber, div0, null);
      append(div4, t0);
      append(div4, div3);
      append(div3, div1);
      mount_component(minussquare, div1, null);
      append(div3, t1);
      append(div3, div2);
      mount_component(plussquare, div2, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div1, "click", prevent_default(ctx[2])),
          listen(div1, "keydown", ifClickEquivalent(ctx[2])),
          listen(div2, "click", prevent_default(ctx[1])),
          listen(div2, "keydown", ifClickEquivalent(ctx[1]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const editablenumber_changes = {};
      if (!updating_value && dirty & 1) {
        updating_value = true;
        editablenumber_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      editablenumber.$set(editablenumber_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(editablenumber.$$.fragment, local);
      transition_in(minussquare.$$.fragment, local);
      transition_in(plussquare.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(editablenumber.$$.fragment, local);
      transition_out(minussquare.$$.fragment, local);
      transition_out(plussquare.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div4);
      destroy_component(editablenumber);
      destroy_component(minussquare);
      destroy_component(plussquare);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { value = 0 } = $$props;
  function increment() {
    $$invalidate(0, value += 1);
  }
  function decrement() {
    $$invalidate(0, value -= 1);
  }
  function editablenumber_value_binding(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }
  $$self.$$set = ($$props2) => {
    if ("value" in $$props2)
      $$invalidate(0, value = $$props2.value);
  };
  return [value, increment, decrement, editablenumber_value_binding];
}
class Counter extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 0, increment: 1, decrement: 2 });
  }
  get increment() {
    return this.$$.ctx[1];
  }
  get decrement() {
    return this.$$.ctx[2];
  }
}
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[18] = list[i];
  child_ctx[20] = i;
  return child_ctx;
}
function create_else_block$1(ctx) {
  let play;
  let current;
  play = new Play$1({});
  return {
    c() {
      create_component(play.$$.fragment);
    },
    m(target, anchor) {
      mount_component(play, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(play.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(play.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(play, detaching);
    }
  };
}
function create_if_block_1$2(ctx) {
  let pause;
  let current;
  pause = new Pause$1({});
  return {
    c() {
      create_component(pause.$$.fragment);
    },
    m(target, anchor) {
      mount_component(pause, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(pause.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(pause.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(pause, detaching);
    }
  };
}
function create_if_block$2(ctx) {
  let div;
  let each_value = ctx[2];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "progress-clocks-stopwatch__laps");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty & 517) {
        each_value = ctx2[2];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block$2(ctx) {
  let div;
  let t0;
  let t1_value = ctx[20] + 1 + "";
  let t1;
  let t2;
  let t3_value = ctx[9](ctx[18], ctx[0]) + "";
  let t3;
  let div_data_lap_time_ms_value;
  return {
    c() {
      div = element("div");
      t0 = text("(");
      t1 = text(t1_value);
      t2 = text(") ");
      t3 = text(t3_value);
      attr(div, "data-lap-time-ms", div_data_lap_time_ms_value = ctx[18]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
      append(div, t2);
      append(div, t3);
    },
    p(ctx2, dirty) {
      if (dirty & 5 && t3_value !== (t3_value = ctx2[9](ctx2[18], ctx2[0]) + ""))
        set_data(t3, t3_value);
      if (dirty & 4 && div_data_lap_time_ms_value !== (div_data_lap_time_ms_value = ctx2[18])) {
        attr(div, "data-lap-time-ms", div_data_lap_time_ms_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$2(ctx) {
  let div2;
  let div0;
  let t0_value = ctx[9](ctx[8], ctx[0]) + "";
  let t0;
  let t1;
  let div1;
  let button0;
  let current_block_type_index;
  let if_block0;
  let t2;
  let button1;
  let refreshccw;
  let t3;
  let button2;
  let timer;
  let t4;
  let button3;
  let t6;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_1$2, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  refreshccw = new RefreshCcw({});
  timer = new Timer$1({});
  let if_block1 = ctx[2].length > 0 && create_if_block$2(ctx);
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      button0 = element("button");
      if_block0.c();
      t2 = space();
      button1 = element("button");
      create_component(refreshccw.$$.fragment);
      t3 = space();
      button2 = element("button");
      create_component(timer.$$.fragment);
      t4 = space();
      button3 = element("button");
      button3.textContent = "/1000";
      t6 = space();
      if (if_block1)
        if_block1.c();
      attr(div0, "class", "progress-clocks-stopwatch__elapsed");
      attr(div0, "role", "button");
      attr(div0, "tabindex", "0");
      attr(div1, "class", "progress-clocks-stopwatch__buttons");
      attr(div2, "class", "progress-clocks-stopwatch");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, t0);
      append(div2, t1);
      append(div2, div1);
      append(div1, button0);
      if_blocks[current_block_type_index].m(button0, null);
      append(div1, t2);
      append(div1, button1);
      mount_component(refreshccw, button1, null);
      append(div1, t3);
      append(div1, button2);
      mount_component(timer, button2, null);
      append(div1, t4);
      append(div1, button3);
      append(div2, t6);
      if (if_block1)
        if_block1.m(div2, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div0, "click", ctx[6]),
          listen(div0, "keydown", ifClickEquivalent(ctx[6])),
          listen(button0, "click", ctx[12]),
          listen(button1, "click", ctx[5]),
          listen(button2, "click", ctx[7]),
          listen(button3, "click", ctx[13])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & 257) && t0_value !== (t0_value = ctx2[9](ctx2[8], ctx2[0]) + ""))
        set_data(t0, t0_value);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        }
        transition_in(if_block0, 1);
        if_block0.m(button0, null);
      }
      if (ctx2[2].length > 0) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$2(ctx2);
          if_block1.c();
          if_block1.m(div2, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(refreshccw.$$.fragment, local);
      transition_in(timer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(refreshccw.$$.fragment, local);
      transition_out(timer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if_blocks[current_block_type_index].d();
      destroy_component(refreshccw);
      destroy_component(timer);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
const TICK_INTERVAL_MS = 10;
function instance$2($$self, $$props, $$invalidate) {
  const dispatch2 = createEventDispatcher();
  const locale = Intl.NumberFormat().resolvedOptions().locale;
  let { startMillis = new Date().getTime() } = $$props;
  let { offsetMillis = 0 } = $$props;
  let { showMillis = false } = $$props;
  let { isRunning = true } = $$props;
  let { lapTimes = [] } = $$props;
  let elapsedMs = 0;
  let tickInterval = null;
  function tick2() {
    $$invalidate(8, elapsedMs = new Date().getTime() - startMillis + offsetMillis);
  }
  onMount(() => {
    if (isRunning) {
      tick2();
      start();
    } else {
      $$invalidate(8, elapsedMs = offsetMillis);
    }
  });
  onDestroy(() => {
    if (tickInterval) {
      window.clearInterval(tickInterval);
      tickInterval = null;
    }
  });
  function start() {
    if (tickInterval) {
      window.clearInterval(tickInterval);
      tickInterval = null;
    }
    $$invalidate(11, offsetMillis = elapsedMs);
    $$invalidate(10, startMillis = new Date().getTime());
    tickInterval = window.setInterval(tick2, TICK_INTERVAL_MS);
    $$invalidate(1, isRunning = true);
  }
  function stop() {
    if (tickInterval) {
      window.clearInterval(tickInterval);
      tickInterval = null;
    }
    $$invalidate(11, offsetMillis = elapsedMs);
    $$invalidate(1, isRunning = false);
  }
  function reset() {
    $$invalidate(10, startMillis = new Date().getTime());
    $$invalidate(11, offsetMillis = 0);
    $$invalidate(2, lapTimes = []);
    $$invalidate(8, elapsedMs = 0);
  }
  function togglePrecision() {
    $$invalidate(0, showMillis = !showMillis);
  }
  function lap() {
    lapTimes.push(elapsedMs);
    $$invalidate(2, lapTimes);
    dispatch2("lap", { elapsedMs });
  }
  function formatTime(ms, showMillis2 = false) {
    const seconds = showMillis2 ? ms / 1e3 % 60 : Math.floor(ms / 1e3) % 60;
    const secondsFormatted = Intl.NumberFormat(locale, {
      style: "decimal",
      minimumIntegerDigits: 2,
      minimumFractionDigits: showMillis2 ? 3 : 0
    }).format(seconds);
    const minutes = Math.floor(ms / 1e3 / 60) % 60;
    const minutesFormatted = Intl.NumberFormat(locale, {
      style: "decimal",
      minimumIntegerDigits: 2
    }).format(minutes);
    const hours = Math.floor(ms / 1e3 / 60 / 60);
    const hoursFormatted = Intl.NumberFormat(locale, {
      style: "decimal",
      minimumIntegerDigits: 2
    }).format(hours);
    return hours > 0 ? `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}` : `${minutesFormatted}:${secondsFormatted}`;
  }
  const click_handler = () => isRunning ? stop() : start();
  const click_handler_1 = () => $$invalidate(0, showMillis = !showMillis);
  $$self.$$set = ($$props2) => {
    if ("startMillis" in $$props2)
      $$invalidate(10, startMillis = $$props2.startMillis);
    if ("offsetMillis" in $$props2)
      $$invalidate(11, offsetMillis = $$props2.offsetMillis);
    if ("showMillis" in $$props2)
      $$invalidate(0, showMillis = $$props2.showMillis);
    if ("isRunning" in $$props2)
      $$invalidate(1, isRunning = $$props2.isRunning);
    if ("lapTimes" in $$props2)
      $$invalidate(2, lapTimes = $$props2.lapTimes);
  };
  return [
    showMillis,
    isRunning,
    lapTimes,
    start,
    stop,
    reset,
    togglePrecision,
    lap,
    elapsedMs,
    formatTime,
    startMillis,
    offsetMillis,
    click_handler,
    click_handler_1
  ];
}
class StopWatch extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      startMillis: 10,
      offsetMillis: 11,
      showMillis: 0,
      isRunning: 1,
      lapTimes: 2,
      start: 3,
      stop: 4,
      reset: 5,
      togglePrecision: 6,
      lap: 7
    });
  }
  get start() {
    return this.$$.ctx[3];
  }
  get stop() {
    return this.$$.ctx[4];
  }
  get reset() {
    return this.$$.ctx[5];
  }
  get togglePrecision() {
    return this.$$.ctx[6];
  }
  get lap() {
    return this.$$.ctx[7];
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[27] = list[i];
  child_ctx[28] = list;
  child_ctx[29] = i;
  return child_ctx;
}
function create_if_block_3(ctx) {
  let stopwatch;
  let updating_startMillis;
  let updating_offsetMillis;
  let updating_showMillis;
  let updating_isRunning;
  let updating_lapTimes;
  let current;
  const stopwatch_spread_levels = [ctx[27]];
  function stopwatch_startMillis_binding(value) {
    ctx[14](value, ctx[27]);
  }
  function stopwatch_offsetMillis_binding(value) {
    ctx[15](value, ctx[27]);
  }
  function stopwatch_showMillis_binding(value) {
    ctx[16](value, ctx[27]);
  }
  function stopwatch_isRunning_binding(value) {
    ctx[17](value, ctx[27]);
  }
  function stopwatch_lapTimes_binding(value) {
    ctx[18](value, ctx[27]);
  }
  let stopwatch_props = {};
  for (let i = 0; i < stopwatch_spread_levels.length; i += 1) {
    stopwatch_props = assign(stopwatch_props, stopwatch_spread_levels[i]);
  }
  if (ctx[27].startMillis !== void 0) {
    stopwatch_props.startMillis = ctx[27].startMillis;
  }
  if (ctx[27].offsetMillis !== void 0) {
    stopwatch_props.offsetMillis = ctx[27].offsetMillis;
  }
  if (ctx[27].showMillis !== void 0) {
    stopwatch_props.showMillis = ctx[27].showMillis;
  }
  if (ctx[27].isRunning !== void 0) {
    stopwatch_props.isRunning = ctx[27].isRunning;
  }
  if (ctx[27].lapTimes !== void 0) {
    stopwatch_props.lapTimes = ctx[27].lapTimes;
  }
  stopwatch = new StopWatch({ props: stopwatch_props });
  binding_callbacks.push(() => bind(stopwatch, "startMillis", stopwatch_startMillis_binding));
  binding_callbacks.push(() => bind(stopwatch, "offsetMillis", stopwatch_offsetMillis_binding));
  binding_callbacks.push(() => bind(stopwatch, "showMillis", stopwatch_showMillis_binding));
  binding_callbacks.push(() => bind(stopwatch, "isRunning", stopwatch_isRunning_binding));
  binding_callbacks.push(() => bind(stopwatch, "lapTimes", stopwatch_lapTimes_binding));
  return {
    c() {
      create_component(stopwatch.$$.fragment);
    },
    m(target, anchor) {
      mount_component(stopwatch, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const stopwatch_changes = dirty & 2 ? get_spread_update(stopwatch_spread_levels, [get_spread_object(ctx[27])]) : {};
      if (!updating_startMillis && dirty & 2) {
        updating_startMillis = true;
        stopwatch_changes.startMillis = ctx[27].startMillis;
        add_flush_callback(() => updating_startMillis = false);
      }
      if (!updating_offsetMillis && dirty & 2) {
        updating_offsetMillis = true;
        stopwatch_changes.offsetMillis = ctx[27].offsetMillis;
        add_flush_callback(() => updating_offsetMillis = false);
      }
      if (!updating_showMillis && dirty & 2) {
        updating_showMillis = true;
        stopwatch_changes.showMillis = ctx[27].showMillis;
        add_flush_callback(() => updating_showMillis = false);
      }
      if (!updating_isRunning && dirty & 2) {
        updating_isRunning = true;
        stopwatch_changes.isRunning = ctx[27].isRunning;
        add_flush_callback(() => updating_isRunning = false);
      }
      if (!updating_lapTimes && dirty & 2) {
        updating_lapTimes = true;
        stopwatch_changes.lapTimes = ctx[27].lapTimes;
        add_flush_callback(() => updating_lapTimes = false);
      }
      stopwatch.$set(stopwatch_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(stopwatch.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(stopwatch.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(stopwatch, detaching);
    }
  };
}
function create_if_block_2$1(ctx) {
  let counter;
  let updating_value;
  let current;
  const counter_spread_levels = [ctx[27]];
  function counter_value_binding(value) {
    ctx[13](value, ctx[27]);
  }
  let counter_props = {};
  for (let i = 0; i < counter_spread_levels.length; i += 1) {
    counter_props = assign(counter_props, counter_spread_levels[i]);
  }
  if (ctx[27].value !== void 0) {
    counter_props.value = ctx[27].value;
  }
  counter = new Counter({ props: counter_props });
  binding_callbacks.push(() => bind(counter, "value", counter_value_binding));
  return {
    c() {
      create_component(counter.$$.fragment);
    },
    m(target, anchor) {
      mount_component(counter, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const counter_changes = dirty & 2 ? get_spread_update(counter_spread_levels, [get_spread_object(ctx[27])]) : {};
      if (!updating_value && dirty & 2) {
        updating_value = true;
        counter_changes.value = ctx[27].value;
        add_flush_callback(() => updating_value = false);
      }
      counter.$set(counter_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(counter.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(counter.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(counter, detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  let clock;
  let updating_segments;
  let updating_filled;
  let current;
  const clock_spread_levels = [ctx[27]];
  function clock_segments_binding(value) {
    ctx[11](value, ctx[27]);
  }
  function clock_filled_binding(value) {
    ctx[12](value, ctx[27]);
  }
  let clock_props = {};
  for (let i = 0; i < clock_spread_levels.length; i += 1) {
    clock_props = assign(clock_props, clock_spread_levels[i]);
  }
  if (ctx[27].segments !== void 0) {
    clock_props.segments = ctx[27].segments;
  }
  if (ctx[27].filled !== void 0) {
    clock_props.filled = ctx[27].filled;
  }
  clock = new Clock({ props: clock_props });
  binding_callbacks.push(() => bind(clock, "segments", clock_segments_binding));
  binding_callbacks.push(() => bind(clock, "filled", clock_filled_binding));
  return {
    c() {
      create_component(clock.$$.fragment);
    },
    m(target, anchor) {
      mount_component(clock, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const clock_changes = dirty & 2 ? get_spread_update(clock_spread_levels, [get_spread_object(ctx[27])]) : {};
      if (!updating_segments && dirty & 2) {
        updating_segments = true;
        clock_changes.segments = ctx[27].segments;
        add_flush_callback(() => updating_segments = false);
      }
      if (!updating_filled && dirty & 2) {
        updating_filled = true;
        clock_changes.filled = ctx[27].filled;
        add_flush_callback(() => updating_filled = false);
      }
      clock.$set(clock_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(clock.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(clock.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(clock, detaching);
    }
  };
}
function create_each_block$1(ctx) {
  let div3;
  let current_block_type_index;
  let if_block;
  let t0;
  let div0;
  let editabletext;
  let updating_value;
  let t1;
  let div2;
  let div1;
  let trash2;
  let t2;
  let div3_data_child_type_value;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_if_block_3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[27].type === "clock")
      return 0;
    if (ctx2[27].type === "counter")
      return 1;
    if (ctx2[27].type === "stopwatch")
      return 2;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  function editabletext_value_binding_1(value) {
    ctx[19](value, ctx[27]);
  }
  let editabletext_props = {};
  if (ctx[27].name !== void 0) {
    editabletext_props.value = ctx[27].name;
  }
  editabletext = new EditableText({ props: editabletext_props });
  binding_callbacks.push(() => bind(editabletext, "value", editabletext_value_binding_1));
  trash2 = new Trash2({});
  function click_handler() {
    return ctx[20](ctx[29]);
  }
  function keydown_handler() {
    return ctx[21](ctx[29]);
  }
  return {
    c() {
      div3 = element("div");
      if (if_block)
        if_block.c();
      t0 = space();
      div0 = element("div");
      create_component(editabletext.$$.fragment);
      t1 = space();
      div2 = element("div");
      div1 = element("div");
      create_component(trash2.$$.fragment);
      t2 = space();
      attr(div0, "class", "progress-clocks-section__child-name");
      attr(div1, "role", "button");
      attr(div1, "tabindex", "0");
      attr(div1, "class", "progress-clocks-button progress-clocks-section__remove-child");
      attr(div2, "class", "progress-clocks-section__remove-child");
      attr(div3, "class", "progress-clocks-section__child");
      attr(div3, "data-child-type", div3_data_child_type_value = ctx[27].type);
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div3, null);
      }
      append(div3, t0);
      append(div3, div0);
      mount_component(editabletext, div0, null);
      append(div3, t1);
      append(div3, div2);
      append(div2, div1);
      mount_component(trash2, div1, null);
      append(div3, t2);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div1, "click", click_handler),
          listen(div1, "keydown", ifClickEquivalent(keydown_handler))
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div3, t0);
        } else {
          if_block = null;
        }
      }
      const editabletext_changes = {};
      if (!updating_value && dirty & 2) {
        updating_value = true;
        editabletext_changes.value = ctx[27].name;
        add_flush_callback(() => updating_value = false);
      }
      editabletext.$set(editabletext_changes);
      if (!current || dirty & 2 && div3_data_child_type_value !== (div3_data_child_type_value = ctx[27].type)) {
        attr(div3, "data-child-type", div3_data_child_type_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      transition_in(editabletext.$$.fragment, local);
      transition_in(trash2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      transition_out(editabletext.$$.fragment, local);
      transition_out(trash2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      destroy_component(editabletext);
      destroy_component(trash2);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block(ctx) {
  let button;
  let piechart;
  let current;
  let mounted;
  let dispose;
  piechart = new PieChart({});
  return {
    c() {
      button = element("button");
      create_component(piechart.$$.fragment);
      attr(button, "class", "progress-clocks-section__add-clock");
      attr(button, "title", "Add new progress clock");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      mount_component(piechart, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", ctx[25]);
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(piechart.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(piechart.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      destroy_component(piechart);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$1(ctx) {
  let editablenumber;
  let updating_mode;
  let updating_value;
  let current;
  function editablenumber_mode_binding(value) {
    ctx[22](value);
  }
  function editablenumber_value_binding(value) {
    ctx[23](value);
  }
  let editablenumber_props = {};
  if (ctx[3] !== void 0) {
    editablenumber_props.mode = ctx[3];
  }
  if (ctx[4] !== void 0) {
    editablenumber_props.value = ctx[4];
  }
  editablenumber = new EditableNumber({ props: editablenumber_props });
  binding_callbacks.push(() => bind(editablenumber, "mode", editablenumber_mode_binding));
  binding_callbacks.push(() => bind(editablenumber, "value", editablenumber_value_binding));
  editablenumber.$on("confirmed", ctx[6]);
  editablenumber.$on("cancelled", ctx[24]);
  return {
    c() {
      create_component(editablenumber.$$.fragment);
    },
    m(target, anchor) {
      mount_component(editablenumber, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const editablenumber_changes = {};
      if (!updating_mode && dirty & 8) {
        updating_mode = true;
        editablenumber_changes.mode = ctx2[3];
        add_flush_callback(() => updating_mode = false);
      }
      if (!updating_value && dirty & 16) {
        updating_value = true;
        editablenumber_changes.value = ctx2[4];
        add_flush_callback(() => updating_value = false);
      }
      editablenumber.$set(editablenumber_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(editablenumber.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(editablenumber.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(editablenumber, detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let section;
  let div0;
  let editabletext;
  let updating_value;
  let t0;
  let div1;
  let trash2;
  let t1;
  let div2;
  let t2;
  let div3;
  let current_block_type_index;
  let if_block;
  let t3;
  let button0;
  let plussquare;
  let t4;
  let button1;
  let timer;
  let section_transition;
  let current;
  let mounted;
  let dispose;
  function editabletext_value_binding(value) {
    ctx[10](value);
  }
  let editabletext_props = {};
  if (ctx[0] !== void 0) {
    editabletext_props.value = ctx[0];
  }
  editabletext = new EditableText({ props: editabletext_props });
  binding_callbacks.push(() => bind(editabletext, "value", editabletext_value_binding));
  trash2 = new Trash2({});
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  const if_block_creators = [create_if_block$1, create_else_block];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[2])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  plussquare = new PlusSquare({});
  timer = new Timer$1({});
  return {
    c() {
      section = element("section");
      div0 = element("div");
      create_component(editabletext.$$.fragment);
      t0 = space();
      div1 = element("div");
      create_component(trash2.$$.fragment);
      t1 = space();
      div2 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      div3 = element("div");
      if_block.c();
      t3 = space();
      button0 = element("button");
      create_component(plussquare.$$.fragment);
      t4 = space();
      button1 = element("button");
      create_component(timer.$$.fragment);
      attr(div0, "class", "progress-clocks-section__name");
      attr(div1, "role", "button");
      attr(div1, "tabindex", "0");
      attr(div1, "class", "progress-clocks-button progress-clocks-section__remove");
      attr(div2, "class", "progress-clocks-section__children");
      attr(button0, "class", "progress-clocks-section__add-counter");
      attr(button0, "title", "Add new counter");
      attr(button1, "class", "progress-clocks-section__add-stopwatch");
      attr(button1, "title", "Add new stopwatch");
      attr(div3, "class", "progress-clocks-section__add-child");
      attr(section, "class", "progress-clocks-section");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      append(section, div0);
      mount_component(editabletext, div0, null);
      append(section, t0);
      append(section, div1);
      mount_component(trash2, div1, null);
      append(section, t1);
      append(section, div2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div2, null);
        }
      }
      append(section, t2);
      append(section, div3);
      if_blocks[current_block_type_index].m(div3, null);
      append(div3, t3);
      append(div3, button0);
      mount_component(plussquare, button0, null);
      append(div3, t4);
      append(div3, button1);
      mount_component(timer, button1, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div1, "click", ctx[5]),
          listen(div1, "contextmenu", ctx[5]),
          listen(div1, "keydown", ctx[5]),
          listen(button0, "click", ctx[7]),
          listen(button1, "click", ctx[8])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const editabletext_changes = {};
      if (!updating_value && dirty & 1) {
        updating_value = true;
        editabletext_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      editabletext.$set(editabletext_changes);
      if (dirty & 514) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div2, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div3, t3);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(editabletext.$$.fragment, local);
      transition_in(trash2.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(if_block);
      transition_in(plussquare.$$.fragment, local);
      transition_in(timer.$$.fragment, local);
      add_render_callback(() => {
        if (!current)
          return;
        if (!section_transition)
          section_transition = create_bidirectional_transition(section, fade, { duration: 100 }, true);
        section_transition.run(1);
      });
      current = true;
    },
    o(local) {
      transition_out(editabletext.$$.fragment, local);
      transition_out(trash2.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(if_block);
      transition_out(plussquare.$$.fragment, local);
      transition_out(timer.$$.fragment, local);
      if (!section_transition)
        section_transition = create_bidirectional_transition(section, fade, { duration: 100 }, false);
      section_transition.run(0);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(section);
      destroy_component(editabletext);
      destroy_component(trash2);
      destroy_each(each_blocks, detaching);
      if_blocks[current_block_type_index].d();
      destroy_component(plussquare);
      destroy_component(timer);
      if (detaching && section_transition)
        section_transition.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { name } = $$props;
  let { children: children2 } = $$props;
  const dispatch2 = createEventDispatcher();
  function raiseRemoveSection(e) {
    if (e instanceof MouseEvent || ["Enter", " "].contains(e.key)) {
      dispatch2("removeSection", { self: this });
    }
  }
  let addingClock = false;
  let newClockMode = EditMode.Edit;
  let newClockSegments = 4;
  function addClock() {
    if (newClockMode !== EditMode.Read) {
      return;
    }
    if (newClockSegments < 1) {
      tick().then(() => {
        $$invalidate(3, newClockMode = EditMode.Edit);
      });
      return;
    }
    children2.push({
      type: "clock",
      name: `Clock ${children2.length + 1}`,
      segments: newClockSegments,
      filled: 0
    });
    $$invalidate(2, addingClock = false);
    $$invalidate(3, newClockMode = EditMode.Edit);
    $$invalidate(1, children2);
  }
  function addCounter() {
    children2.push({
      type: "counter",
      name: `Counter ${children2.length + 1}`,
      value: 0
    });
    $$invalidate(1, children2);
  }
  function addStopwatch() {
    children2.push({
      type: "stopwatch",
      name: `Stopwatch ${children2.length + 1}`,
      startMillis: new Date().getTime(),
      offsetMillis: 0,
      showMillis: false,
      isRunning: true,
      lapTimes: []
    });
    $$invalidate(1, children2);
  }
  function removeChild(i) {
    children2.splice(i, 1);
    $$invalidate(1, children2);
  }
  function editabletext_value_binding(value) {
    name = value;
    $$invalidate(0, name);
  }
  function clock_segments_binding(value, child) {
    if ($$self.$$.not_equal(child.segments, value)) {
      child.segments = value;
      $$invalidate(1, children2);
    }
  }
  function clock_filled_binding(value, child) {
    if ($$self.$$.not_equal(child.filled, value)) {
      child.filled = value;
      $$invalidate(1, children2);
    }
  }
  function counter_value_binding(value, child) {
    if ($$self.$$.not_equal(child.value, value)) {
      child.value = value;
      $$invalidate(1, children2);
    }
  }
  function stopwatch_startMillis_binding(value, child) {
    if ($$self.$$.not_equal(child.startMillis, value)) {
      child.startMillis = value;
      $$invalidate(1, children2);
    }
  }
  function stopwatch_offsetMillis_binding(value, child) {
    if ($$self.$$.not_equal(child.offsetMillis, value)) {
      child.offsetMillis = value;
      $$invalidate(1, children2);
    }
  }
  function stopwatch_showMillis_binding(value, child) {
    if ($$self.$$.not_equal(child.showMillis, value)) {
      child.showMillis = value;
      $$invalidate(1, children2);
    }
  }
  function stopwatch_isRunning_binding(value, child) {
    if ($$self.$$.not_equal(child.isRunning, value)) {
      child.isRunning = value;
      $$invalidate(1, children2);
    }
  }
  function stopwatch_lapTimes_binding(value, child) {
    if ($$self.$$.not_equal(child.lapTimes, value)) {
      child.lapTimes = value;
      $$invalidate(1, children2);
    }
  }
  function editabletext_value_binding_1(value, child) {
    if ($$self.$$.not_equal(child.name, value)) {
      child.name = value;
      $$invalidate(1, children2);
    }
  }
  const click_handler = (i) => removeChild(i);
  const keydown_handler = (i) => removeChild(i);
  function editablenumber_mode_binding(value) {
    newClockMode = value;
    $$invalidate(3, newClockMode);
  }
  function editablenumber_value_binding(value) {
    newClockSegments = value;
    $$invalidate(4, newClockSegments);
  }
  const cancelled_handler = () => {
    $$invalidate(2, addingClock = false);
    $$invalidate(3, newClockMode = EditMode.Edit);
  };
  const click_handler_1 = () => $$invalidate(2, addingClock = true);
  $$self.$$set = ($$props2) => {
    if ("name" in $$props2)
      $$invalidate(0, name = $$props2.name);
    if ("children" in $$props2)
      $$invalidate(1, children2 = $$props2.children);
  };
  return [
    name,
    children2,
    addingClock,
    newClockMode,
    newClockSegments,
    raiseRemoveSection,
    addClock,
    addCounter,
    addStopwatch,
    removeChild,
    editabletext_value_binding,
    clock_segments_binding,
    clock_filled_binding,
    counter_value_binding,
    stopwatch_startMillis_binding,
    stopwatch_offsetMillis_binding,
    stopwatch_showMillis_binding,
    stopwatch_isRunning_binding,
    stopwatch_lapTimes_binding,
    editabletext_value_binding_1,
    click_handler,
    keydown_handler,
    editablenumber_mode_binding,
    editablenumber_value_binding,
    cancelled_handler,
    click_handler_1
  ];
}
class Section extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 0, children: 1 });
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[10] = list;
  child_ctx[11] = i;
  return child_ctx;
}
function create_if_block_2(ctx) {
  let header;
  return {
    c() {
      header = element("header");
      header.innerHTML = `<span class="progress-clocks-title__main-title">Progress Clocks</span> 
      <a class="progress-clocks-title__subtitle" href="https://github.com/tokenshift/obsidian-progress-clocks">https://github.com/tokenshift/obsidian-progress-clocks</a>`;
      attr(header, "class", "progress-clocks-title");
    },
    m(target, anchor) {
      insert(target, header, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(header);
    }
  };
}
function create_each_block(ctx) {
  let section;
  let updating_name;
  let updating_children;
  let current;
  function section_name_binding(value) {
    ctx[5](value, ctx[9]);
  }
  function section_children_binding(value) {
    ctx[6](value, ctx[9]);
  }
  function removeSection_handler() {
    return ctx[7](ctx[11]);
  }
  let section_props = {};
  if (ctx[9].name !== void 0) {
    section_props.name = ctx[9].name;
  }
  if (ctx[9].children !== void 0) {
    section_props.children = ctx[9].children;
  }
  section = new Section({ props: section_props });
  binding_callbacks.push(() => bind(section, "name", section_name_binding));
  binding_callbacks.push(() => bind(section, "children", section_children_binding));
  section.$on("removeSection", removeSection_handler);
  return {
    c() {
      create_component(section.$$.fragment);
    },
    m(target, anchor) {
      mount_component(section, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const section_changes = {};
      if (!updating_name && dirty & 1) {
        updating_name = true;
        section_changes.name = ctx[9].name;
        add_flush_callback(() => updating_name = false);
      }
      if (!updating_children && dirty & 1) {
        updating_children = true;
        section_changes.children = ctx[9].children;
        add_flush_callback(() => updating_children = false);
      }
      section.$set(section_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(section.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(section.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(section, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let pre;
  let t0;
  let t1_value = JSON.stringify(ctx[0], null, 2) + "";
  let t1;
  let t2;
  return {
    c() {
      pre = element("pre");
      t0 = text("  ");
      t1 = text(t1_value);
      t2 = text("\n  ");
      attr(pre, "class", "progress-clocks-debug");
    },
    m(target, anchor) {
      insert(target, pre, anchor);
      append(pre, t0);
      append(pre, t1);
      append(pre, t2);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t1_value !== (t1_value = JSON.stringify(ctx2[0], null, 2) + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching)
        detach(pre);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let t0;
  let t1;
  return {
    c() {
      div = element("div");
      t0 = text("Counters v");
      t1 = text(ctx[1]);
      attr(div, "class", "progress-clocks-panel__version");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t1, ctx2[1]);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment(ctx) {
  let div1;
  let t0;
  let t1;
  let div0;
  let t3;
  let t4;
  let current;
  let mounted;
  let dispose;
  let if_block0 = ctx[2] && create_if_block_2();
  let each_value = ctx[0].sections;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  let if_block1 = ctx[0].debug && create_if_block_1(ctx);
  let if_block2 = ctx[1] && create_if_block(ctx);
  return {
    c() {
      div1 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      div0 = element("div");
      div0.textContent = "Add Section";
      t3 = space();
      if (if_block1)
        if_block1.c();
      t4 = space();
      if (if_block2)
        if_block2.c();
      attr(div0, "class", "progress-clocks-button progress-clocks-panel__add-section");
      attr(div0, "role", "button");
      attr(div0, "tabindex", "0");
      attr(div1, "class", "progress-clocks progress-clocks-panel");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0)
        if_block0.m(div1, null);
      append(div1, t0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div1, t1);
      append(div1, div0);
      append(div1, t3);
      if (if_block1)
        if_block1.m(div1, null);
      append(div1, t4);
      if (if_block2)
        if_block2.m(div1, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div0, "keydown", ifClickEquivalent(ctx[3])),
          listen(div0, "click", ctx[3])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[2]) {
        if (if_block0)
          ;
        else {
          if_block0 = create_if_block_2();
          if_block0.c();
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & 17) {
        each_value = ctx2[0].sections;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div1, t1);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (ctx2[0].debug) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_1(ctx2);
          if_block1.c();
          if_block1.m(div1, t4);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (ctx2[1]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block(ctx2);
          if_block2.c();
          if_block2.m(div1, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      if (if_block0)
        if_block0.d();
      destroy_each(each_blocks, detaching);
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  const dispatch2 = createEventDispatcher();
  let { state = new State() } = $$props;
  let { version } = $$props;
  let { showTitle = false } = $$props;
  function addSection() {
    state.sections.push({
      name: `Section ${state.sections.length + 1}`,
      children: []
    });
    $$invalidate(0, state);
  }
  function removeSection(i) {
    state.sections.splice(i, 1);
    $$invalidate(0, state);
  }
  function section_name_binding(value, section) {
    if ($$self.$$.not_equal(section.name, value)) {
      section.name = value;
      $$invalidate(0, state);
    }
  }
  function section_children_binding(value, section) {
    if ($$self.$$.not_equal(section.children, value)) {
      section.children = value;
      $$invalidate(0, state);
    }
  }
  const removeSection_handler = (i) => removeSection(i);
  $$self.$$set = ($$props2) => {
    if ("state" in $$props2)
      $$invalidate(0, state = $$props2.state);
    if ("version" in $$props2)
      $$invalidate(1, version = $$props2.version);
    if ("showTitle" in $$props2)
      $$invalidate(2, showTitle = $$props2.showTitle);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      dispatch2("stateUpdated", { state });
    }
  };
  return [
    state,
    version,
    showTitle,
    addSection,
    removeSection,
    section_name_binding,
    section_children_binding,
    removeSection_handler
  ];
}
class Panel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { state: 0, version: 1, showTitle: 2 });
  }
}
const DEBOUNCE_SAVE_STATE_TIME$1 = 1e3;
class ProgressClocksRenderChild extends obsidian.MarkdownRenderChild {
  constructor(plugin, element2) {
    super(element2);
    this.plugin = plugin;
    this.element = element2;
  }
  async onload() {
    const data = await this.plugin.loadData();
    const state = (data == null ? void 0 : data.state) || { sections: [] };
    const panel = new Panel({
      target: this.element,
      props: { state, version: this.plugin.manifest.version }
    });
    panel.$on("stateUpdated", obsidian.debounce(({ detail: { state: state2 } }) => {
      this.plugin.saveData({ state: state2 });
    }, DEBOUNCE_SAVE_STATE_TIME$1, true));
  }
}
const DISPLAY_TEXT = "Progress Clocks";
const ICON = "pie-chart";
const VIEW_TYPE = "PROGRESS_CLOCKS_VIEW";
const DEBOUNCE_SAVE_STATE_TIME = 1e3;
class ProgressClocksView extends obsidian.ItemView {
  constructor(plugin, leaf) {
    super(leaf);
    __publicField(this, "navigation", false);
    this.plugin = plugin;
    this.leaf = leaf;
  }
  getDisplayText() {
    return DISPLAY_TEXT;
  }
  getIcon() {
    return ICON;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  async onOpen() {
    this.contentEl.empty();
    const data = await this.plugin.loadData();
    const state = (data == null ? void 0 : data.state) || { sections: [] };
    const panel = new Panel({
      target: this.contentEl,
      props: {
        showTitle: true,
        state,
        version: this.plugin.manifest.version
      }
    });
    panel.$on("stateUpdated", obsidian.debounce(({ detail: { state: state2 } }) => {
      this.plugin.saveData({ state: state2 });
    }, DEBOUNCE_SAVE_STATE_TIME, true));
  }
}
class ProgressClocksPlugin extends obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("counters", (source, el, ctx) => this.handleCountersCodeBlock(source, el, ctx));
    this.registerView(
      VIEW_TYPE,
      (leaf) => new ProgressClocksView(this, leaf)
    );
    this.addView();
    this.addCommand({
      id: "open-panel",
      name: "Open the sidebar view",
      callback: async () => {
        const leaf = await this.addView();
        if (leaf) {
          this.app.workspace.revealLeaf(leaf);
        }
      }
    });
  }
  async addView() {
    var _a, _b;
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length > 0) {
      return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    }
    await ((_b = (_a = this.app.workspace) == null ? void 0 : _a.getRightLeaf(false)) == null ? void 0 : _b.setViewState({
      type: VIEW_TYPE
    }));
    return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
  }
  async handleCountersCodeBlock(source, el, ctx) {
    try {
      const child = new ProgressClocksRenderChild(this, el);
      ctx.addChild(child);
    } catch (err) {
      const pre = document.createElement("pre");
      pre.append(err.message);
      if (err.stack) {
        pre.append("\n");
        pre.append(err.stack);
      }
      el.append(pre);
    }
  }
}
module.exports = ProgressClocksPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3N2ZWx0ZS9pbnRlcm5hbC9pbmRleC5tanMiLCJzcmMvU3RhdGUudHMiLCJub2RlX21vZHVsZXMvbHVjaWRlLXN2ZWx0ZS9kaXN0L2RlZmF1bHRBdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9JY29uLnN2ZWx0ZSIsIm5vZGVfbW9kdWxlcy9sdWNpZGUtc3ZlbHRlL2Rpc3QvaWNvbnMvYXJyb3ctZG93bi1mcm9tLWxpbmUuc3ZlbHRlIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9pY29ucy9hcnJvdy11cC1mcm9tLWxpbmUuc3ZlbHRlIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9pY29ucy9taW51cy1zcXVhcmUuc3ZlbHRlIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9pY29ucy9wYXVzZS5zdmVsdGUiLCJub2RlX21vZHVsZXMvbHVjaWRlLXN2ZWx0ZS9kaXN0L2ljb25zL3BpZS1jaGFydC5zdmVsdGUiLCJub2RlX21vZHVsZXMvbHVjaWRlLXN2ZWx0ZS9kaXN0L2ljb25zL3BsYXkuc3ZlbHRlIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9pY29ucy9wbHVzLXNxdWFyZS5zdmVsdGUiLCJub2RlX21vZHVsZXMvbHVjaWRlLXN2ZWx0ZS9kaXN0L2ljb25zL3JlZnJlc2gtY2N3LnN2ZWx0ZSIsIm5vZGVfbW9kdWxlcy9sdWNpZGUtc3ZlbHRlL2Rpc3QvaWNvbnMvdGltZXIuc3ZlbHRlIiwibm9kZV9tb2R1bGVzL2x1Y2lkZS1zdmVsdGUvZGlzdC9pY29ucy90cmFzaC0yLnN2ZWx0ZSIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvdHJhbnNpdGlvbi9pbmRleC5tanMiLCJzcmMvdWkvdXRpbC50cyIsInNyYy91aS9FZGl0YWJsZVRleHQuc3ZlbHRlIiwic3JjL3VpL0VkaXRhYmxlTnVtYmVyLnN2ZWx0ZSIsInNyYy91aS9DbG9jay5zdmVsdGUiLCJzcmMvdWkvQ291bnRlci5zdmVsdGUiLCJzcmMvdWkvU3RvcFdhdGNoLnN2ZWx0ZSIsInNyYy91aS9TZWN0aW9uLnN2ZWx0ZSIsInNyYy91aS9QYW5lbC5zdmVsdGUiLCJzcmMvUHJvZ3Jlc3NDbG9ja3NSZW5kZXJDaGlsZC50cyIsInNyYy9Qcm9ncmVzc0Nsb2Nrc1ZpZXcudHMiLCJzcmMvUHJvZ3Jlc3NDbG9ja3NQbHVnaW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbm9vcCgpIHsgfVxuY29uc3QgaWRlbnRpdHkgPSB4ID0+IHg7XG5mdW5jdGlvbiBhc3NpZ24odGFyLCBzcmMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yIChjb25zdCBrIGluIHNyYylcbiAgICAgICAgdGFyW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiB0YXI7XG59XG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9MSUNFTlNFXG5mdW5jdGlvbiBpc19wcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5sZXQgc3JjX3VybF9lcXVhbF9hbmNob3I7XG5mdW5jdGlvbiBzcmNfdXJsX2VxdWFsKGVsZW1lbnRfc3JjLCB1cmwpIHtcbiAgICBpZiAoIXNyY191cmxfZXF1YWxfYW5jaG9yKSB7XG4gICAgICAgIHNyY191cmxfZXF1YWxfYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIH1cbiAgICBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmID0gdXJsO1xuICAgIHJldHVybiBlbGVtZW50X3NyYyA9PT0gc3JjX3VybF9lcXVhbF9hbmNob3IuaHJlZjtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiBpc19lbXB0eShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGlmIChzbG90X2NoYW5nZXMpIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jb250ZXh0ID0gZ2V0X3Nsb3RfY29udGV4dChzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG4gICAgICAgIHNsb3QucChzbG90X2NvbnRleHQsIHNsb3RfY2hhbmdlcyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlX3Nsb3Qoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuLCBnZXRfc2xvdF9jb250ZXh0X2ZuKSB7XG4gICAgY29uc3Qgc2xvdF9jaGFuZ2VzID0gZ2V0X3Nsb3RfY2hhbmdlcyhzbG90X2RlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuKTtcbiAgICB1cGRhdGVfc2xvdF9iYXNlKHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBzbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHRfZm4pO1xufVxuZnVuY3Rpb24gZ2V0X2FsbF9kaXJ0eV9mcm9tX3Njb3BlKCQkc2NvcGUpIHtcbiAgICBpZiAoJCRzY29wZS5jdHgubGVuZ3RoID4gMzIpIHtcbiAgICAgICAgY29uc3QgZGlydHkgPSBbXTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gJCRzY29wZS5jdHgubGVuZ3RoIC8gMzI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpcnR5W2ldID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpcnR5O1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gY29tcHV0ZV9zbG90cyhzbG90cykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNsb3RzKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5mdW5jdGlvbiBzcGxpdF9jc3NfdW5pdCh2YWx1ZSkge1xuICAgIGNvbnN0IHNwbGl0ID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5tYXRjaCgvXlxccyooLT9bXFxkLl0rKShbXlxcc10qKVxccyokLyk7XG4gICAgcmV0dXJuIHNwbGl0ID8gW3BhcnNlRmxvYXQoc3BsaXRbMV0pLCBzcGxpdFsyXSB8fCAncHgnXSA6IFt2YWx1ZSwgJ3B4J107XG59XG5jb25zdCBjb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcyA9IFsnJywgdHJ1ZSwgMSwgJ3RydWUnLCAnY29udGVudGVkaXRhYmxlJ107XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5jb25zdCBnbG9iYWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgPyB3aW5kb3dcbiAgICA6IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IGdsb2JhbFRoaXNcbiAgICAgICAgOiBnbG9iYWwpO1xuXG4vKipcbiAqIFJlc2l6ZSBvYnNlcnZlciBzaW5nbGV0b24uXG4gKiBPbmUgbGlzdGVuZXIgcGVyIGVsZW1lbnQgb25seSFcbiAqIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vYS9jaHJvbWl1bS5vcmcvZy9ibGluay1kZXYvYy96Nmllbk9OVWI1QS9tL0Y1LVZjVVp0QkFBSlxuICovXG5jbGFzcyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSAnV2Vha01hcCcgaW4gZ2xvYmFscyA/IG5ldyBXZWFrTWFwKCkgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIG9ic2VydmUoZWxlbWVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChlbGVtZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX2dldE9ic2VydmVyKCkub2JzZXJ2ZShlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX29ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KTsgLy8gdGhpcyBsaW5lIGNhbiBwcm9iYWJseSBiZSByZW1vdmVkXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9nZXRPYnNlcnZlcigpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5fb2JzZXJ2ZXIpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzLl9vYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24uZW50cmllcy5zZXQoZW50cnkudGFyZ2V0LCBlbnRyeSk7XG4gICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fbGlzdGVuZXJzLmdldChlbnRyeS50YXJnZXQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EoZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuLy8gTmVlZHMgdG8gYmUgd3JpdHRlbiBsaWtlIHRoaXMgdG8gcGFzcyB0aGUgdHJlZS1zaGFrZS10ZXN0XG5SZXNpemVPYnNlcnZlclNpbmdsZXRvbi5lbnRyaWVzID0gJ1dlYWtNYXAnIGluIGdsb2JhbHMgPyBuZXcgV2Vha01hcCgpIDogdW5kZWZpbmVkO1xuXG4vLyBUcmFjayB3aGljaCBub2RlcyBhcmUgY2xhaW1lZCBkdXJpbmcgaHlkcmF0aW9uLiBVbmNsYWltZWQgbm9kZXMgY2FuIHRoZW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET01cbi8vIGF0IHRoZSBlbmQgb2YgaHlkcmF0aW9uIHdpdGhvdXQgdG91Y2hpbmcgdGhlIHJlbWFpbmluZyBub2Rlcy5cbmxldCBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0X2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gZW5kX2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHVwcGVyX2JvdW5kKGxvdywgaGlnaCwga2V5LCB2YWx1ZSkge1xuICAgIC8vIFJldHVybiBmaXJzdCBpbmRleCBvZiB2YWx1ZSBsYXJnZXIgdGhhbiBpbnB1dCB2YWx1ZSBpbiB0aGUgcmFuZ2UgW2xvdywgaGlnaClcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICBjb25zdCBtaWQgPSBsb3cgKyAoKGhpZ2ggLSBsb3cpID4+IDEpO1xuICAgICAgICBpZiAoa2V5KG1pZCkgPD0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoaWdoID0gbWlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG59XG5mdW5jdGlvbiBpbml0X2h5ZHJhdGUodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5oeWRyYXRlX2luaXQpXG4gICAgICAgIHJldHVybjtcbiAgICB0YXJnZXQuaHlkcmF0ZV9pbml0ID0gdHJ1ZTtcbiAgICAvLyBXZSBrbm93IHRoYXQgYWxsIGNoaWxkcmVuIGhhdmUgY2xhaW1fb3JkZXIgdmFsdWVzIHNpbmNlIHRoZSB1bmNsYWltZWQgaGF2ZSBiZWVuIGRldGFjaGVkIGlmIHRhcmdldCBpcyBub3QgPGhlYWQ+XG4gICAgbGV0IGNoaWxkcmVuID0gdGFyZ2V0LmNoaWxkTm9kZXM7XG4gICAgLy8gSWYgdGFyZ2V0IGlzIDxoZWFkPiwgdGhlcmUgbWF5IGJlIGNoaWxkcmVuIHdpdGhvdXQgY2xhaW1fb3JkZXJcbiAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnSEVBRCcpIHtcbiAgICAgICAgY29uc3QgbXlDaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbXlDaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuID0gbXlDaGlsZHJlbjtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlb3JkZXIgY2xhaW1lZCBjaGlsZHJlbiBvcHRpbWFsbHkuXG4gICAgKiBXZSBjYW4gcmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseSBieSBmaW5kaW5nIHRoZSBsb25nZXN0IHN1YnNlcXVlbmNlIG9mXG4gICAgKiBub2RlcyB0aGF0IGFyZSBhbHJlYWR5IGNsYWltZWQgaW4gb3JkZXIgYW5kIG9ubHkgbW92aW5nIHRoZSByZXN0LiBUaGUgbG9uZ2VzdFxuICAgICogc3Vic2VxdWVuY2Ugb2Ygbm9kZXMgdGhhdCBhcmUgY2xhaW1lZCBpbiBvcmRlciBjYW4gYmUgZm91bmQgYnlcbiAgICAqIGNvbXB1dGluZyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIC5jbGFpbV9vcmRlciB2YWx1ZXMuXG4gICAgKlxuICAgICogVGhpcyBhbGdvcml0aG0gaXMgb3B0aW1hbCBpbiBnZW5lcmF0aW5nIHRoZSBsZWFzdCBhbW91bnQgb2YgcmVvcmRlciBvcGVyYXRpb25zXG4gICAgKiBwb3NzaWJsZS5cbiAgICAqXG4gICAgKiBQcm9vZjpcbiAgICAqIFdlIGtub3cgdGhhdCwgZ2l2ZW4gYSBzZXQgb2YgcmVvcmRlcmluZyBvcGVyYXRpb25zLCB0aGUgbm9kZXMgdGhhdCBkbyBub3QgbW92ZVxuICAgICogYWx3YXlzIGZvcm0gYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSwgc2luY2UgdGhleSBkbyBub3QgbW92ZSBhbW9uZyBlYWNoIG90aGVyXG4gICAgKiBtZWFuaW5nIHRoYXQgdGhleSBtdXN0IGJlIGFscmVhZHkgb3JkZXJlZCBhbW9uZyBlYWNoIG90aGVyLiBUaHVzLCB0aGUgbWF4aW1hbFxuICAgICogc2V0IG9mIG5vZGVzIHRoYXQgZG8gbm90IG1vdmUgZm9ybSBhIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZS5cbiAgICAqL1xuICAgIC8vIENvbXB1dGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG4gICAgLy8gbTogc3Vic2VxdWVuY2UgbGVuZ3RoIGogPT4gaW5kZXggayBvZiBzbWFsbGVzdCB2YWx1ZSB0aGF0IGVuZHMgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBsZW5ndGggalxuICAgIGNvbnN0IG0gPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGggKyAxKTtcbiAgICAvLyBQcmVkZWNlc3NvciBpbmRpY2VzICsgMVxuICAgIGNvbnN0IHAgPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuICAgIG1bMF0gPSAtMTtcbiAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2hpbGRyZW5baV0uY2xhaW1fb3JkZXI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGxhcmdlc3Qgc3Vic2VxdWVuY2UgbGVuZ3RoIHN1Y2ggdGhhdCBpdCBlbmRzIGluIGEgdmFsdWUgbGVzcyB0aGFuIG91ciBjdXJyZW50IHZhbHVlXG4gICAgICAgIC8vIHVwcGVyX2JvdW5kIHJldHVybnMgZmlyc3QgZ3JlYXRlciB2YWx1ZSwgc28gd2Ugc3VidHJhY3Qgb25lXG4gICAgICAgIC8vIHdpdGggZmFzdCBwYXRoIGZvciB3aGVuIHdlIGFyZSBvbiB0aGUgY3VycmVudCBsb25nZXN0IHN1YnNlcXVlbmNlXG4gICAgICAgIGNvbnN0IHNlcUxlbiA9ICgobG9uZ2VzdCA+IDAgJiYgY2hpbGRyZW5bbVtsb25nZXN0XV0uY2xhaW1fb3JkZXIgPD0gY3VycmVudCkgPyBsb25nZXN0ICsgMSA6IHVwcGVyX2JvdW5kKDEsIGxvbmdlc3QsIGlkeCA9PiBjaGlsZHJlblttW2lkeF1dLmNsYWltX29yZGVyLCBjdXJyZW50KSkgLSAxO1xuICAgICAgICBwW2ldID0gbVtzZXFMZW5dICsgMTtcbiAgICAgICAgY29uc3QgbmV3TGVuID0gc2VxTGVuICsgMTtcbiAgICAgICAgLy8gV2UgY2FuIGd1YXJhbnRlZSB0aGF0IGN1cnJlbnQgaXMgdGhlIHNtYWxsZXN0IHZhbHVlLiBPdGhlcndpc2UsIHdlIHdvdWxkIGhhdmUgZ2VuZXJhdGVkIGEgbG9uZ2VyIHNlcXVlbmNlLlxuICAgICAgICBtW25ld0xlbl0gPSBpO1xuICAgICAgICBsb25nZXN0ID0gTWF0aC5tYXgobmV3TGVuLCBsb25nZXN0KTtcbiAgICB9XG4gICAgLy8gVGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBub2RlcyAoaW5pdGlhbGx5IHJldmVyc2VkKVxuICAgIGNvbnN0IGxpcyA9IFtdO1xuICAgIC8vIFRoZSByZXN0IG9mIHRoZSBub2Rlcywgbm9kZXMgdGhhdCB3aWxsIGJlIG1vdmVkXG4gICAgY29uc3QgdG9Nb3ZlID0gW107XG4gICAgbGV0IGxhc3QgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGN1ciA9IG1bbG9uZ2VzdF0gKyAxOyBjdXIgIT0gMDsgY3VyID0gcFtjdXIgLSAxXSkge1xuICAgICAgICBsaXMucHVzaChjaGlsZHJlbltjdXIgLSAxXSk7XG4gICAgICAgIGZvciAoOyBsYXN0ID49IGN1cjsgbGFzdC0tKSB7XG4gICAgICAgICAgICB0b01vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdC0tO1xuICAgIH1cbiAgICBmb3IgKDsgbGFzdCA+PSAwOyBsYXN0LS0pIHtcbiAgICAgICAgdG9Nb3ZlLnB1c2goY2hpbGRyZW5bbGFzdF0pO1xuICAgIH1cbiAgICBsaXMucmV2ZXJzZSgpO1xuICAgIC8vIFdlIHNvcnQgdGhlIG5vZGVzIGJlaW5nIG1vdmVkIHRvIGd1YXJhbnRlZSB0aGF0IHRoZWlyIGluc2VydGlvbiBvcmRlciBtYXRjaGVzIHRoZSBjbGFpbSBvcmRlclxuICAgIHRvTW92ZS5zb3J0KChhLCBiKSA9PiBhLmNsYWltX29yZGVyIC0gYi5jbGFpbV9vcmRlcik7XG4gICAgLy8gRmluYWxseSwgd2UgbW92ZSB0aGUgbm9kZXNcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCB0b01vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKGogPCBsaXMubGVuZ3RoICYmIHRvTW92ZVtpXS5jbGFpbV9vcmRlciA+PSBsaXNbal0uY2xhaW1fb3JkZXIpIHtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmNob3IgPSBqIDwgbGlzLmxlbmd0aCA/IGxpc1tqXSA6IG51bGw7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUodG9Nb3ZlW2ldLCBhbmNob3IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzKHRhcmdldCwgc3R5bGVfc2hlZXRfaWQsIHN0eWxlcykge1xuICAgIGNvbnN0IGFwcGVuZF9zdHlsZXNfdG8gPSBnZXRfcm9vdF9mb3Jfc3R5bGUodGFyZ2V0KTtcbiAgICBpZiAoIWFwcGVuZF9zdHlsZXNfdG8uZ2V0RWxlbWVudEJ5SWQoc3R5bGVfc2hlZXRfaWQpKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaWQgPSBzdHlsZV9zaGVldF9pZDtcbiAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgICAgIGFwcGVuZF9zdHlsZXNoZWV0KGFwcGVuZF9zdHlsZXNfdG8sIHN0eWxlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSkge1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgIGNvbnN0IHJvb3QgPSBub2RlLmdldFJvb3ROb2RlID8gbm9kZS5nZXRSb290Tm9kZSgpIDogbm9kZS5vd25lckRvY3VtZW50O1xuICAgIGlmIChyb290ICYmIHJvb3QuaG9zdCkge1xuICAgICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9lbXB0eV9zdHlsZXNoZWV0KG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZV9lbGVtZW50ID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICBhcHBlbmRfc3R5bGVzaGVldChnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSksIHN0eWxlX2VsZW1lbnQpO1xuICAgIHJldHVybiBzdHlsZV9lbGVtZW50LnNoZWV0O1xufVxuZnVuY3Rpb24gYXBwZW5kX3N0eWxlc2hlZXQobm9kZSwgc3R5bGUpIHtcbiAgICBhcHBlbmQobm9kZS5oZWFkIHx8IG5vZGUsIHN0eWxlKTtcbiAgICByZXR1cm4gc3R5bGUuc2hlZXQ7XG59XG5mdW5jdGlvbiBhcHBlbmRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSkge1xuICAgIGlmIChpc19oeWRyYXRpbmcpIHtcbiAgICAgICAgaW5pdF9oeWRyYXRlKHRhcmdldCk7XG4gICAgICAgIGlmICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPT09IHVuZGVmaW5lZCkgfHwgKCh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCAhPT0gbnVsbCkgJiYgKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkLnBhcmVudE5vZGUgIT09IHRhcmdldCkpKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IHRhcmdldC5maXJzdENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNraXAgbm9kZXMgb2YgdW5kZWZpbmVkIG9yZGVyaW5nXG4gICAgICAgIHdoaWxlICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwpICYmICh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5jbGFpbV9vcmRlciA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZSAhPT0gdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpIHtcbiAgICAgICAgICAgIC8vIFdlIG9ubHkgaW5zZXJ0IGlmIHRoZSBvcmRlcmluZyBvZiB0aGlzIG5vZGUgc2hvdWxkIGJlIG1vZGlmaWVkIG9yIHRoZSBwYXJlbnQgbm9kZSBpcyBub3QgdGFyZ2V0XG4gICAgICAgICAgICBpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkIHx8IG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlICE9PSB0YXJnZXQgfHwgbm9kZS5uZXh0U2libGluZyAhPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5mdW5jdGlvbiBpbnNlcnRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgaWYgKGlzX2h5ZHJhdGluZyAmJiAhYW5jaG9yKSB7XG4gICAgICAgIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlICE9PSB0YXJnZXQgfHwgbm9kZS5uZXh0U2libGluZyAhPSBhbmNob3IpIHtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zW2ldKVxuICAgICAgICAgICAgaXRlcmF0aW9uc1tpXS5kKGRldGFjaGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSwgeyBpcyB9KTtcbn1cbmZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzX3Byb3Aob2JqLCBrKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJiYgZXhjbHVkZS5pbmRleE9mKGspID09PSAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0W2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBzdmdfZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIHRleHQoZGF0YSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKTtcbn1cbmZ1bmN0aW9uIHNwYWNlKCkge1xuICAgIHJldHVybiB0ZXh0KCcgJyk7XG59XG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGV4dCgnJyk7XG59XG5mdW5jdGlvbiBjb21tZW50KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChjb250ZW50KTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfaW1tZWRpYXRlX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cnVzdGVkKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC5pc1RydXN0ZWQpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZSBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuLyoqXG4gKiBMaXN0IG9mIGF0dHJpYnV0ZXMgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHNldCB0aHJvdWdoIHRoZSBhdHRyIG1ldGhvZCxcbiAqIGJlY2F1c2UgdXBkYXRpbmcgdGhlbSB0aHJvdWdoIHRoZSBwcm9wZXJ0eSBzZXR0ZXIgZG9lc24ndCB3b3JrIHJlbGlhYmx5LlxuICogSW4gdGhlIGV4YW1wbGUgb2YgYHdpZHRoYC9gaGVpZ2h0YCwgdGhlIHByb2JsZW0gaXMgdGhhdCB0aGUgc2V0dGVyIG9ubHlcbiAqIGFjY2VwdHMgbnVtZXJpYyB2YWx1ZXMsIGJ1dCB0aGUgYXR0cmlidXRlIGNhbiBhbHNvIGJlIHNldCB0byBhIHN0cmluZyBsaWtlIGA1MCVgLlxuICogSWYgdGhpcyBsaXN0IGJlY29tZXMgdG9vIGJpZywgcmV0aGluayB0aGlzIGFwcHJvYWNoLlxuICovXG5jb25zdCBhbHdheXNfc2V0X3Rocm91Z2hfc2V0X2F0dHJpYnV0ZSA9IFsnd2lkdGgnLCAnaGVpZ2h0J107XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ19fdmFsdWUnKSB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQgJiYgYWx3YXlzX3NldF90aHJvdWdoX3NldF9hdHRyaWJ1dGUuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwKG5vZGUsIGRhdGFfbWFwKSB7XG4gICAgT2JqZWN0LmtleXMoZGF0YV9tYXApLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBrZXksIGRhdGFfbWFwW2tleV0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB0eXBlb2Ygbm9kZVtwcm9wXSA9PT0gJ2Jvb2xlYW4nICYmIHZhbHVlID09PSAnJyA/IHRydWUgOiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9keW5hbWljX2VsZW1lbnRfZGF0YSh0YWcpIHtcbiAgICByZXR1cm4gKC8tLy50ZXN0KHRhZykpID8gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwIDogc2V0X2F0dHJpYnV0ZXM7XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCwgX192YWx1ZSwgY2hlY2tlZCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5hZGQoZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIGlmICghY2hlY2tlZCkge1xuICAgICAgICB2YWx1ZS5kZWxldGUoX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGluaXRfYmluZGluZ19ncm91cChncm91cCkge1xuICAgIGxldCBfaW5wdXRzO1xuICAgIHJldHVybiB7XG4gICAgICAgIC8qIHB1c2ggKi8gcCguLi5pbnB1dHMpIHtcbiAgICAgICAgICAgIF9pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gZ3JvdXAucHVzaChpbnB1dCkpO1xuICAgICAgICB9LFxuICAgICAgICAvKiByZW1vdmUgKi8gcigpIHtcbiAgICAgICAgICAgIF9pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBncm91cC5zcGxpY2UoZ3JvdXAuaW5kZXhPZihpbnB1dCksIDEpKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBpbml0X2JpbmRpbmdfZ3JvdXBfZHluYW1pYyhncm91cCwgaW5kZXhlcykge1xuICAgIGxldCBfZ3JvdXAgPSBnZXRfYmluZGluZ19ncm91cChncm91cCk7XG4gICAgbGV0IF9pbnB1dHM7XG4gICAgZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXAoZ3JvdXApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBncm91cCA9IGdyb3VwW2luZGV4ZXNbaV1dID0gZ3JvdXBbaW5kZXhlc1tpXV0gfHwgW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gX2dyb3VwLnB1c2goaW5wdXQpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gX2dyb3VwLnNwbGljZShfZ3JvdXAuaW5kZXhPZihpbnB1dCksIDEpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyogdXBkYXRlICovIHUobmV3X2luZGV4ZXMpIHtcbiAgICAgICAgICAgIGluZGV4ZXMgPSBuZXdfaW5kZXhlcztcbiAgICAgICAgICAgIGNvbnN0IG5ld19ncm91cCA9IGdldF9iaW5kaW5nX2dyb3VwKGdyb3VwKTtcbiAgICAgICAgICAgIGlmIChuZXdfZ3JvdXAgIT09IF9ncm91cCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIF9ncm91cCA9IG5ld19ncm91cDtcbiAgICAgICAgICAgICAgICBwdXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qIHB1c2ggKi8gcCguLi5pbnB1dHMpIHtcbiAgICAgICAgICAgIF9pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgICAgICBwdXNoKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qIHJlbW92ZSAqLyByOiByZW1vdmVcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IG51bGwgOiArdmFsdWU7XG59XG5mdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFycmF5LnB1c2goeyBzdGFydDogcmFuZ2VzLnN0YXJ0KGkpLCBlbmQ6IHJhbmdlcy5lbmQoaSkgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xufVxuZnVuY3Rpb24gaW5pdF9jbGFpbV9pbmZvKG5vZGVzKSB7XG4gICAgaWYgKG5vZGVzLmNsYWltX2luZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub2Rlcy5jbGFpbV9pbmZvID0geyBsYXN0X2luZGV4OiAwLCB0b3RhbF9jbGFpbWVkOiAwIH07XG4gICAgfVxufVxuZnVuY3Rpb24gY2xhaW1fbm9kZShub2RlcywgcHJlZGljYXRlLCBwcm9jZXNzTm9kZSwgY3JlYXRlTm9kZSwgZG9udFVwZGF0ZUxhc3RJbmRleCA9IGZhbHNlKSB7XG4gICAgLy8gVHJ5IHRvIGZpbmQgbm9kZXMgaW4gYW4gb3JkZXIgc3VjaCB0aGF0IHdlIGxlbmd0aGVuIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2VcbiAgICBpbml0X2NsYWltX2luZm8obm9kZXMpO1xuICAgIGNvbnN0IHJlc3VsdE5vZGUgPSAoKCkgPT4ge1xuICAgICAgICAvLyBXZSBmaXJzdCB0cnkgdG8gZmluZCBhbiBlbGVtZW50IGFmdGVyIHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgZm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBwcm9jZXNzTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWRvbnRVcGRhdGVMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0cnkgdG8gZmluZCBvbmUgYmVmb3JlXG4gICAgICAgIC8vIFdlIGl0ZXJhdGUgaW4gcmV2ZXJzZSBzbyB0aGF0IHdlIGRvbid0IGdvIHRvbyBmYXIgYmFja1xuICAgICAgICBmb3IgKGxldCBpID0gbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXBsYWNlbWVudCA9IHByb2Nlc3NOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzW2ldID0gcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZG9udFVwZGF0ZUxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIHNwbGljZWQgYmVmb3JlIHRoZSBsYXN0X2luZGV4LCB3ZSBkZWNyZWFzZSBpdFxuICAgICAgICAgICAgICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXgtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgY2FuJ3QgZmluZCBhbnkgbWF0Y2hpbmcgbm9kZSwgd2UgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICByZXR1cm4gY3JlYXRlTm9kZSgpO1xuICAgIH0pKCk7XG4gICAgcmVzdWx0Tm9kZS5jbGFpbV9vcmRlciA9IG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZDtcbiAgICBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcbiAgICByZXR1cm4gcmVzdWx0Tm9kZTtcbn1cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgY3JlYXRlX2VsZW1lbnQpIHtcbiAgICByZXR1cm4gY2xhaW1fbm9kZShub2RlcywgKG5vZGUpID0+IG5vZGUubm9kZU5hbWUgPT09IG5hbWUsIChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2pdO1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZS5wdXNoKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW1vdmUuZm9yRWFjaCh2ID0+IG5vZGUucmVtb3ZlQXR0cmlidXRlKHYpKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LCAoKSA9PiBjcmVhdGVfZWxlbWVudChuYW1lKSk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgZWxlbWVudCk7XG59XG5mdW5jdGlvbiBjbGFpbV9zdmdfZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIHN2Z19lbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGNsYWltX3RleHQobm9kZXMsIGRhdGEpIHtcbiAgICByZXR1cm4gY2xhaW1fbm9kZShub2RlcywgKG5vZGUpID0+IG5vZGUubm9kZVR5cGUgPT09IDMsIChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGFTdHIgPSAnJyArIGRhdGE7XG4gICAgICAgIGlmIChub2RlLmRhdGEuc3RhcnRzV2l0aChkYXRhU3RyKSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS5sZW5ndGggIT09IGRhdGFTdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3BsaXRUZXh0KGRhdGFTdHIubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IGRhdGFTdHI7XG4gICAgICAgIH1cbiAgICB9LCAoKSA9PiB0ZXh0KGRhdGEpLCB0cnVlIC8vIFRleHQgbm9kZXMgc2hvdWxkIG5vdCB1cGRhdGUgbGFzdCBpbmRleCBzaW5jZSBpdCBpcyBsaWtlbHkgbm90IHdvcnRoIGl0IHRvIGVsaW1pbmF0ZSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIGFjdHVhbCBlbGVtZW50c1xuICAgICk7XG59XG5mdW5jdGlvbiBjbGFpbV9zcGFjZShub2Rlcykge1xuICAgIHJldHVybiBjbGFpbV90ZXh0KG5vZGVzLCAnICcpO1xufVxuZnVuY3Rpb24gY2xhaW1fY29tbWVudChub2RlcywgZGF0YSkge1xuICAgIHJldHVybiBjbGFpbV9ub2RlKG5vZGVzLCAobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gOCwgKG5vZGUpID0+IHtcbiAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sICgpID0+IGNvbW1lbnQoZGF0YSksIHRydWUpO1xufVxuZnVuY3Rpb24gZmluZF9jb21tZW50KG5vZGVzLCB0ZXh0LCBzdGFydCkge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCBub2RlICovICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpID09PSB0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoO1xufVxuZnVuY3Rpb24gY2xhaW1faHRtbF90YWcobm9kZXMsIGlzX3N2Zykge1xuICAgIC8vIGZpbmQgaHRtbCBvcGVuaW5nIHRhZ1xuICAgIGNvbnN0IHN0YXJ0X2luZGV4ID0gZmluZF9jb21tZW50KG5vZGVzLCAnSFRNTF9UQUdfU1RBUlQnLCAwKTtcbiAgICBjb25zdCBlbmRfaW5kZXggPSBmaW5kX2NvbW1lbnQobm9kZXMsICdIVE1MX1RBR19FTkQnLCBzdGFydF9pbmRleCk7XG4gICAgaWYgKHN0YXJ0X2luZGV4ID09PSBlbmRfaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKHVuZGVmaW5lZCwgaXNfc3ZnKTtcbiAgICB9XG4gICAgaW5pdF9jbGFpbV9pbmZvKG5vZGVzKTtcbiAgICBjb25zdCBodG1sX3RhZ19ub2RlcyA9IG5vZGVzLnNwbGljZShzdGFydF9pbmRleCwgZW5kX2luZGV4IC0gc3RhcnRfaW5kZXggKyAxKTtcbiAgICBkZXRhY2goaHRtbF90YWdfbm9kZXNbMF0pO1xuICAgIGRldGFjaChodG1sX3RhZ19ub2Rlc1todG1sX3RhZ19ub2Rlcy5sZW5ndGggLSAxXSk7XG4gICAgY29uc3QgY2xhaW1lZF9ub2RlcyA9IGh0bWxfdGFnX25vZGVzLnNsaWNlKDEsIGh0bWxfdGFnX25vZGVzLmxlbmd0aCAtIDEpO1xuICAgIGZvciAoY29uc3QgbiBvZiBjbGFpbWVkX25vZGVzKSB7XG4gICAgICAgIG4uY2xhaW1fb3JkZXIgPSBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQ7XG4gICAgICAgIG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEh0bWxUYWdIeWRyYXRpb24oY2xhaW1lZF9ub2RlcywgaXNfc3ZnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfY29udGVudGVkaXRhYmxlKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0Lndob2xlVGV4dCA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9tYXliZV9jb250ZW50ZWRpdGFibGUodGV4dCwgZGF0YSwgYXR0cl92YWx1ZSkge1xuICAgIGlmICh+Y29udGVudGVkaXRhYmxlX3RydXRoeV92YWx1ZXMuaW5kZXhPZihhdHRyX3ZhbHVlKSkge1xuICAgICAgICBzZXRfZGF0YV9jb250ZW50ZWRpdGFibGUodGV4dCwgZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzZXRfZGF0YSh0ZXh0LCBkYXRhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUsIG1vdW50aW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW1vdW50aW5nIHx8IHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSAtMTsgLy8gbm8gb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZFxuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb25zKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB+dmFsdWUuaW5kZXhPZihvcHRpb24uX192YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X3ZhbHVlKHNlbGVjdCkge1xuICAgIGNvbnN0IHNlbGVjdGVkX29wdGlvbiA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpO1xuICAgIHJldHVybiBzZWxlY3RlZF9vcHRpb24gJiYgc2VsZWN0ZWRfb3B0aW9uLl9fdmFsdWU7XG59XG5mdW5jdGlvbiBzZWxlY3RfbXVsdGlwbGVfdmFsdWUoc2VsZWN0KSB7XG4gICAgcmV0dXJuIFtdLm1hcC5jYWxsKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCc6Y2hlY2tlZCcpLCBvcHRpb24gPT4gb3B0aW9uLl9fdmFsdWUpO1xufVxuLy8gdW5mb3J0dW5hdGVseSB0aGlzIGNhbid0IGJlIGEgY29uc3RhbnQgYXMgdGhhdCB3b3VsZG4ndCBiZSB0cmVlLXNoYWtlYWJsZVxuLy8gc28gd2UgY2FjaGUgdGhlIHJlc3VsdCBpbnN0ZWFkXG5sZXQgY3Jvc3NvcmlnaW47XG5mdW5jdGlvbiBpc19jcm9zc29yaWdpbigpIHtcbiAgICBpZiAoY3Jvc3NvcmlnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjcm9zc29yaWdpbiA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICB2b2lkIHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjcm9zc29yaWdpbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNyb3Nzb3JpZ2luO1xufVxuZnVuY3Rpb24gYWRkX2lmcmFtZV9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKGNvbXB1dGVkX3N0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG4gICAgY29uc3QgaWZyYW1lID0gZWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyAnICtcbiAgICAgICAgJ292ZXJmbG93OiBoaWRkZW47IGJvcmRlcjogMDsgb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICBjb25zdCBjcm9zc29yaWdpbiA9IGlzX2Nyb3Nzb3JpZ2luKCk7XG4gICAgbGV0IHVuc3Vic2NyaWJlO1xuICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICBpZnJhbWUuc3JjID0gXCJkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5cIjtcbiAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4od2luZG93LCAnbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gaWZyYW1lLmNvbnRlbnRXaW5kb3cpXG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgaWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKGlmcmFtZS5jb250ZW50V2luZG93LCAncmVzaXplJywgZm4pO1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGFuIGluaXRpYWwgcmVzaXplIGV2ZW50IGlzIGZpcmVkIF9hZnRlcl8gdGhlIGlmcmFtZSBpcyBsb2FkZWQgKHdoaWNoIGlzIGFzeW5jaHJvbm91cylcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL2lzc3Vlcy80MjMzXG4gICAgICAgICAgICBmbigpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhcHBlbmQobm9kZSwgaWZyYW1lKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5zdWJzY3JpYmUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGV0YWNoKGlmcmFtZSk7XG4gICAgfTtcbn1cbmNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9jb250ZW50X2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oeyBib3g6ICdjb250ZW50LWJveCcgfSk7XG5jb25zdCByZXNpemVfb2JzZXJ2ZXJfYm9yZGVyX2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oeyBib3g6ICdib3JkZXItYm94JyB9KTtcbmNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9kZXZpY2VfcGl4ZWxfY29udGVudF9ib3ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFJlc2l6ZU9ic2VydmVyU2luZ2xldG9uKHsgYm94OiAnZGV2aWNlLXBpeGVsLWNvbnRlbnQtYm94JyB9KTtcbmZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdFt0b2dnbGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgYnViYmxlcyA9IGZhbHNlLCBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuZnVuY3Rpb24gaGVhZF9zZWxlY3Rvcihub2RlSWQsIGhlYWQpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBsZXQgc3RhcnRlZCA9IDA7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIGhlYWQuY2hpbGROb2Rlcykge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBjb21tZW50IG5vZGUgKi8pIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBub2RlLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb21tZW50ID09PSBgSEVBRF8ke25vZGVJZH1fRU5EYCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0ZWQgLT0gMTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1lbnQgPT09IGBIRUFEXyR7bm9kZUlkfV9TVEFSVGApIHtcbiAgICAgICAgICAgICAgICBzdGFydGVkICs9IDE7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhcnRlZCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3Rvcihpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmlzX3N2ZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzX3N2ZyA9IGlzX3N2ZztcbiAgICAgICAgdGhpcy5lID0gdGhpcy5uID0gbnVsbDtcbiAgICB9XG4gICAgYyhodG1sKSB7XG4gICAgICAgIHRoaXMuaChodG1sKTtcbiAgICB9XG4gICAgbShodG1sLCB0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX3N2ZylcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBzdmdfZWxlbWVudCh0YXJnZXQubm9kZU5hbWUpO1xuICAgICAgICAgICAgLyoqICM3MzY0ICB0YXJnZXQgZm9yIDx0ZW1wbGF0ZT4gbWF5IGJlIHByb3ZpZGVkIGFzICNkb2N1bWVudC1mcmFnbWVudCgxMSkgKi9cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KCh0YXJnZXQubm9kZVR5cGUgPT09IDExID8gJ1RFTVBMQVRFJyA6IHRhcmdldC5ub2RlTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy50ID0gdGFyZ2V0LnRhZ05hbWUgIT09ICdURU1QTEFURScgPyB0YXJnZXQgOiB0YXJnZXQuY29udGVudDtcbiAgICAgICAgICAgIHRoaXMuYyhodG1sKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmkoYW5jaG9yKTtcbiAgICB9XG4gICAgaChodG1sKSB7XG4gICAgICAgIHRoaXMuZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB0aGlzLm4gPSBBcnJheS5mcm9tKHRoaXMuZS5ub2RlTmFtZSA9PT0gJ1RFTVBMQVRFJyA/IHRoaXMuZS5jb250ZW50LmNoaWxkTm9kZXMgOiB0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cbmNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFpbWVkX25vZGVzLCBpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihpc19zdmcpO1xuICAgICAgICB0aGlzLmUgPSB0aGlzLm4gPSBudWxsO1xuICAgICAgICB0aGlzLmwgPSBjbGFpbWVkX25vZGVzO1xuICAgIH1cbiAgICBjKGh0bWwpIHtcbiAgICAgICAgaWYgKHRoaXMubCkge1xuICAgICAgICAgICAgdGhpcy5uID0gdGhpcy5sO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuYyhodG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpKGFuY2hvcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaW5zZXJ0X2h5ZHJhdGlvbih0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZV90b19vYmplY3QoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmVzdWx0W2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHJlc3VsdFtub2RlLnNsb3QgfHwgJ2RlZmF1bHQnXSA9IHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50KGNvbXBvbmVudCwgcHJvcHMpIHtcbiAgICByZXR1cm4gbmV3IGNvbXBvbmVudChwcm9wcyk7XG59XG5cbi8vIHdlIG5lZWQgdG8gc3RvcmUgdGhlIGluZm9ybWF0aW9uIGZvciBtdWx0aXBsZSBkb2N1bWVudHMgYmVjYXVzZSBhIFN2ZWx0ZSBhcHBsaWNhdGlvbiBjb3VsZCBhbHNvIGNvbnRhaW4gaWZyYW1lc1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9pc3N1ZXMvMzYyNFxuY29uc3QgbWFuYWdlZF9zdHlsZXMgPSBuZXcgTWFwKCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfc3R5bGVfaW5mb3JtYXRpb24oZG9jLCBub2RlKSB7XG4gICAgY29uc3QgaW5mbyA9IHsgc3R5bGVzaGVldDogYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSksIHJ1bGVzOiB7fSB9O1xuICAgIG1hbmFnZWRfc3R5bGVzLnNldChkb2MsIGluZm8pO1xuICAgIHJldHVybiBpbmZvO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBjb25zdCBkb2MgPSBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSk7XG4gICAgY29uc3QgeyBzdHlsZXNoZWV0LCBydWxlcyB9ID0gbWFuYWdlZF9zdHlsZXMuZ2V0KGRvYykgfHwgY3JlYXRlX3N0eWxlX2luZm9ybWF0aW9uKGRvYywgbm9kZSk7XG4gICAgaWYgKCFydWxlc1tuYW1lXSkge1xuICAgICAgICBydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6ICcnfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbWFuYWdlZF9zdHlsZXMuZm9yRWFjaChpbmZvID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3duZXJOb2RlIH0gPSBpbmZvLnN0eWxlc2hlZXQ7XG4gICAgICAgICAgICAvLyB0aGVyZSBpcyBubyBvd25lck5vZGUgaWYgaXQgcnVucyBvbiBqc2RvbS5cbiAgICAgICAgICAgIGlmIChvd25lck5vZGUpXG4gICAgICAgICAgICAgICAgZGV0YWNoKG93bmVyTm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYW5hZ2VkX3N0eWxlcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uJyk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgdXBkYXRlZCBhZnRlciBhbnkgc3RhdGUgY2hhbmdlLlxuICpcbiAqIFRoZSBmaXJzdCB0aW1lIHRoZSBjYWxsYmFjayBydW5zIHdpbGwgYmUgYmVmb3JlIHRoZSBpbml0aWFsIGBvbk1vdW50YFxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1iZWZvcmV1cGRhdGVcbiAqL1xuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbi8qKlxuICogVGhlIGBvbk1vdW50YCBmdW5jdGlvbiBzY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gYXMgc29vbiBhcyB0aGUgY29tcG9uZW50IGhhcyBiZWVuIG1vdW50ZWQgdG8gdGhlIERPTS5cbiAqIEl0IG11c3QgYmUgY2FsbGVkIGR1cmluZyB0aGUgY29tcG9uZW50J3MgaW5pdGlhbGlzYXRpb24gKGJ1dCBkb2Vzbid0IG5lZWQgdG8gbGl2ZSAqaW5zaWRlKiB0aGUgY29tcG9uZW50O1xuICogaXQgY2FuIGJlIGNhbGxlZCBmcm9tIGFuIGV4dGVybmFsIG1vZHVsZSkuXG4gKlxuICogYG9uTW91bnRgIGRvZXMgbm90IHJ1biBpbnNpZGUgYSBbc2VydmVyLXNpZGUgY29tcG9uZW50XSgvZG9jcyNydW4tdGltZS1zZXJ2ZXItc2lkZS1jb21wb25lbnQtYXBpKS5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtb25tb3VudFxuICovXG5mdW5jdGlvbiBvbk1vdW50KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fbW91bnQucHVzaChmbik7XG59XG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBhZnRlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHVwZGF0ZWQuXG4gKlxuICogVGhlIGZpcnN0IHRpbWUgdGhlIGNhbGxiYWNrIHJ1bnMgd2lsbCBiZSBhZnRlciB0aGUgaW5pdGlhbCBgb25Nb3VudGBcbiAqL1xuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQuXG4gKlxuICogT3V0IG9mIGBvbk1vdW50YCwgYGJlZm9yZVVwZGF0ZWAsIGBhZnRlclVwZGF0ZWAgYW5kIGBvbkRlc3Ryb3lgLCB0aGlzIGlzIHRoZVxuICogb25seSBvbmUgdGhhdCBydW5zIGluc2lkZSBhIHNlcnZlci1zaWRlIGNvbXBvbmVudC5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtb25kZXN0cm95XG4gKi9cbmZ1bmN0aW9uIG9uRGVzdHJveShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX2Rlc3Ryb3kucHVzaChmbik7XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gZXZlbnQgZGlzcGF0Y2hlciB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3BhdGNoIFtjb21wb25lbnQgZXZlbnRzXSgvZG9jcyN0ZW1wbGF0ZS1zeW50YXgtY29tcG9uZW50LWRpcmVjdGl2ZXMtb24tZXZlbnRuYW1lKS5cbiAqIEV2ZW50IGRpc3BhdGNoZXJzIGFyZSBmdW5jdGlvbnMgdGhhdCBjYW4gdGFrZSB0d28gYXJndW1lbnRzOiBgbmFtZWAgYW5kIGBkZXRhaWxgLlxuICpcbiAqIENvbXBvbmVudCBldmVudHMgY3JlYXRlZCB3aXRoIGBjcmVhdGVFdmVudERpc3BhdGNoZXJgIGNyZWF0ZSBhXG4gKiBbQ3VzdG9tRXZlbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudCkuXG4gKiBUaGVzZSBldmVudHMgZG8gbm90IFtidWJibGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTGVhcm4vSmF2YVNjcmlwdC9CdWlsZGluZ19ibG9ja3MvRXZlbnRzI0V2ZW50X2J1YmJsaW5nX2FuZF9jYXB0dXJlKS5cbiAqIFRoZSBgZGV0YWlsYCBhcmd1bWVudCBjb3JyZXNwb25kcyB0byB0aGUgW0N1c3RvbUV2ZW50LmRldGFpbF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50L2RldGFpbClcbiAqIHByb3BlcnR5IGFuZCBjYW4gY29udGFpbiBhbnkgdHlwZSBvZiBkYXRhLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1jcmVhdGVldmVudGRpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsLCB7IGNhbmNlbGFibGUgPSBmYWxzZSB9ID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gY29tcG9uZW50LiQkLmNhbGxiYWNrc1t0eXBlXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgLy8gVE9ETyBhcmUgdGhlcmUgc2l0dWF0aW9ucyB3aGVyZSBldmVudHMgY291bGQgYmUgZGlzcGF0Y2hlZFxuICAgICAgICAgICAgLy8gaW4gYSBzZXJ2ZXIgKG5vbi1ET00pIGVudmlyb25tZW50P1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsLCB7IGNhbmNlbGFibGUgfSk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbn1cbi8qKlxuICogQXNzb2NpYXRlcyBhbiBhcmJpdHJhcnkgYGNvbnRleHRgIG9iamVjdCB3aXRoIHRoZSBjdXJyZW50IGNvbXBvbmVudCBhbmQgdGhlIHNwZWNpZmllZCBga2V5YFxuICogYW5kIHJldHVybnMgdGhhdCBvYmplY3QuIFRoZSBjb250ZXh0IGlzIHRoZW4gYXZhaWxhYmxlIHRvIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAqIChpbmNsdWRpbmcgc2xvdHRlZCBjb250ZW50KSB3aXRoIGBnZXRDb250ZXh0YC5cbiAqXG4gKiBMaWtlIGxpZmVjeWNsZSBmdW5jdGlvbnMsIHRoaXMgbXVzdCBiZSBjYWxsZWQgZHVyaW5nIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtc2V0Y29udGV4dFxuICovXG5mdW5jdGlvbiBzZXRDb250ZXh0KGtleSwgY29udGV4dCkge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuc2V0KGtleSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG59XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgY29udGV4dCB0aGF0IGJlbG9uZ3MgdG8gdGhlIGNsb3Nlc3QgcGFyZW50IGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgYGtleWAuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1nZXRjb250ZXh0XG4gKi9cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgd2hvbGUgY29udGV4dCBtYXAgdGhhdCBiZWxvbmdzIHRvIHRoZSBjbG9zZXN0IHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLiBVc2VmdWwsIGZvciBleGFtcGxlLCBpZiB5b3VcbiAqIHByb2dyYW1tYXRpY2FsbHkgY3JlYXRlIGEgY29tcG9uZW50IGFuZCB3YW50IHRvIHBhc3MgdGhlIGV4aXN0aW5nIGNvbnRleHQgdG8gaXQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3MjcnVuLXRpbWUtc3ZlbHRlLWdldGFsbGNvbnRleHRzXG4gKi9cbmZ1bmN0aW9uIGdldEFsbENvbnRleHRzKCkge1xuICAgIHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0O1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIGBrZXlgIGhhcyBiZWVuIHNldCBpbiB0aGUgY29udGV4dCBvZiBhIHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1oYXNjb250ZXh0XG4gKi9cbmZ1bmN0aW9uIGhhc0NvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuaGFzKGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuLmNhbGwodGhpcywgZXZlbnQpKTtcbiAgICB9XG59XG5cbmNvbnN0IGRpcnR5X2NvbXBvbmVudHMgPSBbXTtcbmNvbnN0IGludHJvcyA9IHsgZW5hYmxlZDogZmFsc2UgfTtcbmNvbnN0IGJpbmRpbmdfY2FsbGJhY2tzID0gW107XG5sZXQgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gLyogQF9fUFVSRV9fICovIFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuLy8gZmx1c2goKSBjYWxscyBjYWxsYmFja3MgaW4gdGhpcyBvcmRlcjpcbi8vIDEuIEFsbCBiZWZvcmVVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW5cbi8vIDIuIEFsbCBiaW5kOnRoaXMgY2FsbGJhY2tzLCBpbiByZXZlcnNlIG9yZGVyOiBjaGlsZHJlbiBiZWZvcmUgcGFyZW50cy5cbi8vIDMuIEFsbCBhZnRlclVwZGF0ZSBjYWxsYmFja3MsIGluIG9yZGVyOiBwYXJlbnRzIGJlZm9yZSBjaGlsZHJlbi4gRVhDRVBUXG4vLyAgICBmb3IgYWZ0ZXJVcGRhdGVzIGNhbGxlZCBkdXJpbmcgdGhlIGluaXRpYWwgb25Nb3VudCwgd2hpY2ggYXJlIGNhbGxlZCBpblxuLy8gICAgcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyBTaW5jZSBjYWxsYmFja3MgbWlnaHQgdXBkYXRlIGNvbXBvbmVudCB2YWx1ZXMsIHdoaWNoIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuLy8gY2FsbCB0byBmbHVzaCgpLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGd1YXJkIGFnYWluc3QgdGhpczpcbi8vIDEuIER1cmluZyBiZWZvcmVVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGVcbi8vICAgIGRpcnR5X2NvbXBvbmVudHMgYXJyYXkgYW5kIHdpbGwgY2F1c2UgYSByZWVudHJhbnQgY2FsbCB0byBmbHVzaCgpLiBCZWNhdXNlXG4vLyAgICB0aGUgZmx1c2ggaW5kZXggaXMga2VwdCBvdXRzaWRlIHRoZSBmdW5jdGlvbiwgdGhlIHJlZW50cmFudCBjYWxsIHdpbGwgcGlja1xuLy8gICAgdXAgd2hlcmUgdGhlIGVhcmxpZXIgY2FsbCBsZWZ0IG9mZiBhbmQgZ28gdGhyb3VnaCBhbGwgZGlydHkgY29tcG9uZW50cy4gVGhlXG4vLyAgICBjdXJyZW50X2NvbXBvbmVudCB2YWx1ZSBpcyBzYXZlZCBhbmQgcmVzdG9yZWQgc28gdGhhdCB0aGUgcmVlbnRyYW50IGNhbGwgd2lsbFxuLy8gICAgbm90IGludGVyZmVyZSB3aXRoIHRoZSBcInBhcmVudFwiIGZsdXNoKCkgY2FsbC5cbi8vIDIuIGJpbmQ6dGhpcyBjYWxsYmFja3MgY2Fubm90IHRyaWdnZXIgbmV3IGZsdXNoKCkgY2FsbHMuXG4vLyAzLiBEdXJpbmcgYWZ0ZXJVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBOT1QgaGF2ZSB0aGVpciBhZnRlclVwZGF0ZVxuLy8gICAgY2FsbGJhY2sgY2FsbGVkIGEgc2Vjb25kIHRpbWU7IHRoZSBzZWVuX2NhbGxiYWNrcyBzZXQsIG91dHNpZGUgdGhlIGZsdXNoKClcbi8vICAgIGZ1bmN0aW9uLCBndWFyYW50ZWVzIHRoaXMgYmVoYXZpb3IuXG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmxldCBmbHVzaGlkeCA9IDA7IC8vIERvICpub3QqIG1vdmUgdGhpcyBpbnNpZGUgdGhlIGZsdXNoKCkgZnVuY3Rpb25cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIC8vIERvIG5vdCByZWVudGVyIGZsdXNoIHdoaWxlIGRpcnR5IGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGFzIHRoaXMgY2FuXG4gICAgLy8gcmVzdWx0IGluIGFuIGluZmluaXRlIGxvb3AuIEluc3RlYWQsIGxldCB0aGUgaW5uZXIgZmx1c2ggaGFuZGxlIGl0LlxuICAgIC8vIFJlZW50cmFuY3kgaXMgb2sgYWZ0ZXJ3YXJkcyBmb3IgYmluZGluZ3MgZXRjLlxuICAgIGlmIChmbHVzaGlkeCAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNhdmVkX2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlIChmbHVzaGlkeCA8IGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tmbHVzaGlkeF07XG4gICAgICAgICAgICAgICAgZmx1c2hpZHgrKztcbiAgICAgICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB1cGRhdGUoY29tcG9uZW50LiQkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gcmVzZXQgZGlydHkgc3RhdGUgdG8gbm90IGVuZCB1cCBpbiBhIGRlYWRsb2NrZWQgc3RhdGUgYW5kIHRoZW4gcmV0aHJvd1xuICAgICAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgZmx1c2hpZHggPSAwO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgZmx1c2hpZHggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgc2Vlbl9jYWxsYmFja3MuY2xlYXIoKTtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoc2F2ZWRfY29tcG9uZW50KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZSgkJCkge1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAkJC51cGRhdGUoKTtcbiAgICAgICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAgICAgY29uc3QgZGlydHkgPSAkJC5kaXJ0eTtcbiAgICAgICAgJCQuZGlydHkgPSBbLTFdO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5wKCQkLmN0eCwgZGlydHkpO1xuICAgICAgICAkJC5hZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbiAgICB9XG59XG4vKipcbiAqIFVzZWZ1bCBmb3IgZXhhbXBsZSB0byBleGVjdXRlIHJlbWFpbmluZyBgYWZ0ZXJVcGRhdGVgIGNhbGxiYWNrcyBiZWZvcmUgZXhlY3V0aW5nIGBkZXN0cm95YC5cbiAqL1xuZnVuY3Rpb24gZmx1c2hfcmVuZGVyX2NhbGxiYWNrcyhmbnMpIHtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IFtdO1xuICAgIGNvbnN0IHRhcmdldHMgPSBbXTtcbiAgICByZW5kZXJfY2FsbGJhY2tzLmZvckVhY2goKGMpID0+IGZucy5pbmRleE9mKGMpID09PSAtMSA/IGZpbHRlcmVkLnB1c2goYykgOiB0YXJnZXRzLnB1c2goYykpO1xuICAgIHRhcmdldHMuZm9yRWFjaCgoYykgPT4gYygpKTtcbiAgICByZW5kZXJfY2FsbGJhY2tzID0gZmlsdGVyZWQ7XG59XG5cbmxldCBwcm9taXNlO1xuZnVuY3Rpb24gd2FpdCgpIHtcbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xubGV0IG91dHJvcztcbmZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcbiAgICBvdXRyb3MgPSB7XG4gICAgICAgIHI6IDAsXG4gICAgICAgIGM6IFtdLFxuICAgICAgICBwOiBvdXRyb3MgLy8gcGFyZW50IGdyb3VwXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcbiAgICBpZiAoIW91dHJvcy5yKSB7XG4gICAgICAgIHJ1bl9hbGwob3V0cm9zLmMpO1xuICAgIH1cbiAgICBvdXRyb3MgPSBvdXRyb3MucDtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcbiAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgYmxvY2suaShsb2NhbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLm8pIHtcbiAgICAgICAgaWYgKG91dHJvaW5nLmhhcyhibG9jaykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG91dHJvaW5nLmFkZChibG9jayk7XG4gICAgICAgIG91dHJvcy5jLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhY2gpXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmQoMSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLm8obG9jYWwpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbn1cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcbmZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBjb25zdCBvcHRpb25zID0geyBkaXJlY3Rpb246ICdpbicgfTtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBsZXQgdGFzaztcbiAgICBsZXQgdWlkID0gMDtcbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzLCB1aWQrKyk7XG4gICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRhc2spXG4gICAgICAgICAgICB0YXNrLmFib3J0KCk7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcbiAgICAgICAgdGFzayA9IGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnb3V0JyB9O1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMsIG9wdGlvbnMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgY29uc3QgZ3JvdXAgPSBvdXRyb3M7XG4gICAgZ3JvdXAuciArPSAxO1xuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAxLCAwLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnc3RhcnQnKSk7XG4gICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIS0tZ3JvdXAucikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB3aWxsIHJlc3VsdCBpbiBgZW5kKClgIGJlaW5nIGNhbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IG5lZWQgdG8gY2xlYW4gdXAgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxIC0gdCwgdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnYm90aCcgfTtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICBsZXQgdCA9IGludHJvID8gMCA6IDE7XG4gICAgbGV0IHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lID0gbnVsbDtcbiAgICBmdW5jdGlvbiBjbGVhcl9hbmltYXRpb24oKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5pdChwcm9ncmFtLCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBkID0gKHByb2dyYW0uYiAtIHQpO1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBpbnRybywgYW5kIHRoZXJlJ3MgYSBkZWxheSwgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgLy8gYW4gaW5pdGlhbCB0aWNrIGFuZC9vciBhcHBseSBDU1MgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiKVxuICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHByb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgYiwgJ3N0YXJ0JykpO1xuICAgICAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nX3Byb2dyYW0gJiYgbm93ID4gcGVuZGluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIHJ1bm5pbmdfcHJvZ3JhbS5iLCBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24sIDAsIGVhc2luZywgY29uZmlnLmNzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCA9IHJ1bm5pbmdfcHJvZ3JhbS5iLCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbS5iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludHJvIOKAlCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG91dHJvIOKAlCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKHJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBydW5uaW5nX3Byb2dyYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gcnVubmluZ19wcm9ncmFtLmEgKyBydW5uaW5nX3Byb2dyYW0uZCAqIGVhc2luZyhwIC8gcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bihiKSB7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrc1tpXSA9PT0gYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5ibG9ja3NbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICAgICAgaWYgKCFpbmZvLmhhc0NhdGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBpZiB3ZSBwcmV2aW91c2x5IGhhZCBhIHRoZW4vY2F0Y2ggYmxvY2ssIGRlc3Ryb3kgaXRcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby5wZW5kaW5nKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5wZW5kaW5nLCAwKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnRoZW4pIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHByb21pc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHByb21pc2U7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlX2F3YWl0X2Jsb2NrX2JyYW5jaChpbmZvLCBjdHgsIGRpcnR5KSB7XG4gICAgY29uc3QgY2hpbGRfY3R4ID0gY3R4LnNsaWNlKCk7XG4gICAgY29uc3QgeyByZXNvbHZlZCB9ID0gaW5mbztcbiAgICBpZiAoaW5mby5jdXJyZW50ID09PSBpbmZvLnRoZW4pIHtcbiAgICAgICAgY2hpbGRfY3R4W2luZm8udmFsdWVdID0gcmVzb2x2ZWQ7XG4gICAgfVxuICAgIGlmIChpbmZvLmN1cnJlbnQgPT09IGluZm8uY2F0Y2gpIHtcbiAgICAgICAgY2hpbGRfY3R4W2luZm8uZXJyb3JdID0gcmVzb2x2ZWQ7XG4gICAgfVxuICAgIGluZm8uYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBbXTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICAvLyBkZWZlciB1cGRhdGVzIHVudGlsIGFsbCB0aGUgRE9NIHNodWZmbGluZyBpcyBkb25lXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goKCkgPT4gYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICBydW5fYWxsKHVwZGF0ZXMpO1xuICAgIHJldHVybiBuZXdfYmxvY2tzO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfZWFjaF9rZXlzKGN0eCwgbGlzdCwgZ2V0X2NvbnRleHQsIGdldF9rZXkpIHtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSkpO1xuICAgICAgICBpZiAoa2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgaGF2ZSBkdXBsaWNhdGUga2V5cyBpbiBhIGtleWVkIGVhY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0X3NwcmVhZF91cGRhdGUobGV2ZWxzLCB1cGRhdGVzKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgY29uc3QgdG9fbnVsbF9vdXQgPSB7fTtcbiAgICBjb25zdCBhY2NvdW50ZWRfZm9yID0geyAkJHNjb3BlOiAxIH07XG4gICAgbGV0IGkgPSBsZXZlbHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgbyA9IGxldmVsc1tpXTtcbiAgICAgICAgY29uc3QgbiA9IHVwZGF0ZXNbaV07XG4gICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIG4pKVxuICAgICAgICAgICAgICAgICAgICB0b19udWxsX291dFtrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRlZF9mb3Jba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVba2V5XSA9IG5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbHNbaV0gPSBuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdG9fbnVsbF9vdXQpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIHVwZGF0ZSkpXG4gICAgICAgICAgICB1cGRhdGVba2V5XSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZTtcbn1cbmZ1bmN0aW9uIGdldF9zcHJlYWRfb2JqZWN0KHNwcmVhZF9wcm9wcykge1xuICAgIHJldHVybiB0eXBlb2Ygc3ByZWFkX3Byb3BzID09PSAnb2JqZWN0JyAmJiBzcHJlYWRfcHJvcHMgIT09IG51bGwgPyBzcHJlYWRfcHJvcHMgOiB7fTtcbn1cblxuY29uc3QgX2Jvb2xlYW5fYXR0cmlidXRlcyA9IFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaW5lcnQnLFxuICAgICdpc21hcCcsXG4gICAgJ2xvb3AnLFxuICAgICdtdWx0aXBsZScsXG4gICAgJ211dGVkJyxcbiAgICAnbm9tb2R1bGUnLFxuICAgICdub3ZhbGlkYXRlJyxcbiAgICAnb3BlbicsXG4gICAgJ3BsYXlzaW5saW5lJyxcbiAgICAncmVhZG9ubHknLFxuICAgICdyZXF1aXJlZCcsXG4gICAgJ3JldmVyc2VkJyxcbiAgICAnc2VsZWN0ZWQnXG5dO1xuLyoqXG4gKiBMaXN0IG9mIEhUTUwgYm9vbGVhbiBhdHRyaWJ1dGVzIChlLmcuIGA8aW5wdXQgZGlzYWJsZWQ+YCkuXG4gKiBTb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuICovXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFsuLi5fYm9vbGVhbl9hdHRyaWJ1dGVzXSk7XG5cbi8qKiByZWdleCBvZiBhbGwgaHRtbCB2b2lkIGVsZW1lbnQgbmFtZXMgKi9cbmNvbnN0IHZvaWRfZWxlbWVudF9uYW1lcyA9IC9eKD86YXJlYXxiYXNlfGJyfGNvbHxjb21tYW5kfGVtYmVkfGhyfGltZ3xpbnB1dHxrZXlnZW58bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIpJC87XG5mdW5jdGlvbiBpc192b2lkKG5hbWUpIHtcbiAgICByZXR1cm4gdm9pZF9lbGVtZW50X25hbWVzLnRlc3QobmFtZSkgfHwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnIWRvY3R5cGUnO1xufVxuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBhdHRyc190b19hZGQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7fSwgLi4uYXJncyk7XG4gICAgaWYgKGF0dHJzX3RvX2FkZCkge1xuICAgICAgICBjb25zdCBjbGFzc2VzX3RvX2FkZCA9IGF0dHJzX3RvX2FkZC5jbGFzc2VzO1xuICAgICAgICBjb25zdCBzdHlsZXNfdG9fYWRkID0gYXR0cnNfdG9fYWRkLnN0eWxlcztcbiAgICAgICAgaWYgKGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3R5bGVzX3RvX2FkZCkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuc3R5bGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlc190b19hZGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zdHlsZSA9IHN0eWxlX29iamVjdF90b19zdHJpbmcobWVyZ2Vfc3NyX3N0eWxlcyhhdHRyaWJ1dGVzLnN0eWxlLCBzdHlsZXNfdG9fYWRkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGlmIChpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3Rlci50ZXN0KG5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHN0ciArPSAnICcgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gJyAnICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgKz0gYCAke25hbWV9PVwiJHt2YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuZnVuY3Rpb24gbWVyZ2Vfc3NyX3N0eWxlcyhzdHlsZV9hdHRyaWJ1dGUsIHN0eWxlX2RpcmVjdGl2ZSkge1xuICAgIGNvbnN0IHN0eWxlX29iamVjdCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5kaXZpZHVhbF9zdHlsZSBvZiBzdHlsZV9hdHRyaWJ1dGUuc3BsaXQoJzsnKSkge1xuICAgICAgICBjb25zdCBjb2xvbl9pbmRleCA9IGluZGl2aWR1YWxfc3R5bGUuaW5kZXhPZignOicpO1xuICAgICAgICBjb25zdCBuYW1lID0gaW5kaXZpZHVhbF9zdHlsZS5zbGljZSgwLCBjb2xvbl9pbmRleCkudHJpbSgpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGluZGl2aWR1YWxfc3R5bGUuc2xpY2UoY29sb25faW5kZXggKyAxKS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBzdHlsZV9vYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlX2RpcmVjdGl2ZSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHN0eWxlX2RpcmVjdGl2ZVtuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBzdHlsZV9vYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzdHlsZV9vYmplY3RbbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlX29iamVjdDtcbn1cbmNvbnN0IEFUVFJfUkVHRVggPSAvWyZcIl0vZztcbmNvbnN0IENPTlRFTlRfUkVHRVggPSAvWyY8XS9nO1xuLyoqXG4gKiBOb3RlOiB0aGlzIG1ldGhvZCBpcyBwZXJmb3JtYW5jZSBzZW5zaXRpdmUgYW5kIGhhcyBiZWVuIG9wdGltaXplZFxuICogaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9wdWxsLzU3MDFcbiAqL1xuZnVuY3Rpb24gZXNjYXBlKHZhbHVlLCBpc19hdHRyID0gZmFsc2UpIHtcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcodmFsdWUpO1xuICAgIGNvbnN0IHBhdHRlcm4gPSBpc19hdHRyID8gQVRUUl9SRUdFWCA6IENPTlRFTlRfUkVHRVg7XG4gICAgcGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgIGxldCBlc2NhcGVkID0gJyc7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIHdoaWxlIChwYXR0ZXJuLnRlc3Qoc3RyKSkge1xuICAgICAgICBjb25zdCBpID0gcGF0dGVybi5sYXN0SW5kZXggLSAxO1xuICAgICAgICBjb25zdCBjaCA9IHN0cltpXTtcbiAgICAgICAgZXNjYXBlZCArPSBzdHIuc3Vic3RyaW5nKGxhc3QsIGkpICsgKGNoID09PSAnJicgPyAnJmFtcDsnIDogKGNoID09PSAnXCInID8gJyZxdW90OycgOiAnJmx0OycpKTtcbiAgICAgICAgbGFzdCA9IGkgKyAxO1xuICAgIH1cbiAgICByZXR1cm4gZXNjYXBlZCArIHN0ci5zdWJzdHJpbmcobGFzdCk7XG59XG5mdW5jdGlvbiBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlKSB7XG4gICAgLy8ga2VlcCBib29sZWFucywgbnVsbCwgYW5kIHVuZGVmaW5lZCBmb3IgdGhlIHNha2Ugb2YgYHNwcmVhZGBcbiAgICBjb25zdCBzaG91bGRfZXNjYXBlID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jyk7XG4gICAgcmV0dXJuIHNob3VsZF9lc2NhcGUgPyBlc2NhcGUodmFsdWUsIHRydWUpIDogdmFsdWU7XG59XG5mdW5jdGlvbiBlc2NhcGVfb2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICByZXN1bHRba2V5XSA9IGVzY2FwZV9hdHRyaWJ1dGVfdmFsdWUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlcy4gT3RoZXJ3aXNlIHlvdSBtYXkgbmVlZCB0byBmaXggYSA8JHtuYW1lfT4uYCk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBkZWJ1ZyhmaWxlLCBsaW5lLCBjb2x1bW4sIHZhbHVlcykge1xuICAgIGNvbnNvbGUubG9nKGB7QGRlYnVnfSAke2ZpbGUgPyBmaWxlICsgJyAnIDogJyd9KCR7bGluZX06JHtjb2x1bW59KWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm4gJyc7XG59XG5sZXQgb25fZGVzdHJveTtcbmZ1bmN0aW9uIGNyZWF0ZV9zc3JfY29tcG9uZW50KGZuKSB7XG4gICAgZnVuY3Rpb24gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzLCBjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICAgICAgY29uc3QgJCQgPSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LFxuICAgICAgICAgICAgY29udGV4dDogbmV3IE1hcChjb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgeyAkJHNsb3RzID0ge30sIGNvbnRleHQgPSBuZXcgTWFwKCkgfSA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sICQkc2xvdHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIGNvbnN0IGFzc2lnbm1lbnQgPSAoYm9vbGVhbiAmJiB2YWx1ZSA9PT0gdHJ1ZSkgPyAnJyA6IGA9XCIke2VzY2FwZSh2YWx1ZSwgdHJ1ZSl9XCJgO1xuICAgIHJldHVybiBgICR7bmFtZX0ke2Fzc2lnbm1lbnR9YDtcbn1cbmZ1bmN0aW9uIGFkZF9jbGFzc2VzKGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3NlcyA/IGAgY2xhc3M9XCIke2NsYXNzZXN9XCJgIDogJyc7XG59XG5mdW5jdGlvbiBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlX29iamVjdCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZV9vYmplY3QpXG4gICAgICAgIC5maWx0ZXIoa2V5ID0+IHN0eWxlX29iamVjdFtrZXldKVxuICAgICAgICAubWFwKGtleSA9PiBgJHtrZXl9OiAke2VzY2FwZV9hdHRyaWJ1dGVfdmFsdWUoc3R5bGVfb2JqZWN0W2tleV0pfTtgKVxuICAgICAgICAuam9pbignICcpO1xufVxuZnVuY3Rpb24gYWRkX3N0eWxlcyhzdHlsZV9vYmplY3QpIHtcbiAgICBjb25zdCBzdHlsZXMgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlX29iamVjdCk7XG4gICAgcmV0dXJuIHN0eWxlcyA/IGAgc3R5bGU9XCIke3N0eWxlc31cImAgOiAnJztcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IsIGN1c3RvbUVsZW1lbnQpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBhZnRlcl91cGRhdGUgfSA9IGNvbXBvbmVudC4kJDtcbiAgICBmcmFnbWVudCAmJiBmcmFnbWVudC5tKHRhcmdldCwgYW5jaG9yKTtcbiAgICBpZiAoIWN1c3RvbUVsZW1lbnQpIHtcbiAgICAgICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19vbl9kZXN0cm95ID0gY29tcG9uZW50LiQkLm9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgICAgICAvLyBpZiB0aGUgY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIC8vIGl0IHdpbGwgdXBkYXRlIHRoZSBgJCQub25fZGVzdHJveWAgcmVmZXJlbmNlIHRvIGBudWxsYC5cbiAgICAgICAgICAgIC8vIHRoZSBkZXN0cnVjdHVyZWQgb25fZGVzdHJveSBtYXkgc3RpbGwgcmVmZXJlbmNlIHRvIHRoZSBvbGQgYXJyYXlcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuJCQub25fZGVzdHJveSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGZsdXNoX3JlbmRlcl9jYWxsYmFja3MoJCQuYWZ0ZXJfdXBkYXRlKTtcbiAgICAgICAgcnVuX2FsbCgkJC5vbl9kZXN0cm95KTtcbiAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuZChkZXRhY2hpbmcpO1xuICAgICAgICAvLyBUT0RPIG51bGwgb3V0IG90aGVyIHJlZnMsIGluY2x1ZGluZyBjb21wb25lbnQuJCQgKGJ1dCBuZWVkIHRvXG4gICAgICAgIC8vIHByZXNlcnZlIGZpbmFsIHN0YXRlPylcbiAgICAgICAgJCQub25fZGVzdHJveSA9ICQkLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgICAgJCQuY3R4ID0gW107XG4gICAgfVxufVxuZnVuY3Rpb24gbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpIHtcbiAgICBpZiAoY29tcG9uZW50LiQkLmRpcnR5WzBdID09PSAtMSkge1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgc2NoZWR1bGVfdXBkYXRlKCk7XG4gICAgICAgIGNvbXBvbmVudC4kJC5kaXJ0eS5maWxsKDApO1xuICAgIH1cbiAgICBjb21wb25lbnQuJCQuZGlydHlbKGkgLyAzMSkgfCAwXSB8PSAoMSA8PCAoaSAlIDMxKSk7XG59XG5mdW5jdGlvbiBpbml0KGNvbXBvbmVudCwgb3B0aW9ucywgaW5zdGFuY2UsIGNyZWF0ZV9mcmFnbWVudCwgbm90X2VxdWFsLCBwcm9wcywgYXBwZW5kX3N0eWxlcywgZGlydHkgPSBbLTFdKSB7XG4gICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBbXSxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBvbl9kaXNjb25uZWN0OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZSxcbiAgICAgICAgcm9vdDogb3B0aW9ucy50YXJnZXQgfHwgcGFyZW50X2NvbXBvbmVudC4kJC5yb290XG4gICAgfTtcbiAgICBhcHBlbmRfc3R5bGVzICYmIGFwcGVuZF9zdHlsZXMoJCQucm9vdCk7XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBzdGFydF9oeWRyYXRpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnRybylcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcbiAgICAgICAgbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucy50YXJnZXQsIG9wdGlvbnMuYW5jaG9yLCBvcHRpb25zLmN1c3RvbUVsZW1lbnQpO1xuICAgICAgICBlbmRfaHlkcmF0aW5nKCk7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9uX21vdW50IH0gPSB0aGlzLiQkO1xuICAgICAgICAgICAgdGhpcy4kJC5vbl9kaXNjb25uZWN0ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBydW5fYWxsKHRoaXMuJCQub25fZGlzY29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgaWYgKCFpc19mdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgkJHByb3BzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkoJCRwcm9wcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuJCRzZXQoJCRwcm9wcyk7XG4gICAgICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBTdmVsdGUgY29tcG9uZW50cy4gVXNlZCB3aGVuIGRldj1mYWxzZS5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgIH1cbiAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFpc19mdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoJCRwcm9wcykge1xuICAgICAgICBpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkoJCRwcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLiQkc2V0KCQkcHJvcHMpO1xuICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudCh0eXBlLCBPYmplY3QuYXNzaWduKHsgdmVyc2lvbjogJzMuNTkuMicgfSwgZGV0YWlsKSwgeyBidWJibGVzOiB0cnVlIH0pKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9kZXYodGFyZ2V0LCBub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbl9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0X2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUsIGFuY2hvcik7XG59XG5mdW5jdGlvbiBkZXRhY2hfZGV2KG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZScsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uLCBoYXNfc3RvcF9pbW1lZGlhdGVfcHJvcGFnYXRpb24pIHtcbiAgICBjb25zdCBtb2RpZmllcnMgPSBvcHRpb25zID09PSB0cnVlID8gWydjYXB0dXJlJ10gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgaWYgKGhhc19zdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbilcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbicpO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lcicsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcbiAgICBjb25zdCBkaXNwb3NlID0gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NUmVtb3ZlQXR0cmlidXRlJywgeyBub2RlLCBhdHRyaWJ1dGUgfSk7XG4gICAgZWxzZVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldEF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlLCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHByb3BfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRQcm9wZXJ0eScsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0RGF0YXNldCcsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfZGV2KHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2NvbnRlbnRlZGl0YWJsZV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXREYXRhJywgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9tYXliZV9jb250ZW50ZWRpdGFibGVfZGV2KHRleHQsIGRhdGEsIGF0dHJfdmFsdWUpIHtcbiAgICBpZiAofmNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLmluZGV4T2YoYXR0cl92YWx1ZSkpIHtcbiAgICAgICAgc2V0X2RhdGFfY29udGVudGVkaXRhYmxlX2Rldih0ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKTtcbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50KGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJyAmJiAhKGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBhcmcpKSB7XG4gICAgICAgIGxldCBtc2cgPSAneyNlYWNofSBvbmx5IGl0ZXJhdGVzIG92ZXIgYXJyYXktbGlrZSBvYmplY3RzLic7XG4gICAgICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIGFyZyAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gYXJnKSB7XG4gICAgICAgICAgICBtc2cgKz0gJyBZb3UgY2FuIHVzZSBhIHNwcmVhZCB0byBjb252ZXJ0IHRoaXMgaXRlcmFibGUgaW50byBhbiBhcnJheS4nO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3Nsb3RzKG5hbWUsIHNsb3QsIGtleXMpIHtcbiAgICBmb3IgKGNvbnN0IHNsb3Rfa2V5IG9mIE9iamVjdC5rZXlzKHNsb3QpKSB7XG4gICAgICAgIGlmICghfmtleXMuaW5kZXhPZihzbG90X2tleSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgPCR7bmFtZX0+IHJlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgc2xvdCBcIiR7c2xvdF9rZXl9XCIuYCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQodGFnKSB7XG4gICAgY29uc3QgaXNfc3RyaW5nID0gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZyc7XG4gICAgaWYgKHRhZyAmJiAhaXNfc3RyaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignPHN2ZWx0ZTplbGVtZW50PiBleHBlY3RzIFwidGhpc1wiIGF0dHJpYnV0ZSB0byBiZSBhIHN0cmluZy4nKTtcbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV92b2lkX2R5bmFtaWNfZWxlbWVudCh0YWcpIHtcbiAgICBpZiAodGFnICYmIGlzX3ZvaWQodGFnKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYDxzdmVsdGU6ZWxlbWVudCB0aGlzPVwiJHt0YWd9XCI+IGlzIHNlbGYtY2xvc2luZyBhbmQgY2Fubm90IGhhdmUgY29udGVudC5gKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjb25zdHJ1Y3Rfc3ZlbHRlX2NvbXBvbmVudF9kZXYoY29tcG9uZW50LCBwcm9wcykge1xuICAgIGNvbnN0IGVycm9yX21lc3NhZ2UgPSAndGhpcz17Li4ufSBvZiA8c3ZlbHRlOmNvbXBvbmVudD4gc2hvdWxkIHNwZWNpZnkgYSBTdmVsdGUgY29tcG9uZW50Lic7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgY29tcG9uZW50KHByb3BzKTtcbiAgICAgICAgaWYgKCFpbnN0YW5jZS4kJCB8fCAhaW5zdGFuY2UuJHNldCB8fCAhaW5zdGFuY2UuJG9uIHx8ICFpbnN0YW5jZS4kZGVzdHJveSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yX21lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVycjtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyAmJiBtZXNzYWdlLmluZGV4T2YoJ2lzIG5vdCBhIGNvbnN0cnVjdG9yJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzIHdpdGggc29tZSBtaW5vciBkZXYtZW5oYW5jZW1lbnRzLiBVc2VkIHdoZW4gZGV2PXRydWUuXG4gKi9cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIid0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgICRkZXN0cm95KCkge1xuICAgICAgICBzdXBlci4kZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9O1xuICAgIH1cbiAgICAkY2FwdHVyZV9zdGF0ZSgpIHsgfVxuICAgICRpbmplY3Rfc3RhdGUoKSB7IH1cbn1cbi8qKlxuICogQmFzZSBjbGFzcyB0byBjcmVhdGUgc3Ryb25nbHkgdHlwZWQgU3ZlbHRlIGNvbXBvbmVudHMuXG4gKiBUaGlzIG9ubHkgZXhpc3RzIGZvciB0eXBpbmcgcHVycG9zZXMgYW5kIHNob3VsZCBiZSB1c2VkIGluIGAuZC50c2AgZmlsZXMuXG4gKlxuICogIyMjIEV4YW1wbGU6XG4gKlxuICogWW91IGhhdmUgY29tcG9uZW50IGxpYnJhcnkgb24gbnBtIGNhbGxlZCBgY29tcG9uZW50LWxpYnJhcnlgLCBmcm9tIHdoaWNoXG4gKiB5b3UgZXhwb3J0IGEgY29tcG9uZW50IGNhbGxlZCBgTXlDb21wb25lbnRgLiBGb3IgU3ZlbHRlK1R5cGVTY3JpcHQgdXNlcnMsXG4gKiB5b3Ugd2FudCB0byBwcm92aWRlIHR5cGluZ3MuIFRoZXJlZm9yZSB5b3UgY3JlYXRlIGEgYGluZGV4LmQudHNgOlxuICogYGBgdHNcbiAqIGltcG9ydCB7IFN2ZWx0ZUNvbXBvbmVudFR5cGVkIH0gZnJvbSBcInN2ZWx0ZVwiO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50VHlwZWQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGBgYFxuICogVHlwaW5nIHRoaXMgbWFrZXMgaXQgcG9zc2libGUgZm9yIElERXMgbGlrZSBWUyBDb2RlIHdpdGggdGhlIFN2ZWx0ZSBleHRlbnNpb25cbiAqIHRvIHByb3ZpZGUgaW50ZWxsaXNlbnNlIGFuZCB0byB1c2UgdGhlIGNvbXBvbmVudCBsaWtlIHRoaXMgaW4gYSBTdmVsdGUgZmlsZVxuICogd2l0aCBUeXBlU2NyaXB0OlxuICogYGBgc3ZlbHRlXG4gKiA8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICogXHRpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gXCJjb21wb25lbnQtbGlicmFyeVwiO1xuICogPC9zY3JpcHQ+XG4gKiA8TXlDb21wb25lbnQgZm9vPXsnYmFyJ30gLz5cbiAqIGBgYFxuICpcbiAqICMjIyMgV2h5IG5vdCBtYWtlIHRoaXMgcGFydCBvZiBgU3ZlbHRlQ29tcG9uZW50KERldilgP1xuICogQmVjYXVzZVxuICogYGBgdHNcbiAqIGNsYXNzIEFTdWJjbGFzc09mU3ZlbHRlQ29tcG9uZW50IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50PHtmb286IHN0cmluZ30+IHt9XG4gKiBjb25zdCBjb21wb25lbnQ6IHR5cGVvZiBTdmVsdGVDb21wb25lbnQgPSBBU3ViY2xhc3NPZlN2ZWx0ZUNvbXBvbmVudDtcbiAqIGBgYFxuICogd2lsbCB0aHJvdyBhIHR5cGUgZXJyb3IsIHNvIHdlIG5lZWQgdG8gc2VwYXJhdGUgdGhlIG1vcmUgc3RyaWN0bHkgdHlwZWQgY2xhc3MuXG4gKi9cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudFR5cGVkIGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50RGV2IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxvb3BfZ3VhcmQodGltZW91dCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIGRldGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgeyBIdG1sVGFnLCBIdG1sVGFnSHlkcmF0aW9uLCBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiwgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUNvbXBvbmVudFR5cGVkLCBTdmVsdGVFbGVtZW50LCBhY3Rpb25fZGVzdHJveWVyLCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfaWZyYW1lX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfc3R5bGVzLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldCwgYXBwZW5kX2h5ZHJhdGlvbiwgYXBwZW5kX2h5ZHJhdGlvbl9kZXYsIGFwcGVuZF9zdHlsZXMsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGF0dHJpYnV0ZV90b19vYmplY3QsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21tZW50LCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX2h0bWxfdGFnLCBjbGFpbV9zcGFjZSwgY2xhaW1fc3ZnX2VsZW1lbnQsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21tZW50LCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNvbXB1dGVfc2xvdHMsIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50LCBjb25zdHJ1Y3Rfc3ZlbHRlX2NvbXBvbmVudF9kZXYsIGNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLCBjcmVhdGVFdmVudERpc3BhdGNoZXIsIGNyZWF0ZV9hbmltYXRpb24sIGNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24sIGNyZWF0ZV9jb21wb25lbnQsIGNyZWF0ZV9pbl90cmFuc2l0aW9uLCBjcmVhdGVfb3V0X3RyYW5zaXRpb24sIGNyZWF0ZV9zbG90LCBjcmVhdGVfc3NyX2NvbXBvbmVudCwgY3VycmVudF9jb21wb25lbnQsIGN1c3RvbV9ldmVudCwgZGF0YXNldF9kZXYsIGRlYnVnLCBkZXN0cm95X2Jsb2NrLCBkZXN0cm95X2NvbXBvbmVudCwgZGVzdHJveV9lYWNoLCBkZXRhY2gsIGRldGFjaF9hZnRlcl9kZXYsIGRldGFjaF9iZWZvcmVfZGV2LCBkZXRhY2hfYmV0d2Vlbl9kZXYsIGRldGFjaF9kZXYsIGRpcnR5X2NvbXBvbmVudHMsIGRpc3BhdGNoX2RldiwgZWFjaCwgZWxlbWVudCwgZWxlbWVudF9pcywgZW1wdHksIGVuZF9oeWRyYXRpbmcsIGVzY2FwZSwgZXNjYXBlX2F0dHJpYnV0ZV92YWx1ZSwgZXNjYXBlX29iamVjdCwgZXhjbHVkZV9pbnRlcm5hbF9wcm9wcywgZml4X2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfcG9zaXRpb24sIGZsdXNoLCBmbHVzaF9yZW5kZXJfY2FsbGJhY2tzLCBnZXRBbGxDb250ZXh0cywgZ2V0Q29udGV4dCwgZ2V0X2FsbF9kaXJ0eV9mcm9tX3Njb3BlLCBnZXRfYmluZGluZ19ncm91cF92YWx1ZSwgZ2V0X2N1cnJlbnRfY29tcG9uZW50LCBnZXRfY3VzdG9tX2VsZW1lbnRzX3Nsb3RzLCBnZXRfcm9vdF9mb3Jfc3R5bGUsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNDb250ZXh0LCBoYXNfcHJvcCwgaGVhZF9zZWxlY3RvciwgaWRlbnRpdHksIGluaXQsIGluaXRfYmluZGluZ19ncm91cCwgaW5pdF9iaW5kaW5nX2dyb3VwX2R5bmFtaWMsIGluc2VydCwgaW5zZXJ0X2RldiwgaW5zZXJ0X2h5ZHJhdGlvbiwgaW5zZXJ0X2h5ZHJhdGlvbl9kZXYsIGludHJvcywgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIsIGlzX2NsaWVudCwgaXNfY3Jvc3NvcmlnaW4sIGlzX2VtcHR5LCBpc19mdW5jdGlvbiwgaXNfcHJvbWlzZSwgaXNfdm9pZCwgbGlzdGVuLCBsaXN0ZW5fZGV2LCBsb29wLCBsb29wX2d1YXJkLCBtZXJnZV9zc3Jfc3R5bGVzLCBtaXNzaW5nX2NvbXBvbmVudCwgbW91bnRfY29tcG9uZW50LCBub29wLCBub3RfZXF1YWwsIG5vdywgbnVsbF90b19lbXB0eSwgb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcywgb25EZXN0cm95LCBvbk1vdW50LCBvbmNlLCBvdXRyb19hbmRfZGVzdHJveV9ibG9jaywgcHJldmVudF9kZWZhdWx0LCBwcm9wX2RldiwgcXVlcnlfc2VsZWN0b3JfYWxsLCByYWYsIHJlc2l6ZV9vYnNlcnZlcl9ib3JkZXJfYm94LCByZXNpemVfb2JzZXJ2ZXJfY29udGVudF9ib3gsIHJlc2l6ZV9vYnNlcnZlcl9kZXZpY2VfcGl4ZWxfY29udGVudF9ib3gsIHJ1biwgcnVuX2FsbCwgc2FmZV9ub3RfZXF1YWwsIHNjaGVkdWxlX3VwZGF0ZSwgc2VsZWN0X211bHRpcGxlX3ZhbHVlLCBzZWxlY3Rfb3B0aW9uLCBzZWxlY3Rfb3B0aW9ucywgc2VsZWN0X3ZhbHVlLCBzZWxmLCBzZXRDb250ZXh0LCBzZXRfYXR0cmlidXRlcywgc2V0X2N1cnJlbnRfY29tcG9uZW50LCBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YSwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwLCBzZXRfZGF0YSwgc2V0X2RhdGFfY29udGVudGVkaXRhYmxlLCBzZXRfZGF0YV9jb250ZW50ZWRpdGFibGVfZGV2LCBzZXRfZGF0YV9kZXYsIHNldF9kYXRhX21heWJlX2NvbnRlbnRlZGl0YWJsZSwgc2V0X2RhdGFfbWF5YmVfY29udGVudGVkaXRhYmxlX2Rldiwgc2V0X2R5bmFtaWNfZWxlbWVudF9kYXRhLCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3BsaXRfY3NzX3VuaXQsIHNwcmVhZCwgc3JjX3VybF9lcXVhbCwgc3RhcnRfaHlkcmF0aW5nLCBzdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbiwgc3RvcF9wcm9wYWdhdGlvbiwgc3Vic2NyaWJlLCBzdmdfZWxlbWVudCwgdGV4dCwgdGljaywgdGltZV9yYW5nZXNfdG9fYXJyYXksIHRvX251bWJlciwgdG9nZ2xlX2NsYXNzLCB0cmFuc2l0aW9uX2luLCB0cmFuc2l0aW9uX291dCwgdHJ1c3RlZCwgdXBkYXRlX2F3YWl0X2Jsb2NrX2JyYW5jaCwgdXBkYXRlX2tleWVkX2VhY2gsIHVwZGF0ZV9zbG90LCB1cGRhdGVfc2xvdF9iYXNlLCB2YWxpZGF0ZV9jb21wb25lbnQsIHZhbGlkYXRlX2R5bmFtaWNfZWxlbWVudCwgdmFsaWRhdGVfZWFjaF9hcmd1bWVudCwgdmFsaWRhdGVfZWFjaF9rZXlzLCB2YWxpZGF0ZV9zbG90cywgdmFsaWRhdGVfc3RvcmUsIHZhbGlkYXRlX3ZvaWRfZHluYW1pY19lbGVtZW50LCB4bGlua19hdHRyIH07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG4gIGRlYnVnID0gZmFsc2VcbiAgc2VjdGlvbnM6IFNlY3Rpb25TdGF0ZVtdXG59XG5cbmV4cG9ydCB0eXBlIFNlY3Rpb25TdGF0ZSA9IHtcbiAgbmFtZTogc3RyaW5nXG4gIGNoaWxkcmVuOiBTZWN0aW9uQ2hpbGRbXVxufVxuXG5leHBvcnQgdHlwZSBTZWN0aW9uQ2hpbGQgPSBDbG9ja1N0YXRlIHwgQ291bnRlclN0YXRlIHwgU3RvcHdhdGNoU3RhdGVcblxuZXhwb3J0IHR5cGUgQ2xvY2tTdGF0ZSA9IHtcbiAgdHlwZTogJ2Nsb2NrJ1xuICBuYW1lOiBzdHJpbmdcbiAgc2VnbWVudHM6IG51bWJlclxuICBmaWxsZWQ6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBDb3VudGVyU3RhdGUgPSB7XG4gIHR5cGU6ICdjb3VudGVyJ1xuICBuYW1lOiBzdHJpbmdcbiAgdmFsdWU6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBTdG9wd2F0Y2hTdGF0ZSA9IHtcbiAgdHlwZTogJ3N0b3B3YXRjaCdcbiAgbmFtZTogc3RyaW5nXG4gIHN0YXJ0TWlsbGlzOiBudW1iZXJcbiAgb2Zmc2V0TWlsbGlzOiBudW1iZXJcbiAgc2hvd01pbGxpczogYm9vbGVhblxuICBpc1J1bm5pbmc6IGJvb2xlYW5cbiAgbGFwVGltZXM6IG51bWJlcltdXG59XG4iLCIvKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5jb25zdCBkZWZhdWx0QXR0cmlidXRlcyA9IHtcbiAgICB4bWxuczogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcbiAgICB3aWR0aDogMjQsXG4gICAgaGVpZ2h0OiAyNCxcbiAgICB2aWV3Qm94OiAnMCAwIDI0IDI0JyxcbiAgICBmaWxsOiAnbm9uZScsXG4gICAgc3Ryb2tlOiAnY3VycmVudENvbG9yJyxcbiAgICAnc3Ryb2tlLXdpZHRoJzogMixcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOiAncm91bmQnLFxufTtcbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRBdHRyaWJ1dGVzO1xuIiwiPHNjcmlwdD5pbXBvcnQgZGVmYXVsdEF0dHJpYnV0ZXMgZnJvbSAnLi9kZWZhdWx0QXR0cmlidXRlcyc7XG5leHBvcnQgbGV0IG5hbWU7XG5leHBvcnQgbGV0IGNvbG9yID0gJ2N1cnJlbnRDb2xvcic7XG5leHBvcnQgbGV0IHNpemUgPSAyNDtcbmV4cG9ydCBsZXQgc3Ryb2tlV2lkdGggPSAyO1xuZXhwb3J0IGxldCBhYnNvbHV0ZVN0cm9rZVdpZHRoID0gZmFsc2U7XG5leHBvcnQgbGV0IGljb25Ob2RlO1xuPC9zY3JpcHQ+XG5cbjxzdmdcbiAgey4uLmRlZmF1bHRBdHRyaWJ1dGVzfVxuICB7Li4uJCRyZXN0UHJvcHN9XG4gIHdpZHRoPXtzaXplfVxuICBoZWlnaHQ9e3NpemV9XG4gIHN0cm9rZT17Y29sb3J9XG4gIHN0cm9rZS13aWR0aD17XG4gICAgYWJzb2x1dGVTdHJva2VXaWR0aFxuICAgICAgPyBOdW1iZXIoc3Ryb2tlV2lkdGgpICogMjQgLyBOdW1iZXIoc2l6ZSlcbiAgICAgIDogc3Ryb2tlV2lkdGhcbiAgfVxuICBjbGFzcz17YGx1Y2lkZS1pY29uIGx1Y2lkZSBsdWNpZGUtJHtuYW1lfSAkeyQkcHJvcHMuY2xhc3MgPz8gJyd9YH1cbj5cbiAgeyNlYWNoIGljb25Ob2RlIGFzIFt0YWcsIGF0dHJzXX1cbiAgICA8c3ZlbHRlOmVsZW1lbnQgdGhpcz17dGFnfSB7Li4uYXR0cnN9Lz5cbiAgey9lYWNofVxuICA8c2xvdCAvPlxuPC9zdmc+XG4iLCI8c2NyaXB0Pi8qKlxuICogQGxpY2Vuc2UgbHVjaWRlLXN2ZWx0ZSB2MC4zMzEuMCAtIElTQ1xuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIElTQyBsaWNlbnNlLlxuICogU2VlIHRoZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24uc3ZlbHRlJztcbmNvbnN0IGljb25Ob2RlID0gW1tcInBhdGhcIiwgeyBcImRcIjogXCJNMTkgM0g1XCIgfV0sIFtcInBhdGhcIiwgeyBcImRcIjogXCJNMTIgMjFWN1wiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwibTYgMTUgNiA2IDYtNlwiIH1dXTtcbi8qKlxuICogQGNvbXBvbmVudCBAbmFtZSBBcnJvd0Rvd25Gcm9tTGluZVxuICogQGRlc2NyaXB0aW9uIEx1Y2lkZSBTVkcgaWNvbiBjb21wb25lbnQsIHJlbmRlcnMgU1ZHIEVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cbiAqXG4gKiBAcHJldmlldyAhW2ltZ10oZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWdvZ0lIZHBaSFJvUFNJeU5DSUtJQ0JvWldsbmFIUTlJakkwSWdvZ0lIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSUtJQ0JtYVd4c1BTSnViMjVsSWdvZ0lITjBjbTlyWlQwaUl6QXdNQ0lnYzNSNWJHVTlJbUpoWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tWm1ZN0lHSnZjbVJsY2kxeVlXUnBkWE02SURKd2VDSUtJQ0J6ZEhKdmEyVXRkMmxrZEdnOUlqSWlDaUFnYzNSeWIydGxMV3hwYm1WallYQTlJbkp2ZFc1a0lnb2dJSE4wY205clpTMXNhVzVsYW05cGJqMGljbTkxYm1RaUNqNEtJQ0E4Y0dGMGFDQmtQU0pOTVRrZ00wZzFJaUF2UGdvZ0lEeHdZWFJvSUdROUlrMHhNaUF5TVZZM0lpQXZQZ29nSUR4d1lYUm9JR1E5SW0wMklERTFJRFlnTmlBMkxUWWlJQzgrQ2p3dmMzWm5QZ289KSAtIGh0dHBzOi8vbHVjaWRlLmRldi9pY29ucy9hcnJvdy1kb3duLWZyb20tbGluZVxuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJhcnJvdy1kb3duLWZyb20tbGluZVwiIHsuLi4kJHByb3BzfSBpY29uTm9kZT17aWNvbk5vZGV9PlxuICA8c2xvdC8+XG48L0ljb24+XG4iLCI8c2NyaXB0Pi8qKlxuICogQGxpY2Vuc2UgbHVjaWRlLXN2ZWx0ZSB2MC4zMzEuMCAtIElTQ1xuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIElTQyBsaWNlbnNlLlxuICogU2VlIHRoZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24uc3ZlbHRlJztcbmNvbnN0IGljb25Ob2RlID0gW1tcInBhdGhcIiwgeyBcImRcIjogXCJtMTggOS02LTYtNiA2XCIgfV0sIFtcInBhdGhcIiwgeyBcImRcIjogXCJNMTIgM3YxNFwiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTUgMjFoMTRcIiB9XV07XG4vKipcbiAqIEBjb21wb25lbnQgQG5hbWUgQXJyb3dVcEZyb21MaW5lXG4gKiBAZGVzY3JpcHRpb24gTHVjaWRlIFNWRyBpY29uIGNvbXBvbmVudCwgcmVuZGVycyBTVkcgRWxlbWVudCB3aXRoIGNoaWxkcmVuLlxuICpcbiAqIEBwcmV2aWV3ICFbaW1nXShkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JZ29nSUhkcFpIUm9QU0l5TkNJS0lDQm9aV2xuYUhROUlqSTBJZ29nSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJS0lDQm1hV3hzUFNKdWIyNWxJZ29nSUhOMGNtOXJaVDBpSXpBd01DSWdjM1I1YkdVOUltSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1abVk3SUdKdmNtUmxjaTF5WVdScGRYTTZJREp3ZUNJS0lDQnpkSEp2YTJVdGQybGtkR2c5SWpJaUNpQWdjM1J5YjJ0bExXeHBibVZqWVhBOUluSnZkVzVrSWdvZ0lITjBjbTlyWlMxc2FXNWxhbTlwYmowaWNtOTFibVFpQ2o0S0lDQThjR0YwYUNCa1BTSnRNVGdnT1MwMkxUWXROaUEySWlBdlBnb2dJRHh3WVhSb0lHUTlJazB4TWlBemRqRTBJaUF2UGdvZ0lEeHdZWFJvSUdROUlrMDFJREl4YURFMElpQXZQZ284TDNOMlp6NEspIC0gaHR0cHM6Ly9sdWNpZGUuZGV2L2ljb25zL2Fycm93LXVwLWZyb20tbGluZVxuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJhcnJvdy11cC1mcm9tLWxpbmVcIiB7Li4uJCRwcm9wc30gaWNvbk5vZGU9e2ljb25Ob2RlfT5cbiAgPHNsb3QvPlxuPC9JY29uPlxuIiwiPHNjcmlwdD4vKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uLnN2ZWx0ZSc7XG5jb25zdCBpY29uTm9kZSA9IFtbXCJyZWN0XCIsIHsgXCJ3aWR0aFwiOiBcIjE4XCIsIFwiaGVpZ2h0XCI6IFwiMThcIiwgXCJ4XCI6IFwiM1wiLCBcInlcIjogXCIzXCIsIFwicnhcIjogXCIyXCIgfV0sIFtcInBhdGhcIiwgeyBcImRcIjogXCJNOCAxMmg4XCIgfV1dO1xuLyoqXG4gKiBAY29tcG9uZW50IEBuYW1lIE1pbnVzU3F1YXJlXG4gKiBAZGVzY3JpcHRpb24gTHVjaWRlIFNWRyBpY29uIGNvbXBvbmVudCwgcmVuZGVycyBTVkcgRWxlbWVudCB3aXRoIGNoaWxkcmVuLlxuICpcbiAqIEBwcmV2aWV3ICFbaW1nXShkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JZ29nSUhkcFpIUm9QU0l5TkNJS0lDQm9aV2xuYUhROUlqSTBJZ29nSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJS0lDQm1hV3hzUFNKdWIyNWxJZ29nSUhOMGNtOXJaVDBpSXpBd01DSWdjM1I1YkdVOUltSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1abVk3SUdKdmNtUmxjaTF5WVdScGRYTTZJREp3ZUNJS0lDQnpkSEp2YTJVdGQybGtkR2c5SWpJaUNpQWdjM1J5YjJ0bExXeHBibVZqWVhBOUluSnZkVzVrSWdvZ0lITjBjbTlyWlMxc2FXNWxhbTlwYmowaWNtOTFibVFpQ2o0S0lDQThjbVZqZENCM2FXUjBhRDBpTVRnaUlHaGxhV2RvZEQwaU1UZ2lJSGc5SWpNaUlIazlJak1pSUhKNFBTSXlJaUF2UGdvZ0lEeHdZWFJvSUdROUlrMDRJREV5YURnaUlDOCtDand2YzNablBnbz0pIC0gaHR0cHM6Ly9sdWNpZGUuZGV2L2ljb25zL21pbnVzLXNxdWFyZVxuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJtaW51cy1zcXVhcmVcIiB7Li4uJCRwcm9wc30gaWNvbk5vZGU9e2ljb25Ob2RlfT5cbiAgPHNsb3QvPlxuPC9JY29uPlxuIiwiPHNjcmlwdD4vKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uLnN2ZWx0ZSc7XG5jb25zdCBpY29uTm9kZSA9IFtbXCJyZWN0XCIsIHsgXCJ3aWR0aFwiOiBcIjRcIiwgXCJoZWlnaHRcIjogXCIxNlwiLCBcInhcIjogXCI2XCIsIFwieVwiOiBcIjRcIiB9XSwgW1wicmVjdFwiLCB7IFwid2lkdGhcIjogXCI0XCIsIFwiaGVpZ2h0XCI6IFwiMTZcIiwgXCJ4XCI6IFwiMTRcIiwgXCJ5XCI6IFwiNFwiIH1dXTtcbi8qKlxuICogQGNvbXBvbmVudCBAbmFtZSBQYXVzZVxuICogQGRlc2NyaXB0aW9uIEx1Y2lkZSBTVkcgaWNvbiBjb21wb25lbnQsIHJlbmRlcnMgU1ZHIEVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cbiAqXG4gKiBAcHJldmlldyAhW2ltZ10oZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWdvZ0lIZHBaSFJvUFNJeU5DSUtJQ0JvWldsbmFIUTlJakkwSWdvZ0lIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSUtJQ0JtYVd4c1BTSnViMjVsSWdvZ0lITjBjbTlyWlQwaUl6QXdNQ0lnYzNSNWJHVTlJbUpoWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tWm1ZN0lHSnZjbVJsY2kxeVlXUnBkWE02SURKd2VDSUtJQ0J6ZEhKdmEyVXRkMmxrZEdnOUlqSWlDaUFnYzNSeWIydGxMV3hwYm1WallYQTlJbkp2ZFc1a0lnb2dJSE4wY205clpTMXNhVzVsYW05cGJqMGljbTkxYm1RaUNqNEtJQ0E4Y21WamRDQjNhV1IwYUQwaU5DSWdhR1ZwWjJoMFBTSXhOaUlnZUQwaU5pSWdlVDBpTkNJZ0x6NEtJQ0E4Y21WamRDQjNhV1IwYUQwaU5DSWdhR1ZwWjJoMFBTSXhOaUlnZUQwaU1UUWlJSGs5SWpRaUlDOCtDand2YzNablBnbz0pIC0gaHR0cHM6Ly9sdWNpZGUuZGV2L2ljb25zL3BhdXNlXG4gKiBAc2VlIGh0dHBzOi8vbHVjaWRlLmRldi9ndWlkZS9wYWNrYWdlcy9sdWNpZGUtc3ZlbHRlIC0gRG9jdW1lbnRhdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAtIEx1Y2lkZSBpY29ucyBwcm9wcyBhbmQgYW55IHZhbGlkIFNWRyBhdHRyaWJ1dGVcbiAqIEByZXR1cm5zIHtGdW5jdGlvbmFsQ29tcG9uZW50fSBTdmVsdGUgY29tcG9uZW50XG4gKlxuICovXG48L3NjcmlwdD5cblxuPEljb24gbmFtZT1cInBhdXNlXCIgey4uLiQkcHJvcHN9IGljb25Ob2RlPXtpY29uTm9kZX0+XG4gIDxzbG90Lz5cbjwvSWNvbj5cbiIsIjxzY3JpcHQ+LyoqXG4gKiBAbGljZW5zZSBsdWNpZGUtc3ZlbHRlIHYwLjMzMS4wIC0gSVNDXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgSVNDIGxpY2Vuc2UuXG4gKiBTZWUgdGhlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi5zdmVsdGUnO1xuY29uc3QgaWNvbk5vZGUgPSBbW1wicGF0aFwiLCB7IFwiZFwiOiBcIk0yMS4yMSAxNS44OUExMCAxMCAwIDEgMSA4IDIuODNcIiB9XSwgW1wicGF0aFwiLCB7IFwiZFwiOiBcIk0yMiAxMkExMCAxMCAwIDAgMCAxMiAydjEwelwiIH1dXTtcbi8qKlxuICogQGNvbXBvbmVudCBAbmFtZSBQaWVDaGFydFxuICogQGRlc2NyaXB0aW9uIEx1Y2lkZSBTVkcgaWNvbiBjb21wb25lbnQsIHJlbmRlcnMgU1ZHIEVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cbiAqXG4gKiBAcHJldmlldyAhW2ltZ10oZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWdvZ0lIZHBaSFJvUFNJeU5DSUtJQ0JvWldsbmFIUTlJakkwSWdvZ0lIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSUtJQ0JtYVd4c1BTSnViMjVsSWdvZ0lITjBjbTlyWlQwaUl6QXdNQ0lnYzNSNWJHVTlJbUpoWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tWm1ZN0lHSnZjbVJsY2kxeVlXUnBkWE02SURKd2VDSUtJQ0J6ZEhKdmEyVXRkMmxrZEdnOUlqSWlDaUFnYzNSeWIydGxMV3hwYm1WallYQTlJbkp2ZFc1a0lnb2dJSE4wY205clpTMXNhVzVsYW05cGJqMGljbTkxYm1RaUNqNEtJQ0E4Y0dGMGFDQmtQU0pOTWpFdU1qRWdNVFV1T0RsQk1UQWdNVEFnTUNBeElERWdPQ0F5TGpneklpQXZQZ29nSUR4d1lYUm9JR1E5SWsweU1pQXhNa0V4TUNBeE1DQXdJREFnTUNBeE1pQXlkakV3ZWlJZ0x6NEtQQzl6ZG1jK0NnPT0pIC0gaHR0cHM6Ly9sdWNpZGUuZGV2L2ljb25zL3BpZS1jaGFydFxuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJwaWUtY2hhcnRcIiB7Li4uJCRwcm9wc30gaWNvbk5vZGU9e2ljb25Ob2RlfT5cbiAgPHNsb3QvPlxuPC9JY29uPlxuIiwiPHNjcmlwdD4vKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uLnN2ZWx0ZSc7XG5jb25zdCBpY29uTm9kZSA9IFtbXCJwb2x5Z29uXCIsIHsgXCJwb2ludHNcIjogXCI1IDMgMTkgMTIgNSAyMSA1IDNcIiB9XV07XG4vKipcbiAqIEBjb21wb25lbnQgQG5hbWUgUGxheVxuICogQGRlc2NyaXB0aW9uIEx1Y2lkZSBTVkcgaWNvbiBjb21wb25lbnQsIHJlbmRlcnMgU1ZHIEVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cbiAqXG4gKiBAcHJldmlldyAhW2ltZ10oZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWdvZ0lIZHBaSFJvUFNJeU5DSUtJQ0JvWldsbmFIUTlJakkwSWdvZ0lIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSUtJQ0JtYVd4c1BTSnViMjVsSWdvZ0lITjBjbTlyWlQwaUl6QXdNQ0lnYzNSNWJHVTlJbUpoWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tWm1ZN0lHSnZjbVJsY2kxeVlXUnBkWE02SURKd2VDSUtJQ0J6ZEhKdmEyVXRkMmxrZEdnOUlqSWlDaUFnYzNSeWIydGxMV3hwYm1WallYQTlJbkp2ZFc1a0lnb2dJSE4wY205clpTMXNhVzVsYW05cGJqMGljbTkxYm1RaUNqNEtJQ0E4Y0c5c2VXZHZiaUJ3YjJsdWRITTlJalVnTXlBeE9TQXhNaUExSURJeElEVWdNeUlnTHo0S1BDOXpkbWMrQ2c9PSkgLSBodHRwczovL2x1Y2lkZS5kZXYvaWNvbnMvcGxheVxuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJwbGF5XCIgey4uLiQkcHJvcHN9IGljb25Ob2RlPXtpY29uTm9kZX0+XG4gIDxzbG90Lz5cbjwvSWNvbj5cbiIsIjxzY3JpcHQ+LyoqXG4gKiBAbGljZW5zZSBsdWNpZGUtc3ZlbHRlIHYwLjMzMS4wIC0gSVNDXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgSVNDIGxpY2Vuc2UuXG4gKiBTZWUgdGhlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuaW1wb3J0IEljb24gZnJvbSAnLi4vSWNvbi5zdmVsdGUnO1xuY29uc3QgaWNvbk5vZGUgPSBbW1wicmVjdFwiLCB7IFwid2lkdGhcIjogXCIxOFwiLCBcImhlaWdodFwiOiBcIjE4XCIsIFwieFwiOiBcIjNcIiwgXCJ5XCI6IFwiM1wiLCBcInJ4XCI6IFwiMlwiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTggMTJoOFwiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTEyIDh2OFwiIH1dXTtcbi8qKlxuICogQGNvbXBvbmVudCBAbmFtZSBQbHVzU3F1YXJlXG4gKiBAZGVzY3JpcHRpb24gTHVjaWRlIFNWRyBpY29uIGNvbXBvbmVudCwgcmVuZGVycyBTVkcgRWxlbWVudCB3aXRoIGNoaWxkcmVuLlxuICpcbiAqIEBwcmV2aWV3ICFbaW1nXShkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JZ29nSUhkcFpIUm9QU0l5TkNJS0lDQm9aV2xuYUhROUlqSTBJZ29nSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJS0lDQm1hV3hzUFNKdWIyNWxJZ29nSUhOMGNtOXJaVDBpSXpBd01DSWdjM1I1YkdVOUltSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1abVk3SUdKdmNtUmxjaTF5WVdScGRYTTZJREp3ZUNJS0lDQnpkSEp2YTJVdGQybGtkR2c5SWpJaUNpQWdjM1J5YjJ0bExXeHBibVZqWVhBOUluSnZkVzVrSWdvZ0lITjBjbTlyWlMxc2FXNWxhbTlwYmowaWNtOTFibVFpQ2o0S0lDQThjbVZqZENCM2FXUjBhRDBpTVRnaUlHaGxhV2RvZEQwaU1UZ2lJSGc5SWpNaUlIazlJak1pSUhKNFBTSXlJaUF2UGdvZ0lEeHdZWFJvSUdROUlrMDRJREV5YURnaUlDOCtDaUFnUEhCaGRHZ2daRDBpVFRFeUlEaDJPQ0lnTHo0S1BDOXpkbWMrQ2c9PSkgLSBodHRwczovL2x1Y2lkZS5kZXYvaWNvbnMvcGx1cy1zcXVhcmVcbiAqIEBzZWUgaHR0cHM6Ly9sdWNpZGUuZGV2L2d1aWRlL3BhY2thZ2VzL2x1Y2lkZS1zdmVsdGUgLSBEb2N1bWVudGF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0gTHVjaWRlIGljb25zIHByb3BzIGFuZCBhbnkgdmFsaWQgU1ZHIGF0dHJpYnV0ZVxuICogQHJldHVybnMge0Z1bmN0aW9uYWxDb21wb25lbnR9IFN2ZWx0ZSBjb21wb25lbnRcbiAqXG4gKi9cbjwvc2NyaXB0PlxuXG48SWNvbiBuYW1lPVwicGx1cy1zcXVhcmVcIiB7Li4uJCRwcm9wc30gaWNvbk5vZGU9e2ljb25Ob2RlfT5cbiAgPHNsb3QvPlxuPC9JY29uPlxuIiwiPHNjcmlwdD4vKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uLnN2ZWx0ZSc7XG5jb25zdCBpY29uTm9kZSA9IFtbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTIxIDEyYTkgOSAwIDAgMC05LTkgOS43NSA5Ljc1IDAgMCAwLTYuNzQgMi43NEwzIDhcIiB9XSwgW1wicGF0aFwiLCB7IFwiZFwiOiBcIk0zIDN2NWg1XCIgfV0sIFtcInBhdGhcIiwgeyBcImRcIjogXCJNMyAxMmE5IDkgMCAwIDAgOSA5IDkuNzUgOS43NSAwIDAgMCA2Ljc0LTIuNzRMMjEgMTZcIiB9XSwgW1wicGF0aFwiLCB7IFwiZFwiOiBcIk0xNiAxNmg1djVcIiB9XV07XG4vKipcbiAqIEBjb21wb25lbnQgQG5hbWUgUmVmcmVzaENjd1xuICogQGRlc2NyaXB0aW9uIEx1Y2lkZSBTVkcgaWNvbiBjb21wb25lbnQsIHJlbmRlcnMgU1ZHIEVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cbiAqXG4gKiBAcHJldmlldyAhW2ltZ10oZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWdvZ0lIZHBaSFJvUFNJeU5DSUtJQ0JvWldsbmFIUTlJakkwSWdvZ0lIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSUtJQ0JtYVd4c1BTSnViMjVsSWdvZ0lITjBjbTlyWlQwaUl6QXdNQ0lnYzNSNWJHVTlJbUpoWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tWm1ZN0lHSnZjbVJsY2kxeVlXUnBkWE02SURKd2VDSUtJQ0J6ZEhKdmEyVXRkMmxrZEdnOUlqSWlDaUFnYzNSeWIydGxMV3hwYm1WallYQTlJbkp2ZFc1a0lnb2dJSE4wY205clpTMXNhVzVsYW05cGJqMGljbTkxYm1RaUNqNEtJQ0E4Y0dGMGFDQmtQU0pOTWpFZ01USmhPU0E1SURBZ01DQXdMVGt0T1NBNUxqYzFJRGt1TnpVZ01DQXdJREF0Tmk0M05DQXlMamMwVERNZ09DSWdMejRLSUNBOGNHRjBhQ0JrUFNKTk15QXpkalZvTlNJZ0x6NEtJQ0E4Y0dGMGFDQmtQU0pOTXlBeE1tRTVJRGtnTUNBd0lEQWdPU0E1SURrdU56VWdPUzQzTlNBd0lEQWdNQ0EyTGpjMExUSXVOelJNTWpFZ01UWWlJQzgrQ2lBZ1BIQmhkR2dnWkQwaVRURTJJREUyYURWMk5TSWdMejRLUEM5emRtYytDZz09KSAtIGh0dHBzOi8vbHVjaWRlLmRldi9pY29ucy9yZWZyZXNoLWNjd1xuICogQHNlZSBodHRwczovL2x1Y2lkZS5kZXYvZ3VpZGUvcGFja2FnZXMvbHVjaWRlLXN2ZWx0ZSAtIERvY3VtZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBMdWNpZGUgaWNvbnMgcHJvcHMgYW5kIGFueSB2YWxpZCBTVkcgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7RnVuY3Rpb25hbENvbXBvbmVudH0gU3ZlbHRlIGNvbXBvbmVudFxuICpcbiAqL1xuPC9zY3JpcHQ+XG5cbjxJY29uIG5hbWU9XCJyZWZyZXNoLWNjd1wiIHsuLi4kJHByb3BzfSBpY29uTm9kZT17aWNvbk5vZGV9PlxuICA8c2xvdC8+XG48L0ljb24+XG4iLCI8c2NyaXB0Pi8qKlxuICogQGxpY2Vuc2UgbHVjaWRlLXN2ZWx0ZSB2MC4zMzEuMCAtIElTQ1xuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIElTQyBsaWNlbnNlLlxuICogU2VlIHRoZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbmltcG9ydCBJY29uIGZyb20gJy4uL0ljb24uc3ZlbHRlJztcbmNvbnN0IGljb25Ob2RlID0gW1tcImxpbmVcIiwgeyBcIngxXCI6IFwiMTBcIiwgXCJ4MlwiOiBcIjE0XCIsIFwieTFcIjogXCIyXCIsIFwieTJcIjogXCIyXCIgfV0sIFtcImxpbmVcIiwgeyBcIngxXCI6IFwiMTJcIiwgXCJ4MlwiOiBcIjE1XCIsIFwieTFcIjogXCIxNFwiLCBcInkyXCI6IFwiMTFcIiB9XSwgW1wiY2lyY2xlXCIsIHsgXCJjeFwiOiBcIjEyXCIsIFwiY3lcIjogXCIxNFwiLCBcInJcIjogXCI4XCIgfV1dO1xuLyoqXG4gKiBAY29tcG9uZW50IEBuYW1lIFRpbWVyXG4gKiBAZGVzY3JpcHRpb24gTHVjaWRlIFNWRyBpY29uIGNvbXBvbmVudCwgcmVuZGVycyBTVkcgRWxlbWVudCB3aXRoIGNoaWxkcmVuLlxuICpcbiAqIEBwcmV2aWV3ICFbaW1nXShkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JZ29nSUhkcFpIUm9QU0l5TkNJS0lDQm9aV2xuYUhROUlqSTBJZ29nSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJS0lDQm1hV3hzUFNKdWIyNWxJZ29nSUhOMGNtOXJaVDBpSXpBd01DSWdjM1I1YkdVOUltSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1abVk3SUdKdmNtUmxjaTF5WVdScGRYTTZJREp3ZUNJS0lDQnpkSEp2YTJVdGQybGtkR2c5SWpJaUNpQWdjM1J5YjJ0bExXeHBibVZqWVhBOUluSnZkVzVrSWdvZ0lITjBjbTlyWlMxc2FXNWxhbTlwYmowaWNtOTFibVFpQ2o0S0lDQThiR2x1WlNCNE1UMGlNVEFpSUhneVBTSXhOQ0lnZVRFOUlqSWlJSGt5UFNJeUlpQXZQZ29nSUR4c2FXNWxJSGd4UFNJeE1pSWdlREk5SWpFMUlpQjVNVDBpTVRRaUlIa3lQU0l4TVNJZ0x6NEtJQ0E4WTJseVkyeGxJR040UFNJeE1pSWdZM2s5SWpFMElpQnlQU0k0SWlBdlBnbzhMM04yWno0SykgLSBodHRwczovL2x1Y2lkZS5kZXYvaWNvbnMvdGltZXJcbiAqIEBzZWUgaHR0cHM6Ly9sdWNpZGUuZGV2L2d1aWRlL3BhY2thZ2VzL2x1Y2lkZS1zdmVsdGUgLSBEb2N1bWVudGF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0gTHVjaWRlIGljb25zIHByb3BzIGFuZCBhbnkgdmFsaWQgU1ZHIGF0dHJpYnV0ZVxuICogQHJldHVybnMge0Z1bmN0aW9uYWxDb21wb25lbnR9IFN2ZWx0ZSBjb21wb25lbnRcbiAqXG4gKi9cbjwvc2NyaXB0PlxuXG48SWNvbiBuYW1lPVwidGltZXJcIiB7Li4uJCRwcm9wc30gaWNvbk5vZGU9e2ljb25Ob2RlfT5cbiAgPHNsb3QvPlxuPC9JY29uPlxuIiwiPHNjcmlwdD4vKipcbiAqIEBsaWNlbnNlIGx1Y2lkZS1zdmVsdGUgdjAuMzMxLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uLnN2ZWx0ZSc7XG5jb25zdCBpY29uTm9kZSA9IFtbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTMgNmgxOFwiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiIH1dLCBbXCJwYXRoXCIsIHsgXCJkXCI6IFwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiIH1dLCBbXCJsaW5lXCIsIHsgXCJ4MVwiOiBcIjEwXCIsIFwieDJcIjogXCIxMFwiLCBcInkxXCI6IFwiMTFcIiwgXCJ5MlwiOiBcIjE3XCIgfV0sIFtcImxpbmVcIiwgeyBcIngxXCI6IFwiMTRcIiwgXCJ4MlwiOiBcIjE0XCIsIFwieTFcIjogXCIxMVwiLCBcInkyXCI6IFwiMTdcIiB9XV07XG4vKipcbiAqIEBjb21wb25lbnQgQG5hbWUgVHJhc2gyXG4gKiBAZGVzY3JpcHRpb24gTHVjaWRlIFNWRyBpY29uIGNvbXBvbmVudCwgcmVuZGVycyBTVkcgRWxlbWVudCB3aXRoIGNoaWxkcmVuLlxuICpcbiAqIEBwcmV2aWV3ICFbaW1nXShkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JZ29nSUhkcFpIUm9QU0l5TkNJS0lDQm9aV2xuYUhROUlqSTBJZ29nSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJS0lDQm1hV3hzUFNKdWIyNWxJZ29nSUhOMGNtOXJaVDBpSXpBd01DSWdjM1I1YkdVOUltSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1abVk3SUdKdmNtUmxjaTF5WVdScGRYTTZJREp3ZUNJS0lDQnpkSEp2YTJVdGQybGtkR2c5SWpJaUNpQWdjM1J5YjJ0bExXeHBibVZqWVhBOUluSnZkVzVrSWdvZ0lITjBjbTlyWlMxc2FXNWxhbTlwYmowaWNtOTFibVFpQ2o0S0lDQThjR0YwYUNCa1BTSk5NeUEyYURFNElpQXZQZ29nSUR4d1lYUm9JR1E5SWsweE9TQTJkakUwWXpBZ01TMHhJREl0TWlBeVNEZGpMVEVnTUMweUxURXRNaTB5VmpZaUlDOCtDaUFnUEhCaGRHZ2daRDBpVFRnZ05sWTBZekF0TVNBeExUSWdNaTB5YURSak1TQXdJRElnTVNBeUlESjJNaUlnTHo0S0lDQThiR2x1WlNCNE1UMGlNVEFpSUhneVBTSXhNQ0lnZVRFOUlqRXhJaUI1TWowaU1UY2lJQzgrQ2lBZ1BHeHBibVVnZURFOUlqRTBJaUI0TWowaU1UUWlJSGt4UFNJeE1TSWdlVEk5SWpFM0lpQXZQZ284TDNOMlp6NEspIC0gaHR0cHM6Ly9sdWNpZGUuZGV2L2ljb25zL3RyYXNoLTJcbiAqIEBzZWUgaHR0cHM6Ly9sdWNpZGUuZGV2L2d1aWRlL3BhY2thZ2VzL2x1Y2lkZS1zdmVsdGUgLSBEb2N1bWVudGF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0gTHVjaWRlIGljb25zIHByb3BzIGFuZCBhbnkgdmFsaWQgU1ZHIGF0dHJpYnV0ZVxuICogQHJldHVybnMge0Z1bmN0aW9uYWxDb21wb25lbnR9IFN2ZWx0ZSBjb21wb25lbnRcbiAqXG4gKi9cbjwvc2NyaXB0PlxuXG48SWNvbiBuYW1lPVwidHJhc2gtMlwiIHsuLi4kJHByb3BzfSBpY29uTm9kZT17aWNvbk5vZGV9PlxuICA8c2xvdC8+XG48L0ljb24+XG4iLCJpbXBvcnQgeyBjdWJpY0luT3V0LCBsaW5lYXIsIGN1YmljT3V0IH0gZnJvbSAnLi4vZWFzaW5nL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBzcGxpdF9jc3NfdW5pdCwgaXNfZnVuY3Rpb24sIGFzc2lnbiB9IGZyb20gJy4uL2ludGVybmFsL2luZGV4Lm1qcyc7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XG5cbmZ1bmN0aW9uIGJsdXIobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY0luT3V0LCBhbW91bnQgPSA1LCBvcGFjaXR5ID0gMCB9ID0ge30pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCBmID0gc3R5bGUuZmlsdGVyID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLmZpbHRlcjtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICBjb25zdCBbdmFsdWUsIHVuaXRdID0gc3BsaXRfY3NzX3VuaXQoYW1vdW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9OyBmaWx0ZXI6ICR7Zn0gYmx1cigke3UgKiB2YWx1ZX0ke3VuaXR9KTtgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZhZGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBsaW5lYXIgfSA9IHt9KSB7XG4gICAgY29uc3QgbyA9ICtnZXRDb21wdXRlZFN0eWxlKG5vZGUpLm9wYWNpdHk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3BhY2l0eTogJHt0ICogb31gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZseShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCB4ID0gMCwgeSA9IDAsIG9wYWNpdHkgPSAwIH0gPSB7fSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgY29uc3QgW3hWYWx1ZSwgeFVuaXRdID0gc3BsaXRfY3NzX3VuaXQoeCk7XG4gICAgY29uc3QgW3lWYWx1ZSwgeVVuaXRdID0gc3BsaXRfY3NzX3VuaXQoeSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgkeygxIC0gdCkgKiB4VmFsdWV9JHt4VW5pdH0sICR7KDEgLSB0KSAqIHlWYWx1ZX0ke3lVbml0fSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9YFxuICAgIH07XG59XG5mdW5jdGlvbiBzbGlkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBheGlzID0gJ3knIH0gPSB7fSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgcHJpbWFyeV9wcm9wZXJ0eSA9IGF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICBjb25zdCBwcmltYXJ5X3Byb3BlcnR5X3ZhbHVlID0gcGFyc2VGbG9hdChzdHlsZVtwcmltYXJ5X3Byb3BlcnR5XSk7XG4gICAgY29uc3Qgc2Vjb25kYXJ5X3Byb3BlcnRpZXMgPSBheGlzID09PSAneScgPyBbJ3RvcCcsICdib3R0b20nXSA6IFsnbGVmdCcsICdyaWdodCddO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkX3NlY29uZGFyeV9wcm9wZXJ0aWVzID0gc2Vjb25kYXJ5X3Byb3BlcnRpZXMubWFwKChlKSA9PiBgJHtlWzBdLnRvVXBwZXJDYXNlKCl9JHtlLnNsaWNlKDEpfWApO1xuICAgIGNvbnN0IHBhZGRpbmdfc3RhcnRfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW2BwYWRkaW5nJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1swXX1gXSk7XG4gICAgY29uc3QgcGFkZGluZ19lbmRfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW2BwYWRkaW5nJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1sxXX1gXSk7XG4gICAgY29uc3QgbWFyZ2luX3N0YXJ0X3ZhbHVlID0gcGFyc2VGbG9hdChzdHlsZVtgbWFyZ2luJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1swXX1gXSk7XG4gICAgY29uc3QgbWFyZ2luX2VuZF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYG1hcmdpbiR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19YF0pO1xuICAgIGNvbnN0IGJvcmRlcl93aWR0aF9zdGFydF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYGJvcmRlciR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19V2lkdGhgXSk7XG4gICAgY29uc3QgYm9yZGVyX3dpZHRoX2VuZF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYGJvcmRlciR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19V2lkdGhgXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiAnb3ZlcmZsb3c6IGhpZGRlbjsnICtcbiAgICAgICAgICAgIGBvcGFjaXR5OiAke01hdGgubWluKHQgKiAyMCwgMSkgKiBvcGFjaXR5fTtgICtcbiAgICAgICAgICAgIGAke3ByaW1hcnlfcHJvcGVydHl9OiAke3QgKiBwcmltYXJ5X3Byb3BlcnR5X3ZhbHVlfXB4O2AgK1xuICAgICAgICAgICAgYHBhZGRpbmctJHtzZWNvbmRhcnlfcHJvcGVydGllc1swXX06ICR7dCAqIHBhZGRpbmdfc3RhcnRfdmFsdWV9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzFdfTogJHt0ICogcGFkZGluZ19lbmRfdmFsdWV9cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLSR7c2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19OiAke3QgKiBtYXJnaW5fc3RhcnRfdmFsdWV9cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLSR7c2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19OiAke3QgKiBtYXJnaW5fZW5kX3ZhbHVlfXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfS13aWR0aDogJHt0ICogYm9yZGVyX3dpZHRoX3N0YXJ0X3ZhbHVlfXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzFdfS13aWR0aDogJHt0ICogYm9yZGVyX3dpZHRoX2VuZF92YWx1ZX1weDtgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNjYWxlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQsIHN0YXJ0ID0gMCwgb3BhY2l0eSA9IDAgfSA9IHt9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICBjb25zdCBzZCA9IDEgLSBzdGFydDtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHNjYWxlKCR7MSAtIChzZCAqIHUpfSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9XG5cdFx0YFxuICAgIH07XG59XG5mdW5jdGlvbiBkcmF3KG5vZGUsIHsgZGVsYXkgPSAwLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZyA9IGN1YmljSW5PdXQgfSA9IHt9KSB7XG4gICAgbGV0IGxlbiA9IG5vZGUuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnN0cm9rZUxpbmVjYXAgIT09ICdidXR0Jykge1xuICAgICAgICBsZW4gKz0gcGFyc2VJbnQoc3R5bGUuc3Ryb2tlV2lkdGgpO1xuICAgIH1cbiAgICBpZiAoZHVyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoc3BlZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSA4MDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IGxlbiAvIHNwZWVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uKGxlbik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfLCB1KSA9PiBgXG5cdFx0XHRzdHJva2UtZGFzaGFycmF5OiAke2xlbn07XG5cdFx0XHRzdHJva2UtZGFzaG9mZnNldDogJHt1ICogbGVufTtcblx0XHRgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyb3NzZmFkZShfYSkge1xuICAgIHZhciB7IGZhbGxiYWNrIH0gPSBfYSwgZGVmYXVsdHMgPSBfX3Jlc3QoX2EsIFtcImZhbGxiYWNrXCJdKTtcbiAgICBjb25zdCB0b19yZWNlaXZlID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHRvX3NlbmQgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gY3Jvc3NmYWRlKGZyb21fbm9kZSwgbm9kZSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IGQgPT4gTWF0aC5zcXJ0KGQpICogMzAsIGVhc2luZyA9IGN1YmljT3V0IH0gPSBhc3NpZ24oYXNzaWduKHt9LCBkZWZhdWx0cyksIHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IGZyb20gPSBmcm9tX25vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgZHggPSBmcm9tLmxlZnQgLSB0by5sZWZ0O1xuICAgICAgICBjb25zdCBkeSA9IGZyb20udG9wIC0gdG8udG9wO1xuICAgICAgICBjb25zdCBkdyA9IGZyb20ud2lkdGggLyB0by53aWR0aDtcbiAgICAgICAgY29uc3QgZGggPSBmcm9tLmhlaWdodCAvIHRvLmhlaWdodDtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgY29uc3Qgb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVsYXksXG4gICAgICAgICAgICBkdXJhdGlvbjogaXNfZnVuY3Rpb24oZHVyYXRpb24pID8gZHVyYXRpb24oZCkgOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGVhc2luZyxcbiAgICAgICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdFx0b3BhY2l0eTogJHt0ICogb3BhY2l0eX07XG5cdFx0XHRcdHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xuXHRcdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHt1ICogZHh9cHgsJHt1ICogZHl9cHgpIHNjYWxlKCR7dCArICgxIC0gdCkgKiBkd30sICR7dCArICgxIC0gdCkgKiBkaH0pO1xuXHRcdFx0YFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uKGl0ZW1zLCBjb3VudGVycGFydHMsIGludHJvKSB7XG4gICAgICAgIHJldHVybiAobm9kZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpdGVtcy5zZXQocGFyYW1zLmtleSwgbm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVycGFydHMuaGFzKHBhcmFtcy5rZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyX25vZGUgPSBjb3VudGVycGFydHMuZ2V0KHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVycGFydHMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3NmYWRlKG90aGVyX25vZGUsIG5vZGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBub2RlIGlzIGRpc2FwcGVhcmluZyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgLy8gKGkuZS4gd2Fzbid0IGNsYWltZWQgYnkgdGhlIG90aGVyIGxpc3QpXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBuZWVkIHRvIHN1cHBseSBhbiBvdXRyb1xuICAgICAgICAgICAgICAgIGl0ZW1zLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsbGJhY2sgJiYgZmFsbGJhY2sobm9kZSwgcGFyYW1zLCBpbnRybyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgICB0cmFuc2l0aW9uKHRvX3NlbmQsIHRvX3JlY2VpdmUsIGZhbHNlKSxcbiAgICAgICAgdHJhbnNpdGlvbih0b19yZWNlaXZlLCB0b19zZW5kLCB0cnVlKVxuICAgIF07XG59XG5cbmV4cG9ydCB7IGJsdXIsIGNyb3NzZmFkZSwgZHJhdywgZmFkZSwgZmx5LCBzY2FsZSwgc2xpZGUgfTtcbiIsIi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIGtleWJvYXJkIGFjdGlvbiBjb3VudHMgYXMgXCJjbGljayBlcXVpdmFsZW50XCJcbiAqIChpLmUuIHNob3VsZCBiZSBwcm9jZXNzZWQgYXMgYSBcImNsaWNrXCIgd2hlbiBhbiBlbGVtZW50IGlzIGluIGZvY3VzKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlmQ2xpY2tFcXVpdmFsZW50KGZuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICByZXR1cm4gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoWydFbnRlcicsICcgJ10uY29udGFpbnMoZS5rZXkpKSB7XG4gICAgICBmbihlKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICB9XG59XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiIGNvbnRleHQ9XCJtb2R1bGVcIj5cbmV4cG9ydCBlbnVtIEVkaXRNb2RlIHtcbiAgUmVhZCxcbiAgRWRpdFxufVxuXG48L3NjcmlwdD5cblxuPHNjcmlwdCBsYW5nPVwidHNcIj5cbmltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgdGljayB9IGZyb20gJ3N2ZWx0ZSdcbmltcG9ydCB7IGlmQ2xpY2tFcXVpdmFsZW50IH0gZnJvbSAnLi91dGlsJ1xuXG5jb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXG5cbmV4cG9ydCBsZXQgdmFsdWU6IHN0cmluZyA9ICcnXG5sZXQgbmV3VmFsdWUgPSB2YWx1ZVxubGV0IGZvY3VzVGFyZ2V0OiBIVE1MRWxlbWVudFxuXG5leHBvcnQgbGV0IG1vZGUgPSBFZGl0TW9kZS5SZWFkXG4kOiBkaXNwYXRjaCgnbW9kZUNoYW5nZWQnLCB7IG1vZGUgfSlcblxuZnVuY3Rpb24gc3RhcnRFZGl0aW5nKCkge1xuICBtb2RlID0gRWRpdE1vZGUuRWRpdFxufVxuXG5mdW5jdGlvbiB0YWtlRm9jdXMoZWw6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgZWwuZm9jdXMoKVxuICBlbC5zZWxlY3QoKVxufVxuXG5mdW5jdGlvbiBvbktleURvd24oZTogS2V5Ym9hcmRFdmVudCkge1xuICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICB2YWx1ZSA9IG5ld1ZhbHVlID0gbmV3VmFsdWUudHJpbSgpXG4gICAgbW9kZSA9IEVkaXRNb2RlLlJlYWRcbiAgICBkaXNwYXRjaCgnY29uZmlybWVkJywgeyB2YWx1ZSB9KVxuICB9IGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgIG5ld1ZhbHVlID0gdmFsdWVcbiAgICBtb2RlID0gRWRpdE1vZGUuUmVhZFxuICAgIGRpc3BhdGNoKCdjYW5jZWxsZWQnLCB7IHZhbHVlIH0pXG4gIH1cblxuICB0aWNrKCkudGhlbigoKSA9PiBmb2N1c1RhcmdldD8uZm9jdXMoKSlcbn1cbjwvc2NyaXB0PlxuXG57I2lmIG1vZGUgPT09IEVkaXRNb2RlLlJlYWR9XG4gIDxzcGFuXG4gICAgcm9sZT1cImJ1dHRvblwiXG4gICAgdGFiaW5kZXg9XCIwXCJcbiAgICBiaW5kOnRoaXM9e2ZvY3VzVGFyZ2V0fVxuICAgIG9uOmNsaWNrPXtzdGFydEVkaXRpbmd9XG4gICAgb246a2V5ZG93bj17aWZDbGlja0VxdWl2YWxlbnQoc3RhcnRFZGl0aW5nKX0+XG4gICAgeyNpZiB2YWx1ZSA9PSAnJ30mbmJzcDt7L2lmfVxuICAgIHt2YWx1ZX1cbiAgPC9zcGFuPlxuezplbHNlfVxuICA8aW5wdXQgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtuZXdWYWx1ZX0gdXNlOnRha2VGb2N1cyBvbjprZXlkb3duPXtvbktleURvd259IC8+XG57L2lmfVxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIiBjb250ZXh0PVwibW9kdWxlXCI+XG5leHBvcnQgZW51bSBFZGl0TW9kZSB7XG4gIFJlYWQsXG4gIEVkaXRcbn1cbjwvc2NyaXB0PlxuXG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCB0aWNrIH0gZnJvbSAnc3ZlbHRlJ1xuXG5jb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXG5cbmV4cG9ydCBsZXQgdmFsdWU6IG51bWJlciA9IDBcbmxldCBuZXdWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKClcbmxldCBmb2N1c1RhcmdldDogSFRNTEVsZW1lbnRcblxuZXhwb3J0IGxldCBtb2RlOiBFZGl0TW9kZSA9IEVkaXRNb2RlLlJlYWRcbiQ6IGRpc3BhdGNoKCdtb2RlQ2hhbmdlZCcsIHsgbW9kZSB9KVxuXG5mdW5jdGlvbiBzdGFydEVkaXRpbmcoKSB7XG4gIGlmICghbmV3VmFsdWUuc3RhcnRzV2l0aCgnKycpICYmICFuZXdWYWx1ZS5zdGFydHNXaXRoKCctJykpIHtcbiAgICBuZXdWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKClcbiAgfVxuXG4gIG1vZGUgPSBFZGl0TW9kZS5FZGl0XG59XG5cbmZ1bmN0aW9uIHRha2VGb2N1cyhlbDogSFRNTElucHV0RWxlbWVudCkge1xuICBlbC5mb2N1cygpXG4gIGVsLnNlbGVjdCgpXG59XG5cbmZ1bmN0aW9uIG9uRWRpdEtleURvd24oZTogS2V5Ym9hcmRFdmVudCkge1xuICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICBuZXdWYWx1ZSA9IG5ld1ZhbHVlLnRyaW0oKVxuXG4gICAgaWYgKG5ld1ZhbHVlLnN0YXJ0c1dpdGgoJysnKSB8fCBuZXdWYWx1ZS5zdGFydHNXaXRoKCctJykpIHtcbiAgICAgIC8vIFRPRE86IFN1cHBvcnQgc2ltcGxlIG1hdGgsIG5vdCBqdXN0IGxlYWRpbmcgKy8tXG4gICAgICB2YWx1ZSArPSBOdW1iZXIobmV3VmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gTnVtYmVyKG5ld1ZhbHVlKVxuICAgIH1cblxuICAgIG1vZGUgPSBFZGl0TW9kZS5SZWFkXG4gICAgZGlzcGF0Y2goJ2NvbmZpcm1lZCcsIHsgdmFsdWUgfSlcbiAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICBtb2RlID0gRWRpdE1vZGUuUmVhZFxuICAgIGRpc3BhdGNoKCdjYW5jZWxsZWQnLCB7IHZhbHVlIH0pXG4gIH1cblxuICB0aWNrKCkudGhlbigoKSA9PiBmb2N1c1RhcmdldD8uZm9jdXMoKSlcbn1cblxuZnVuY3Rpb24gb25TcGFuS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KSB7XG4gIGlmIChbJ0VudGVyJywgJyAnXS5jb250YWlucyhlLmtleSkpIHtcbiAgICBzdGFydEVkaXRpbmcoKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9IGVsc2UgaWYgKFsnQXJyb3dVcCcsICdBcnJvd1JpZ2h0J10uY29udGFpbnMoZS5rZXkpKSB7XG4gICAgdmFsdWUgKz0gMVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9IGVsc2UgaWYgKFsnQXJyb3dEb3duJywgJ0Fycm93TGVmdCddLmNvbnRhaW5zKGUua2V5KSkge1xuICAgIHZhbHVlIC09IDFcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbnsjaWYgbW9kZSA9PT0gRWRpdE1vZGUuUmVhZH1cbiAgPHNwYW5cbiAgICByb2xlPVwiYnV0dG9uXCJcbiAgICB0YWJpbmRleD1cIjBcIlxuICAgIGJpbmQ6dGhpcz17Zm9jdXNUYXJnZXR9XG4gICAgb246Y2xpY2t8cHJldmVudERlZmF1bHQ9e3N0YXJ0RWRpdGluZ31cbiAgICBvbjprZXlkb3duPXtvblNwYW5LZXlEb3dufT5cbiAgICB7dmFsdWV9XG4gIDwvc3Bhbj5cbns6ZWxzZX1cbiAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17bmV3VmFsdWV9IHVzZTp0YWtlRm9jdXMgb246a2V5ZG93bj17b25FZGl0S2V5RG93bn0gLz5cbnsvaWZ9XG4iLCI8c2NyaXB0IHR5cGU9XCJ0c1wiPlxuaW1wb3J0IHsgQXJyb3dVcEZyb21MaW5lLCBBcnJvd0Rvd25Gcm9tTGluZSwgTWludXNTcXVhcmUsIFBsdXNTcXVhcmUgfSBmcm9tICdsdWNpZGUtc3ZlbHRlJ1xuaW1wb3J0IHsgaWZDbGlja0VxdWl2YWxlbnQgfSBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBsZXQgc2VnbWVudHM6IG51bWJlciA9IDRcbmV4cG9ydCBsZXQgZmlsbGVkOiBudW1iZXIgPSAwXG5cbiQ6IGZpbGxDaXJjbGUgPSBzZWdtZW50cyA8PSAxID8gZmlsbGVkID49IDEgOiBudWxsXG4kOiBzZWdtZW50cyA9IE1hdGgubWF4KDEsIHNlZ21lbnRzKVxuJDogZmlsbGVkID0gZmlsbGVkIDwgMCA/IHNlZ21lbnRzIDogZmlsbGVkXG4kOiBmaWxsZWQgPSBmaWxsZWQgPiBzZWdtZW50cyA/IDAgOiBmaWxsZWRcblxuY29uc3QgcmFkaXVzID0gNTBcbmNvbnN0IHBhZGRpbmcgPSA0XG5cbmZ1bmN0aW9uIHNsaWNlcyhzZWdtZW50czogbnVtYmVyLCBmaWxsZWQ6IG51bWJlcikge1xuICBjb25zdCBzcyA9IFtdXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWdtZW50czsgKytpKSB7XG4gICAgY29uc3QgeDEgPSByYWRpdXMgKiBNYXRoLnNpbigoMiAqIE1hdGguUEkgKiBpKSAvIHNlZ21lbnRzKSArIHJhZGl1cyArIHBhZGRpbmdcbiAgICBjb25zdCB4MiA9IHJhZGl1cyAqIE1hdGguc2luKCgyICogTWF0aC5QSSAqIChpICsgMSkpIC8gc2VnbWVudHMpICsgcmFkaXVzICsgcGFkZGluZ1xuXG4gICAgY29uc3QgeTEgPSAtcmFkaXVzICogTWF0aC5jb3MoKDIgKiBNYXRoLlBJICogaSkgLyBzZWdtZW50cykgKyByYWRpdXMgKyBwYWRkaW5nXG4gICAgY29uc3QgeTIgPSAtcmFkaXVzICogTWF0aC5jb3MoKDIgKiBNYXRoLlBJICogKGkgKyAxKSkgLyBzZWdtZW50cykgKyByYWRpdXMgKyBwYWRkaW5nXG5cbiAgICBzcy5wdXNoKHtcbiAgICAgIHgxLFxuICAgICAgeDIsXG4gICAgICB5MSxcbiAgICAgIHkyLFxuICAgICAgaXNGaWxsZWQ6IGkgPCBmaWxsZWRcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHNzXG59XG5cbmZ1bmN0aW9uIGhhbmRsZUluY3JlbWVudChlOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICBpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgIHNlZ21lbnRzICs9IDFcbiAgfSBlbHNlIHtcbiAgICBmaWxsZWQgKz0gMVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURlY3JlbWVudChlOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICBpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgIHNlZ21lbnRzIC09IDFcbiAgICBmaWxsZWQgPSBNYXRoLm1pbihzZWdtZW50cywgZmlsbGVkKVxuICB9IGVsc2Uge1xuICAgIGZpbGxlZCAtPSAxXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xvY2tLZXlJbnRlcmFjdGlvbihlOiBLZXlib2FyZEV2ZW50KSB7XG4gIGlmIChbJ0VudGVyJywgJyAnLCAnQXJyb3dVcCcsICdBcnJvd1JpZ2h0J10uY29udGFpbnMoZS5rZXkpKSB7XG4gICAgaWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIHNlZ21lbnRzICs9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsbGVkICs9IDFcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfSBlbHNlIGlmIChbJ0Fycm93RG93bicsICdBcnJvd0xlZnQnXS5jb250YWlucyhlLmtleSkpIHtcbiAgICBpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgc2VnbWVudHMgLT0gMVxuICAgICAgZmlsbGVkID0gTWF0aC5taW4oc2VnbWVudHMsIGZpbGxlZClcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsbGVkIC09IDFcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3MtY2xvY2tcIj5cbiAgPHN2Z1xuICAgIGRhdGEtc2VnbWVudHM9e3NlZ21lbnRzfVxuICAgIGRhdGEtZmlsbGVkPXtmaWxsZWR9XG4gICAgcm9sZT1cImJ1dHRvblwiXG4gICAgdGFiaW5kZXg9XCIwXCJcbiAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICB2aWV3Qm94PVwiMCAwIHsyICogcmFkaXVzICsgMiAqIHBhZGRpbmd9IHsyICogcmFkaXVzICsgMiAqIHBhZGRpbmd9XCJcbiAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17aGFuZGxlSW5jcmVtZW50fVxuICAgIG9uOmNvbnRleHRtZW51fHByZXZlbnREZWZhdWx0PXtoYW5kbGVEZWNyZW1lbnR9XG4gICAgb246a2V5ZG93bj17aGFuZGxlQ2xvY2tLZXlJbnRlcmFjdGlvbn0+XG4gICAgeyNpZiBzZWdtZW50cyA+IDF9XG4gICAgICB7I2VhY2ggc2xpY2VzKHNlZ21lbnRzLCBmaWxsZWQpIGFzIHsgeDEsIHgyLCB5MSwgeTIsIGlzRmlsbGVkIH0sIGl9XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZGF0YS1zZWdtZW50PXtpfVxuICAgICAgICAgIGRhdGEtZmlsbGVkPXtpc0ZpbGxlZH1cbiAgICAgICAgICBkPVwiXG4gICAgICAgIE0ge3JhZGl1cyArIHBhZGRpbmd9IHtyYWRpdXMgKyBwYWRkaW5nfVxuICAgICAgICBMIHt4MX0ge3kxfVxuICAgICAgICBBIHtyYWRpdXN9IHtyYWRpdXN9IDAgMCAxIHt4Mn0ge3kyfVxuICAgICAgICBaXCIgLz5cbiAgICAgIHsvZWFjaH1cbiAgICB7L2lmfVxuICAgIDxjaXJjbGUgY3g9e3JhZGl1cyArIHBhZGRpbmd9IGN5PXtyYWRpdXMgKyBwYWRkaW5nfSByPXtyYWRpdXN9IGRhdGEtZmlsbGVkPXtmaWxsQ2lyY2xlfSAvPlxuICA8L3N2Zz5cbiAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1jbG9ja19fYnV0dG9uc1wiPlxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLWNsb2NrX19kZWNyZW1lbnRcIlxuICAgICAgdGl0bGU9XCJVbmZpbGwgb25lIHNlZ21lbnRcIlxuICAgICAgb246Y2xpY2t8cHJldmVudERlZmF1bHQ9e2hhbmRsZURlY3JlbWVudH1cbiAgICAgIG9uOmtleWRvd249e2lmQ2xpY2tFcXVpdmFsZW50KGhhbmRsZURlY3JlbWVudCl9PlxuICAgICAgPE1pbnVzU3F1YXJlIC8+XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3MtY2xvY2tfX2luY3JlbWVudFwiXG4gICAgICB0aXRsZT1cIkZpbGwgb25lIHNlZ21lbnRcIlxuICAgICAgb246Y2xpY2t8cHJldmVudERlZmF1bHQ9e2hhbmRsZUluY3JlbWVudH1cbiAgICAgIG9uOmtleWRvd249e2lmQ2xpY2tFcXVpdmFsZW50KGhhbmRsZUluY3JlbWVudCl9PlxuICAgICAgPFBsdXNTcXVhcmUgLz5cbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1jbG9ja19fZGVjcmVtZW50LXNlZ21lbnRzXCJcbiAgICAgIHRpdGxlPVwiUmVtb3ZlIG9uZSBzZWdtZW50XCJcbiAgICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0PXsoKSA9PiAoc2VnbWVudHMgLT0gMSl9XG4gICAgICBvbjprZXlkb3duPXtpZkNsaWNrRXF1aXZhbGVudCgoKSA9PiAoc2VnbWVudHMgLT0gMSkpfT5cbiAgICAgIDxBcnJvd0Rvd25Gcm9tTGluZSAvPlxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLWNsb2NrX19pbmNyZW1lbnQtc2VnbWVudHNcIlxuICAgICAgdGl0bGU9XCJBZGQgYW5vdGhlciBzZWdtZW50XCJcbiAgICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0PXsoKSA9PiAoc2VnbWVudHMgKz0gMSl9XG4gICAgICBvbjprZXlkb3duPXtpZkNsaWNrRXF1aXZhbGVudCgoKSA9PiAoc2VnbWVudHMgKz0gMSkpfT5cbiAgICAgIDxBcnJvd1VwRnJvbUxpbmUgLz5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG48L2Rpdj5cbiIsIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5pbXBvcnQgeyBNaW51c1NxdWFyZSwgUGx1c1NxdWFyZSB9IGZyb20gJ2x1Y2lkZS1zdmVsdGUnXG5cbmltcG9ydCBFZGl0YWJsZU51bWJlciBmcm9tICcuL0VkaXRhYmxlTnVtYmVyLnN2ZWx0ZSdcbmltcG9ydCB7IGlmQ2xpY2tFcXVpdmFsZW50IH0gZnJvbSAnLi91dGlsJ1xuXG5leHBvcnQgbGV0IHZhbHVlID0gMFxuXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICB2YWx1ZSArPSAxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyZW1lbnQoKSB7XG4gIHZhbHVlIC09IDFcbn1cbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLWNvdW50ZXJcIj5cbiAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1jb3VudGVyX192YWx1ZVwiPlxuICAgIDxFZGl0YWJsZU51bWJlciBiaW5kOnZhbHVlIC8+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLWNvdW50ZXJfX2J1dHRvbnNcIj5cbiAgICA8ZGl2XG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1idXR0b24gcHJvZ3Jlc3MtY2xvY2tzLWNvdW50ZXJfX2RlY3JlbWVudFwiXG4gICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17ZGVjcmVtZW50fVxuICAgICAgb246a2V5ZG93bj17aWZDbGlja0VxdWl2YWxlbnQoZGVjcmVtZW50KX0+XG4gICAgICA8TWludXNTcXVhcmUgLz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2XG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1idXR0b24gcHJvZ3Jlc3MtY2xvY2tzLWNvdW50ZXJfX2luY3JlbWVudFwiXG4gICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17aW5jcmVtZW50fVxuICAgICAgb246a2V5ZG93bj17aWZDbGlja0VxdWl2YWxlbnQoaW5jcmVtZW50KX0+XG4gICAgICA8UGx1c1NxdWFyZSAvPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cbmltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgb25EZXN0cm95LCBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJ1xuaW1wb3J0IHsgUGF1c2UsIFBsYXksIFJlZnJlc2hDY3csIFRpbWVyIH0gZnJvbSAnbHVjaWRlLXN2ZWx0ZSdcbmltcG9ydCB7IGlmQ2xpY2tFcXVpdmFsZW50IH0gZnJvbSAnLi91dGlsJ1xuXG5jb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXG5jb25zdCBsb2NhbGUgPSBJbnRsLk51bWJlckZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLmxvY2FsZVxuXG5leHBvcnQgbGV0IHN0YXJ0TWlsbGlzOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuZXhwb3J0IGxldCBvZmZzZXRNaWxsaXM6IG51bWJlciA9IDBcbmV4cG9ydCBsZXQgc2hvd01pbGxpczogYm9vbGVhbiA9IGZhbHNlXG5leHBvcnQgbGV0IGlzUnVubmluZzogYm9vbGVhbiA9IHRydWVcbmV4cG9ydCBsZXQgbGFwVGltZXM6IG51bWJlcltdID0gW11cblxuY29uc3QgVElDS19JTlRFUlZBTF9NUyA9IDEwXG5cbmxldCBlbGFwc2VkTXMgPSAwXG5sZXQgdGlja0ludGVydmFsOiBudW1iZXIgfCBudWxsID0gbnVsbFxuXG5mdW5jdGlvbiB0aWNrKCkge1xuICBlbGFwc2VkTXMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0TWlsbGlzICsgb2Zmc2V0TWlsbGlzXG59XG5cbm9uTW91bnQoKCkgPT4ge1xuICBpZiAoaXNSdW5uaW5nKSB7XG4gICAgdGljaygpXG4gICAgc3RhcnQoKVxuICB9IGVsc2Uge1xuICAgIGVsYXBzZWRNcyA9IG9mZnNldE1pbGxpc1xuICB9XG59KVxuXG5vbkRlc3Ryb3koKCkgPT4ge1xuICBpZiAodGlja0ludGVydmFsKSB7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGlja0ludGVydmFsKVxuICAgIHRpY2tJbnRlcnZhbCA9IG51bGxcbiAgfVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICBpZiAodGlja0ludGVydmFsKSB7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGlja0ludGVydmFsKVxuICAgIHRpY2tJbnRlcnZhbCA9IG51bGxcbiAgfVxuXG4gIG9mZnNldE1pbGxpcyA9IGVsYXBzZWRNc1xuICBzdGFydE1pbGxpcyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIHRpY2tJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aWNrLCBUSUNLX0lOVEVSVkFMX01TKVxuICBpc1J1bm5pbmcgPSB0cnVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wKCkge1xuICBpZiAodGlja0ludGVydmFsKSB7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGlja0ludGVydmFsKVxuICAgIHRpY2tJbnRlcnZhbCA9IG51bGxcbiAgfVxuXG4gIG9mZnNldE1pbGxpcyA9IGVsYXBzZWRNc1xuICBpc1J1bm5pbmcgPSBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXQoKSB7XG4gIHN0YXJ0TWlsbGlzID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgb2Zmc2V0TWlsbGlzID0gMFxuICBsYXBUaW1lcyA9IFtdXG4gIGVsYXBzZWRNcyA9IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVByZWNpc2lvbigpIHtcbiAgc2hvd01pbGxpcyA9ICFzaG93TWlsbGlzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXAoKSB7XG4gIGxhcFRpbWVzLnB1c2goZWxhcHNlZE1zKVxuICBsYXBUaW1lcyA9IGxhcFRpbWVzXG4gIGRpc3BhdGNoKCdsYXAnLCB7IGVsYXBzZWRNcyB9KVxufVxuXG5mdW5jdGlvbiBmb3JtYXRUaW1lKG1zOiBudW1iZXIsIHNob3dNaWxsaXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICBjb25zdCBzZWNvbmRzID0gc2hvd01pbGxpcyA/IChtcyAvIDEwMDApICUgNjAgOiBNYXRoLmZsb29yKG1zIC8gMTAwMCkgJSA2MFxuICBjb25zdCBzZWNvbmRzRm9ybWF0dGVkID0gSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlLCB7XG4gICAgc3R5bGU6ICdkZWNpbWFsJyxcbiAgICBtaW5pbXVtSW50ZWdlckRpZ2l0czogMixcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IHNob3dNaWxsaXMgPyAzIDogMFxuICB9KS5mb3JtYXQoc2Vjb25kcylcblxuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihtcyAvIDEwMDAgLyA2MCkgJSA2MFxuICBjb25zdCBtaW51dGVzRm9ybWF0dGVkID0gSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlLCB7XG4gICAgc3R5bGU6ICdkZWNpbWFsJyxcbiAgICBtaW5pbXVtSW50ZWdlckRpZ2l0czogMlxuICB9KS5mb3JtYXQobWludXRlcylcblxuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IobXMgLyAxMDAwIC8gNjAgLyA2MClcbiAgY29uc3QgaG91cnNGb3JtYXR0ZWQgPSBJbnRsLk51bWJlckZvcm1hdChsb2NhbGUsIHtcbiAgICBzdHlsZTogJ2RlY2ltYWwnLFxuICAgIG1pbmltdW1JbnRlZ2VyRGlnaXRzOiAyXG4gIH0pLmZvcm1hdChob3VycylcblxuICByZXR1cm4gaG91cnMgPiAwXG4gICAgPyBgJHtob3Vyc0Zvcm1hdHRlZH06JHttaW51dGVzRm9ybWF0dGVkfToke3NlY29uZHNGb3JtYXR0ZWR9YFxuICAgIDogYCR7bWludXRlc0Zvcm1hdHRlZH06JHtzZWNvbmRzRm9ybWF0dGVkfWBcbn1cbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXN0b3B3YXRjaFwiPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3Mtc3RvcHdhdGNoX19lbGFwc2VkXCJcbiAgICByb2xlPVwiYnV0dG9uXCJcbiAgICB0YWJpbmRleD1cIjBcIlxuICAgIG9uOmNsaWNrPXt0b2dnbGVQcmVjaXNpb259XG4gICAgb246a2V5ZG93bj17aWZDbGlja0VxdWl2YWxlbnQodG9nZ2xlUHJlY2lzaW9uKX0+XG4gICAge2Zvcm1hdFRpbWUoZWxhcHNlZE1zLCBzaG93TWlsbGlzKX1cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3Mtc3RvcHdhdGNoX19idXR0b25zXCI+XG4gICAgPGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gKGlzUnVubmluZyA/IHN0b3AoKSA6IHN0YXJ0KCkpfT5cbiAgICAgIHsjaWYgaXNSdW5uaW5nfVxuICAgICAgICA8UGF1c2UgLz5cbiAgICAgIHs6ZWxzZX1cbiAgICAgICAgPFBsYXkgLz5cbiAgICAgIHsvaWZ9XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvbiBvbjpjbGljaz17cmVzZXR9PlxuICAgICAgPFJlZnJlc2hDY3cgLz5cbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uIG9uOmNsaWNrPXtsYXB9PlxuICAgICAgPFRpbWVyIC8+XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gKHNob3dNaWxsaXMgPSAhc2hvd01pbGxpcyl9PiAvMTAwMCA8L2J1dHRvbj5cbiAgPC9kaXY+XG4gIHsjaWYgbGFwVGltZXMubGVuZ3RoID4gMH1cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXN0b3B3YXRjaF9fbGFwc1wiPlxuICAgICAgeyNlYWNoIGxhcFRpbWVzIGFzIGxhcFRpbWUsIGl9XG4gICAgICAgIDxkaXYgZGF0YS1sYXAtdGltZS1tcz17bGFwVGltZX0+KHtpICsgMX0pIHtmb3JtYXRUaW1lKGxhcFRpbWUsIHNob3dNaWxsaXMpfTwvZGl2PlxuICAgICAgey9lYWNofVxuICAgIDwvZGl2PlxuICB7L2lmfVxuPC9kaXY+XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuaW1wb3J0IHsgUGllQ2hhcnQsIFBsdXNTcXVhcmUsIFRpbWVyLCBUcmFzaDIgfSBmcm9tICdsdWNpZGUtc3ZlbHRlJ1xuaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCB0aWNrIH0gZnJvbSAnc3ZlbHRlJ1xuaW1wb3J0IHsgZmFkZSB9IGZyb20gJ3N2ZWx0ZS90cmFuc2l0aW9uJ1xuXG5pbXBvcnQgRWRpdGFibGVUZXh0IGZyb20gJy4vRWRpdGFibGVUZXh0LnN2ZWx0ZSdcbmltcG9ydCBFZGl0YWJsZU51bWJlciwgeyBFZGl0TW9kZSB9IGZyb20gJy4vRWRpdGFibGVOdW1iZXIuc3ZlbHRlJ1xuaW1wb3J0IENsb2NrIGZyb20gJy4vQ2xvY2suc3ZlbHRlJ1xuaW1wb3J0IENvdW50ZXIgZnJvbSAnLi9Db3VudGVyLnN2ZWx0ZSdcbmltcG9ydCBTdG9wV2F0Y2ggZnJvbSAnLi9TdG9wV2F0Y2guc3ZlbHRlJ1xuXG5pbXBvcnQgdHlwZSB7IFNlY3Rpb25DaGlsZCB9IGZyb20gJ3NyYy9TdGF0ZSdcbmltcG9ydCB7IGlmQ2xpY2tFcXVpdmFsZW50IH0gZnJvbSAnLi91dGlsJ1xuXG5leHBvcnQgbGV0IG5hbWU6IHN0cmluZ1xuZXhwb3J0IGxldCBjaGlsZHJlbjogU2VjdGlvbkNoaWxkW11cblxuY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxuXG5mdW5jdGlvbiByYWlzZVJlbW92ZVNlY3Rpb24oZTogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpIHtcbiAgaWYgKGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IHx8IFsnRW50ZXInLCAnICddLmNvbnRhaW5zKGUua2V5KSkge1xuICAgIGRpc3BhdGNoKCdyZW1vdmVTZWN0aW9uJywgeyBzZWxmOiB0aGlzIH0pXG4gIH1cbn1cblxubGV0IGFkZGluZ0Nsb2NrID0gZmFsc2VcbmxldCBuZXdDbG9ja01vZGUgPSBFZGl0TW9kZS5FZGl0XG5sZXQgbmV3Q2xvY2tTZWdtZW50cyA9IDRcblxuZnVuY3Rpb24gYWRkQ2xvY2soKSB7XG4gIGlmIChuZXdDbG9ja01vZGUgIT09IEVkaXRNb2RlLlJlYWQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChuZXdDbG9ja1NlZ21lbnRzIDwgMSkge1xuICAgIHRpY2soKS50aGVuKCgpID0+IHtcbiAgICAgIG5ld0Nsb2NrTW9kZSA9IEVkaXRNb2RlLkVkaXRcbiAgICB9KVxuICAgIHJldHVyblxuICB9XG5cbiAgY2hpbGRyZW4ucHVzaCh7XG4gICAgdHlwZTogJ2Nsb2NrJyxcbiAgICBuYW1lOiBgQ2xvY2sgJHtjaGlsZHJlbi5sZW5ndGggKyAxfWAsXG4gICAgc2VnbWVudHM6IG5ld0Nsb2NrU2VnbWVudHMsXG4gICAgZmlsbGVkOiAwXG4gIH0pXG5cbiAgYWRkaW5nQ2xvY2sgPSBmYWxzZVxuICBuZXdDbG9ja01vZGUgPSBFZGl0TW9kZS5FZGl0XG5cbiAgY2hpbGRyZW4gPSBjaGlsZHJlblxufVxuXG5mdW5jdGlvbiBhZGRDb3VudGVyKCkge1xuICBjaGlsZHJlbi5wdXNoKHtcbiAgICB0eXBlOiAnY291bnRlcicsXG4gICAgbmFtZTogYENvdW50ZXIgJHtjaGlsZHJlbi5sZW5ndGggKyAxfWAsXG4gICAgdmFsdWU6IDBcbiAgfSlcblxuICBjaGlsZHJlbiA9IGNoaWxkcmVuXG59XG5cbmZ1bmN0aW9uIGFkZFN0b3B3YXRjaCgpIHtcbiAgY2hpbGRyZW4ucHVzaCh7XG4gICAgdHlwZTogJ3N0b3B3YXRjaCcsXG4gICAgbmFtZTogYFN0b3B3YXRjaCAke2NoaWxkcmVuLmxlbmd0aCArIDF9YCxcbiAgICBzdGFydE1pbGxpczogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgb2Zmc2V0TWlsbGlzOiAwLFxuICAgIHNob3dNaWxsaXM6IGZhbHNlLFxuICAgIGlzUnVubmluZzogdHJ1ZSxcbiAgICBsYXBUaW1lczogW11cbiAgfSlcblxuICBjaGlsZHJlbiA9IGNoaWxkcmVuXG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKGk6IG51bWJlcikge1xuICBjaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgY2hpbGRyZW4gPSBjaGlsZHJlblxufVxuPC9zY3JpcHQ+XG5cbjxzZWN0aW9uIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25cIiB0cmFuc2l0aW9uOmZhZGU9e3sgZHVyYXRpb246IDEwMCB9fT5cbiAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1zZWN0aW9uX19uYW1lXCI+XG4gICAgPEVkaXRhYmxlVGV4dCBiaW5kOnZhbHVlPXtuYW1lfSAvPlxuICA8L2Rpdj5cblxuICA8ZGl2XG4gICAgcm9sZT1cImJ1dHRvblwiXG4gICAgdGFiaW5kZXg9XCIwXCJcbiAgICBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1idXR0b24gcHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25fX3JlbW92ZVwiXG4gICAgb246Y2xpY2s9e3JhaXNlUmVtb3ZlU2VjdGlvbn1cbiAgICBvbjpjb250ZXh0bWVudT17cmFpc2VSZW1vdmVTZWN0aW9ufVxuICAgIG9uOmtleWRvd249e3JhaXNlUmVtb3ZlU2VjdGlvbn0+XG4gICAgPFRyYXNoMiAvPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25fX2NoaWxkcmVuXCI+XG4gICAgeyNlYWNoIGNoaWxkcmVuIGFzIGNoaWxkLCBpfVxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1zZWN0aW9uX19jaGlsZFwiIGRhdGEtY2hpbGQtdHlwZT17Y2hpbGQudHlwZX0+XG4gICAgICAgIHsjaWYgY2hpbGQudHlwZSA9PT0gJ2Nsb2NrJ31cbiAgICAgICAgICA8Q2xvY2sgey4uLmNoaWxkfSBiaW5kOnNlZ21lbnRzPXtjaGlsZC5zZWdtZW50c30gYmluZDpmaWxsZWQ9e2NoaWxkLmZpbGxlZH0gLz5cbiAgICAgICAgezplbHNlIGlmIGNoaWxkLnR5cGUgPT09ICdjb3VudGVyJ31cbiAgICAgICAgICA8Q291bnRlciB7Li4uY2hpbGR9IGJpbmQ6dmFsdWU9e2NoaWxkLnZhbHVlfSAvPlxuICAgICAgICB7OmVsc2UgaWYgY2hpbGQudHlwZSA9PT0gJ3N0b3B3YXRjaCd9XG4gICAgICAgICAgPFN0b3BXYXRjaFxuICAgICAgICAgICAgey4uLmNoaWxkfVxuICAgICAgICAgICAgYmluZDpzdGFydE1pbGxpcz17Y2hpbGQuc3RhcnRNaWxsaXN9XG4gICAgICAgICAgICBiaW5kOm9mZnNldE1pbGxpcz17Y2hpbGQub2Zmc2V0TWlsbGlzfVxuICAgICAgICAgICAgYmluZDpzaG93TWlsbGlzPXtjaGlsZC5zaG93TWlsbGlzfVxuICAgICAgICAgICAgYmluZDppc1J1bm5pbmc9e2NoaWxkLmlzUnVubmluZ31cbiAgICAgICAgICAgIGJpbmQ6bGFwVGltZXM9e2NoaWxkLmxhcFRpbWVzfSAvPlxuICAgICAgICB7L2lmfVxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3Mtc2VjdGlvbl9fY2hpbGQtbmFtZVwiPlxuICAgICAgICAgIDxFZGl0YWJsZVRleHQgYmluZDp2YWx1ZT17Y2hpbGQubmFtZX0gLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1zZWN0aW9uX19yZW1vdmUtY2hpbGRcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1idXR0b24gcHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25fX3JlbW92ZS1jaGlsZFwiXG4gICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gcmVtb3ZlQ2hpbGQoaSl9XG4gICAgICAgICAgICBvbjprZXlkb3duPXtpZkNsaWNrRXF1aXZhbGVudCgoKSA9PiByZW1vdmVDaGlsZChpKSl9PlxuICAgICAgICAgICAgPFRyYXNoMiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIHsvZWFjaH1cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3Mtc2VjdGlvbl9fYWRkLWNoaWxkXCI+XG4gICAgeyNpZiBhZGRpbmdDbG9ja31cbiAgICAgIDxFZGl0YWJsZU51bWJlclxuICAgICAgICBiaW5kOm1vZGU9e25ld0Nsb2NrTW9kZX1cbiAgICAgICAgYmluZDp2YWx1ZT17bmV3Q2xvY2tTZWdtZW50c31cbiAgICAgICAgb246Y29uZmlybWVkPXthZGRDbG9ja31cbiAgICAgICAgb246Y2FuY2VsbGVkPXsoKSA9PiB7XG4gICAgICAgICAgYWRkaW5nQ2xvY2sgPSBmYWxzZVxuICAgICAgICAgIG5ld0Nsb2NrTW9kZSA9IEVkaXRNb2RlLkVkaXRcbiAgICAgICAgfX0gLz5cbiAgICB7OmVsc2V9XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25fX2FkZC1jbG9ja1wiXG4gICAgICAgIHRpdGxlPVwiQWRkIG5ldyBwcm9ncmVzcyBjbG9ja1wiXG4gICAgICAgIG9uOmNsaWNrPXsoKSA9PiAoYWRkaW5nQ2xvY2sgPSB0cnVlKX0+XG4gICAgICAgIDxQaWVDaGFydCAvPlxuICAgICAgPC9idXR0b24+XG4gICAgey9pZn1cbiAgICA8YnV0dG9uIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXNlY3Rpb25fX2FkZC1jb3VudGVyXCIgdGl0bGU9XCJBZGQgbmV3IGNvdW50ZXJcIiBvbjpjbGljaz17YWRkQ291bnRlcn0+XG4gICAgICA8UGx1c1NxdWFyZSAvPlxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b24gY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3Mtc2VjdGlvbl9fYWRkLXN0b3B3YXRjaFwiIHRpdGxlPVwiQWRkIG5ldyBzdG9wd2F0Y2hcIiBvbjpjbGljaz17YWRkU3RvcHdhdGNofT5cbiAgICAgIDxUaW1lciAvPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvc2VjdGlvbj5cbiIsIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5pbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnXG5cbmltcG9ydCBTdGF0ZSBmcm9tICcuLi9TdGF0ZSdcbmltcG9ydCBTZWN0aW9uIGZyb20gJy4vU2VjdGlvbi5zdmVsdGUnXG5pbXBvcnQgeyBpZkNsaWNrRXF1aXZhbGVudCB9IGZyb20gJy4vdXRpbCdcblxuY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxuXG5leHBvcnQgbGV0IHN0YXRlID0gbmV3IFN0YXRlKClcbmV4cG9ydCBsZXQgdmVyc2lvbjogc3RyaW5nXG5leHBvcnQgbGV0IHNob3dUaXRsZSA9IGZhbHNlXG5cbiQ6IGRpc3BhdGNoKCdzdGF0ZVVwZGF0ZWQnLCB7IHN0YXRlIH0pXG5cbmZ1bmN0aW9uIGFkZFNlY3Rpb24oKSB7XG4gIHN0YXRlLnNlY3Rpb25zLnB1c2goeyBuYW1lOiBgU2VjdGlvbiAke3N0YXRlLnNlY3Rpb25zLmxlbmd0aCArIDF9YCwgY2hpbGRyZW46IFtdIH0pXG4gIHN0YXRlLnNlY3Rpb25zID0gc3RhdGUuc2VjdGlvbnNcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU2VjdGlvbihpOiBudW1iZXIpIHtcbiAgc3RhdGUuc2VjdGlvbnMuc3BsaWNlKGksIDEpXG4gIHN0YXRlLnNlY3Rpb25zID0gc3RhdGUuc2VjdGlvbnNcbn1cbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzIHByb2dyZXNzLWNsb2Nrcy1wYW5lbFwiPlxuICB7I2lmIHNob3dUaXRsZX1cbiAgICA8aGVhZGVyIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXRpdGxlXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy10aXRsZV9fbWFpbi10aXRsZVwiPlByb2dyZXNzIENsb2Nrczwvc3Bhbj5cbiAgICAgIDxhIGNsYXNzPVwicHJvZ3Jlc3MtY2xvY2tzLXRpdGxlX19zdWJ0aXRsZVwiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdG9rZW5zaGlmdC9vYnNpZGlhbi1wcm9ncmVzcy1jbG9ja3NcIj5cbiAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3Rva2Vuc2hpZnQvb2JzaWRpYW4tcHJvZ3Jlc3MtY2xvY2tzXG4gICAgICA8L2E+XG4gICAgPC9oZWFkZXI+XG4gIHsvaWZ9XG5cbiAgeyNlYWNoIHN0YXRlLnNlY3Rpb25zIGFzIHNlY3Rpb24sIGl9XG4gICAgPFNlY3Rpb24gYmluZDpuYW1lPXtzZWN0aW9uLm5hbWV9IGJpbmQ6Y2hpbGRyZW49e3NlY3Rpb24uY2hpbGRyZW59IG9uOnJlbW92ZVNlY3Rpb249eygpID0+IHJlbW92ZVNlY3Rpb24oaSl9IC8+XG4gIHsvZWFjaH1cblxuICA8ZGl2XG4gICAgY2xhc3M9XCJwcm9ncmVzcy1jbG9ja3MtYnV0dG9uIHByb2dyZXNzLWNsb2Nrcy1wYW5lbF9fYWRkLXNlY3Rpb25cIlxuICAgIHJvbGU9XCJidXR0b25cIlxuICAgIHRhYmluZGV4PVwiMFwiXG4gICAgb246a2V5ZG93bj17aWZDbGlja0VxdWl2YWxlbnQoYWRkU2VjdGlvbil9XG4gICAgb246Y2xpY2s9e2FkZFNlY3Rpb259PlxuICAgIEFkZCBTZWN0aW9uXG4gIDwvZGl2PlxuXG4gIHsjaWYgc3RhdGUuZGVidWd9XG4gICAgPHByZSBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1kZWJ1Z1wiPlxuICB7SlNPTi5zdHJpbmdpZnkoc3RhdGUsIG51bGwsIDIpfVxuICA8L3ByZT5cbiAgey9pZn1cblxuICB7I2lmIHZlcnNpb259XG4gICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNsb2Nrcy1wYW5lbF9fdmVyc2lvblwiPkNvdW50ZXJzIHZ7dmVyc2lvbn08L2Rpdj5cbiAgey9pZn1cbjwvZGl2PlxuIiwiaW1wb3J0IHsgTWFya2Rvd25SZW5kZXJDaGlsZCwgZGVib3VuY2UgfSBmcm9tICdvYnNpZGlhbidcblxuaW1wb3J0IFBhbmVsIGZyb20gJy4vdWkvUGFuZWwuc3ZlbHRlJ1xuaW1wb3J0IHR5cGUgUHJvZ3Jlc3NDbG9ja3NQbHVnaW4gZnJvbSAnLi9Qcm9ncmVzc0Nsb2Nrc1BsdWdpbidcblxuY29uc3QgREVCT1VOQ0VfU0FWRV9TVEFURV9USU1FID0gMTAwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9ncmVzc0Nsb2Nrc1JlbmRlckNoaWxkIGV4dGVuZHMgTWFya2Rvd25SZW5kZXJDaGlsZCB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgcGx1Z2luOiBQcm9ncmVzc0Nsb2Nrc1BsdWdpbiwgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgc3VwZXIoZWxlbWVudClcbiAgfVxuXG4gIGFzeW5jIG9ubG9hZCAoKSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKClcbiAgICBjb25zdCBzdGF0ZSA9IGRhdGE/LnN0YXRlIHx8IHsgc2VjdGlvbnM6IFtdIH1cblxuICAgIGNvbnN0IHBhbmVsID0gbmV3IFBhbmVsKHtcbiAgICAgIHRhcmdldDogdGhpcy5lbGVtZW50LFxuICAgICAgcHJvcHM6IHsgc3RhdGUsIHZlcnNpb246IHRoaXMucGx1Z2luLm1hbmlmZXN0LnZlcnNpb24gfVxuICAgIH0pXG5cbiAgICBwYW5lbC4kb24oJ3N0YXRlVXBkYXRlZCcsIGRlYm91bmNlKCh7IGRldGFpbDogeyBzdGF0ZSB9IH0pID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHsgc3RhdGUgfSlcbiAgICB9LCBERUJPVU5DRV9TQVZFX1NUQVRFX1RJTUUsIHRydWUpKVxuICB9XG59XG4iLCJpbXBvcnQgdHlwZSBQcm9ncmVzc0Nsb2Nrc1BsdWdpbiBmcm9tICcuL1Byb2dyZXNzQ2xvY2tzUGx1Z2luJ1xuaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIGRlYm91bmNlIH0gZnJvbSAnb2JzaWRpYW4nXG5pbXBvcnQgUGFuZWwgZnJvbSAnLi91aS9QYW5lbC5zdmVsdGUnXG5cbmV4cG9ydCBjb25zdCBESVNQTEFZX1RFWFQgPSAnUHJvZ3Jlc3MgQ2xvY2tzJ1xuZXhwb3J0IGNvbnN0IElDT04gPSAncGllLWNoYXJ0JyAvLyBJY29ucyBmcm9tIGh0dHBzOi8vbHVjaWRlLmRldi9pY29ucy9cbmV4cG9ydCBjb25zdCBWSUVXX1RZUEUgPSAnUFJPR1JFU1NfQ0xPQ0tTX1ZJRVcnXG5cbmNvbnN0IERFQk9VTkNFX1NBVkVfU1RBVEVfVElNRSA9IDEwMDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZ3Jlc3NDbG9ja3NWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBuYXZpZ2F0aW9uID0gZmFsc2VcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGx1Z2luOiBQcm9ncmVzc0Nsb2Nrc1BsdWdpbiwgcHVibGljIGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcbiAgICBzdXBlcihsZWFmKVxuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gRElTUExBWV9URVhUXG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIElDT05cbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gVklFV19UWVBFXG4gIH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKClcbiAgICBjb25zdCBzdGF0ZSA9IGRhdGE/LnN0YXRlIHx8IHsgc2VjdGlvbnM6IFtdIH1cblxuICAgIGNvbnN0IHBhbmVsID0gbmV3IFBhbmVsKHtcbiAgICAgIHRhcmdldDogdGhpcy5jb250ZW50RWwsXG4gICAgICBwcm9wczoge1xuICAgICAgICBzaG93VGl0bGU6IHRydWUsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLnBsdWdpbi5tYW5pZmVzdC52ZXJzaW9uXG4gICAgICB9XG4gICAgfSlcblxuICAgIHBhbmVsLiRvbignc3RhdGVVcGRhdGVkJywgZGVib3VuY2UoKHsgZGV0YWlsOiB7IHN0YXRlIH0gfSkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEoeyBzdGF0ZSB9KVxuICAgIH0sIERFQk9VTkNFX1NBVkVfU1RBVEVfVElNRSwgdHJ1ZSkpXG5cbiAgfVxufSIsImltcG9ydCB0eXBlIHsgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCwgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJ1xuaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nXG5cbmltcG9ydCBQcm9ncmVzc0Nsb2Nrc1JlbmRlckNoaWxkIGZyb20gJy4vUHJvZ3Jlc3NDbG9ja3NSZW5kZXJDaGlsZCdcbmltcG9ydCBQcm9ncmVzc0Nsb2Nrc1ZpZXcsIHsgVklFV19UWVBFIH0gZnJvbSAnLi9Qcm9ncmVzc0Nsb2Nrc1ZpZXcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyZXNzQ2xvY2tzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgYXN5bmMgb25sb2FkICgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ2NvdW50ZXJzJywgKHNvdXJjZSwgZWwsIGN0eCkgPT4gdGhpcy5oYW5kbGVDb3VudGVyc0NvZGVCbG9jayhzb3VyY2UsIGVsLCBjdHgpKVxuXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoXG4gICAgICBWSUVXX1RZUEUsXG4gICAgICAobGVhZjogV29ya3NwYWNlTGVhZikgPT4gbmV3IFByb2dyZXNzQ2xvY2tzVmlldyh0aGlzLCBsZWFmKSlcblxuICAgIHRoaXMuYWRkVmlldygpXG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdvcGVuLXBhbmVsJyxcbiAgICAgIG5hbWU6ICdPcGVuIHRoZSBzaWRlYmFyIHZpZXcnLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbGVhZiA9IGF3YWl0IHRoaXMuYWRkVmlldygpXG4gICAgICAgIGlmIChsZWFmKSB7XG4gICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBhZGRWaWV3ICgpIHtcbiAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSlbMF1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2U/LmdldFJpZ2h0TGVhZihmYWxzZSk/LnNldFZpZXdTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFZJRVdfVFlQRVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlQ291bnRlcnNDb2RlQmxvY2sgKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGlsZCA9IG5ldyBQcm9ncmVzc0Nsb2Nrc1JlbmRlckNoaWxkKHRoaXMsIGVsKVxuICAgICAgY3R4LmFkZENoaWxkKGNoaWxkKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc3QgcHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJylcbiAgICAgIHByZS5hcHBlbmQoZXJyLm1lc3NhZ2UpXG4gICAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICAgIHByZS5hcHBlbmQoJ1xcbicpXG4gICAgICAgIHByZS5hcHBlbmQoZXJyLnN0YWNrKVxuICAgICAgfVxuICAgICAgZWwuYXBwZW5kKHByZSlcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJub3ciLCJlbGVtZW50IiwidGV4dCIsImhhc2giLCJkZXRhY2giLCJpbml0IiwidGljayIsInVwZGF0ZSIsImluc3RhbmNlIiwiY3JlYXRlX2ZyYWdtZW50IiwiY3R4IiwiZGVmYXVsdEF0dHJpYnV0ZXMiLCJfYSIsImxpbmVhciIsImNyZWF0ZV9pZl9ibG9ja18xIiwiRWRpdE1vZGUiLCJjcmVhdGVfaWZfYmxvY2siLCJ0YWtlRm9jdXMiLCJkaXNwYXRjaCIsInNlZ21lbnRzIiwiZmlsbGVkIiwic2hvd01pbGxpcyIsImNoaWxkcmVuIiwiREVCT1VOQ0VfU0FWRV9TVEFURV9USU1FIiwiTWFya2Rvd25SZW5kZXJDaGlsZCIsImRlYm91bmNlIiwic3RhdGUiLCJJdGVtVmlldyIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxTQUFTLE9BQU87QUFBRztB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
