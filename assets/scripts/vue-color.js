! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("vue")) : "function" == typeof define && define.amd ? define(["vue"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).VueColorPicker = t(e.Vue);
}(this, function (e) {
    "use strict";
    const t = 180 / Math.PI,
         a = e => {
              const t = e % 360;
              return t < 0 ? 360 + t : t;
         },
         n = () => {};
    class o {
         constructor(e, t) {
              this.active = false, this.element = e, this.element.style.willChange = "transform", this.initOptions(t), this.updateCSS(), this.bindHandlers(), this.addListeners();
         }
         get angle() {
              return this._angle;
         }
         set angle(e) {
              this._angle !== e && (this._angle = a(e), this.updateCSS());
         }
         initOptions(e) {
              e = e || {}, this.onRotate = e.onRotate || n, this.onDragStart = e.onDragStart || n, this.onDragStop = e.onDragStop || n, this._angle = e.angle || 0;
         }
         bindHandlers() {
              this.onRotationStart = this.onRotationStart.bind(this), this.onRotated = this.onRotated.bind(this), this.onRotationStop = this.onRotationStop.bind(this);
         }
         addListeners() {
              this.element.addEventListener("touchstart", this.onRotationStart, {
                   passive: true
              }), document.addEventListener("touchmove", this.onRotated, {
                   passive: false
              }), document.addEventListener("touchend", this.onRotationStop, {
                   passive: true
              }), document.addEventListener("touchcancel", this.onRotationStop, {
                   passive: true
              }), this.element.addEventListener("mousedown", this.onRotationStart, {
                   passive: true
              }), document.addEventListener("mousemove", this.onRotated, {
                   passive: false
              }), document.addEventListener("mouseup", this.onRotationStop, {
                   passive: true
              }), document.addEventListener("mouseleave", this.onRotationStop, {
                   passive: false
              });
         }
         removeListeners() {
              this.element.removeEventListener("touchstart", this.onRotationStart), document.removeEventListener("touchmove", this.onRotated), document.removeEventListener("touchend", this.onRotationStop), document.removeEventListener("touchcancel", this.onRotationStop), this.element.removeEventListener("mousedown", this.onRotationStart), document.removeEventListener("mousemove", this.onRotated), document.removeEventListener("mouseup", this.onRotationStop), document.removeEventListener("mouseleave", this.onRotationStop);
         }
         destroy() {
              this.onRotationStop(), this.removeListeners();
         }
         onRotationStart(e) {
              "touchstart" !== e.type && 0 !== e.button || (this.active = true, this.onDragStart(e), this.setAngleFromEvent(e));
         }
         onRotationStop() {
              this.active && (this.active = false, this.onDragStop()), this.active = false;
         }
         onRotated(e) {
              this.active && (e.preventDefault(), this.setAngleFromEvent(e));
         }
         setAngleFromEvent(e) {
              const n = e.targetTouches ? e.targetTouches[0] : e,
                   o = (({
                        x: e,
                        y: a
                   }, n) => {
                        const o = n.left + n.width / 2,
                             i = n.top + n.height / 2;
                        return Math.atan2(a - i, e - o) * t;
                   })({
                        x: n.clientX,
                        y: n.clientY
                   }, this.element.getBoundingClientRect());
              this._angle = a(o + 90), this.updateCSS(), this.onRotate(this._angle);
         }
         updateCSS() {
              this.element.style.transform = "rotate(" + this._angle + "deg)";
         }
    }
    const i = ["#ff0000", "#ffff00", "#00ff00", "cyan", "blue", "magenta", "red"],
         l = {
              ArrowUp: (e, t) => e + t,
              ArrowRight: (e, t) => e + t,
              ArrowDown: (e, t) => e - t,
              ArrowLeft: (e, t) => e - t,
              PageUp: (e, t) => e + 10 * t,
              PageDown: (e, t) => e - 10 * t,
              Home: () => 0,
              End: () => 359
         },
         s = {
              name: "ColorPicker",
              emits: ["select", "input", "change"],
              props: {
                   hue: {
                        default: 50
                   },
                   saturation: {
                        default: 100
                   },
                   luminosity: {
                        default: 50
                   },
                   alpha: {
                        default: 1
                   },
                   step: {
                        default: 0.25
                   },
                   mouseScroll: {
                        default: false
                   },
                   variant: {
                        default: "collapsible"
                   },
                   disabled: {
                        default: false
                   },
                   initiallyCollapsed: {
                        default: false
                   },
                   ariaLabel: {
                        default: "color picker"
                   },
                   ariaRoledescription: {
                        default: "radial slider"
                   },
                   ariaValuetext: {
                        default: ""
                   },
                   ariaLabelColorWell: {
                        default: "color well"
                   }
              },
              setup(t, {
                   emit: a
              }) {
                   const n = e.ref(null),
                        s = e.ref(null);
                   let r = null;
                   const d = t.hue + "deg",
                        u = e.ref(t.hue),
                        c = e.ref(!t.initiallyCollapsed),
                        v = e.ref(!t.initiallyCollapsed),
                        h = e.ref(false),
                        p = e.ref(false),
                        g = e.ref(false),
                        m = e.computed(() => `hsla(${u.value}, ${t.saturation}%, ${t.luminosity}%, ${t.alpha})`),
                        f = e.computed(() => i[Math.round(u.value / 60)]);
                   e.watch(() => t.hue, e => {
                        u.value = e, r.angle = e;
                   }), e.onMounted(() => {
                        r = new o(s.value, {
                             angle: u.value,
                             onRotate(e) {
                                  u.value = e, a("input", u.value);
                             },
                             onDragStart() {
                                  g.value = true;
                             },
                             onDragStop() {
                                  g.value = false, a("change", u.value);
                             }
                        });
                   }), e.onBeforeUnmount(() => {
                        r.destroy(), r = null;
                   });
                   return {
                        rcp: r,
                        el: n,
                        rotator: s,
                        initialAngle: d,
                        angle: u,
                        isPaletteIn: c,
                        isKnobIn: v,
                        isDragging: g,
                        isRippling: p,
                        isPressed: h,
                        color: m,
                        valuetext: f,
                        onKeyDown: e => {
                             !t.disabled && !h.value && v.value && e.key in l && (e.preventDefault(), r.angle = l[e.key](r.angle, t.step), u.value = r.angle, a("input", u.value), a("change", u.value));
                        },
                        onScroll: e => {
                             !h.value && v.value && (e.preventDefault(), e.deltaY > 0 ? r.angle += t.step : r.angle -= t.step, u.value = r.angle, a("input", u.value), a("change", u.value));
                        },
                        selectColor: () => {
                             h.value = true, c.value && v.value ? (a("select", u.value), p.value = true) : c.value = true;
                        },
                        togglePicker: () => {
                             "persistent" !== t.variant && (v.value ? v.value = false : (v.value = true, c.value = true)), p.value = false, h.value = false;
                        },
                        hidePalette: () => {
                             v.value || (c.value = false);
                        }
                   };
              }
         };
    return s.render = function (t, a, n, o, i, l) {
         return e.openBlock(), e.createBlock("div", {
              ref: "el",
              role: "slider",
              "aria-roledescription": n.ariaRoledescription,
              "aria-label": n.ariaLabel,
              "aria-expanded": o.isPaletteIn,
              "aria-valuemin": "0",
              "aria-valuemax": "359",
              "aria-valuenow": o.angle,
              "aria-valuetext": n.ariaValuetext || o.valuetext,
              "aria-disabled": n.disabled,
              class: ["rcp", {
                   dragging: o.isDragging,
                   disabled: n.disabled
              }],
              tabindex: n.disabled ? -1 : 0,
              style: {
                   "--rcp-initial-angle": o.initialAngle
              },
              onKeyup: a[4] || (a[4] = e.withKeys((...e) => o.selectColor && o.selectColor(...e), ["enter"])),
              onKeydown: a[5] || (a[5] = (...e) => o.onKeyDown && o.onKeyDown(...e))
         }, [e.createVNode("div", {
              class: ["rcp__palette", o.isPaletteIn ? "in" : "out"]
         }, null, 2), e.createVNode("div", e.mergeProps({
              class: "rcp__rotator",
              style: {
                   "pointer-events": n.disabled || o.isPressed || !o.isKnobIn ? "none" : null
              }
         }, e.toHandlers(n.mouseScroll ? {
              wheel: o.onScroll
         } : {}), {
              ref: "rotator"
         }), [e.createVNode("div", {
              class: ["rcp__knob", o.isKnobIn ? "in" : "out"],
              onTransitionend: a[1] || (a[1] = (...e) => o.hidePalette && o.hidePalette(...e))
         }, null, 34)], 16), e.createVNode("div", {
              class: ["rcp__ripple", {
                   rippling: o.isRippling
              }],
              style: {
                   borderColor: o.color
              }
         }, null, 6), e.createVNode("button", {
              type: "button",
              class: ["rcp__well", {
                   pressed: o.isPressed
              }],
              "aria-label": n.ariaLabelColorWell,
              disabled: n.disabled,
              tabindex: n.disabled ? -1 : 0,
              style: {
                   backgroundColor: o.color
              },
              onAnimationend: a[2] || (a[2] = (...e) => o.togglePicker && o.togglePicker(...e)),
              onClick: a[3] || (a[3] = (...e) => o.selectColor && o.selectColor(...e))
         }, null, 46, ["aria-label", "disabled", "tabindex"])], 46, ["aria-roledescription", "aria-label", "aria-expanded", "aria-valuenow", "aria-valuetext", "aria-disabled", "tabindex"]);
    }, s.install = function (e) {
         e.component("ColorPicker", s);
    }, s;
});