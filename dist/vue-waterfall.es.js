import { ref as m, computed as R, onMounted as q, onUnmounted as D, defineComponent as G, watch as S, createElementBlock as x, openBlock as O, normalizeStyle as z, unref as A, createCommentVNode as J, Fragment as B, renderList as T, createElementVNode as M, normalizeClass as K, renderSlot as Q } from "vue";
function X(u, e) {
  let o;
  return function(...v) {
    clearTimeout(o), o = setTimeout(() => {
      u.apply(this, v);
    }, e);
  };
}
function Y(u, e) {
  const o = m(), v = m(0), g = m(/* @__PURE__ */ new Map()), W = m(0), b = m(!1), I = m(/* @__PURE__ */ new Map());
  let h = null;
  const w = m(/* @__PURE__ */ new Set());
  let p = null;
  const {
    columns: $ = 3,
    gap: y = 10,
    minColumnWidth: k = 200,
    hoverEffect: E = !0,
    fadeInAndOut: N = !1
  } = e, t = m(k), s = () => {
    o.value && (v.value = o.value?.offsetWidth || 0);
  }, n = R(() => {
    if (!o.value) return $;
    const l = Math.floor((v.value + y) / (k + y));
    return Math.max(Math.min($, l), 1);
  }), i = R(() => o.value ? (v.value - (n.value - 1) * y) / n.value : k), c = async () => {
    if (!o.value || u.length === 0) return;
    b.value = !0;
    const l = /* @__PURE__ */ new Map(), r = new Array(n.value).fill(0);
    for (let d = 0; d < u.length; d++) {
      const a = u[d], f = r.indexOf(Math.min(...r)), U = f * (i.value + y), j = r[f], H = I.value.get(a.id) ?? await V(a.src, i.value);
      l.set(a.id, {
        x: U,
        y: j,
        width: i.value,
        height: H
      }), r[f] += H + y;
    }
    g.value = l, W.value = Math.max(...r), t.value = i.value, b.value = !1;
  }, C = X(c, 300), _ = () => {
    h || (h = new ResizeObserver((l) => {
      for (const r of l) {
        const d = r.target, a = d.dataset.wfId;
        if (!a) continue;
        const f = Number.isNaN(Number(a)) ? a : Number(a);
        I.value.set(f, d.offsetHeight);
      }
      C();
    }));
  }, L = () => {
    p || (p = new IntersectionObserver((l) => {
      for (const r of l) {
        const a = r.target.dataset.wfId;
        if (!a) continue;
        const f = Number.isNaN(Number(a)) ? a : Number(a);
        r.isIntersecting ? w.value.add(f) : w.value.delete(f);
      }
    }, {
      root: o.value ?? null,
      rootMargin: "0px",
      threshold: 0.2
    }));
  }, P = (l, r) => {
    if (!l) {
      I.value.delete(r.id);
      return;
    }
    l.dataset.wfId = String(r.id), _(), h.observe(l), I.value.set(r.id, l.offsetHeight), N && (L(), p.observe(l));
  }, V = (l, r) => new Promise((d) => {
    const a = new Image();
    a.onload = () => {
      const f = a.naturalHeight / a.naturalWidth;
      d(r * f);
    }, a.onerror = () => {
      d(200);
    }, a.src = l;
  }), F = () => {
    s(), C();
  };
  return q(() => {
    s(), C(), window.addEventListener("resize", F);
  }), D(() => {
    window.removeEventListener("resize", F), h && (h.disconnect(), h = null), p && (p.disconnect(), p = null), I.value.clear(), w.value.clear();
  }), {
    containerRef: o,
    itemPositions: g,
    containerHeight: W,
    isLoading: b,
    hoverEffect: E,
    calculateLayout: c,
    renderColumnWidth: t,
    setItemRef: P,
    visibleItemIds: w
  };
}
const Z = ["onClick", "onMouseenter", "onMouseleave"], ee = ["src", "alt"], te = /* @__PURE__ */ G({
  __name: "WaterfallContainer",
  props: {
    items: {},
    columns: { default: 3 },
    gap: { default: 10 },
    minColumnWidth: { default: 200 },
    hoverEffect: { type: Boolean, default: !0 },
    fadeInAndOut: { type: Boolean, default: !1 },
    hoverFunction: {},
    clickFunction: {},
    hoverLeaveFunction: {}
  },
  setup(u) {
    const e = u, o = m(!1), {
      containerRef: v,
      itemPositions: g,
      containerHeight: W,
      calculateLayout: b,
      setItemRef: I,
      renderColumnWidth: h,
      visibleItemIds: w
    } = Y(e.items, {
      columns: e.columns,
      gap: e.gap,
      minColumnWidth: e.minColumnWidth,
      hoverEffect: e.hoverEffect,
      fadeInAndOut: e.fadeInAndOut
    }), p = (t) => {
      const s = e.columns || 3, n = e.gap || 10, i = t % s, c = Math.floor(t / s), C = `calc((100% - ${n * (s - 1)}px) / ${s})`, _ = `calc(${i} * (100% / ${s}) + ${i * n}px)`, L = `${c * 250 + c * n}px`;
      return {
        position: "absolute",
        width: C,
        left: _,
        top: L,
        height: "200px"
      };
    }, $ = (t) => {
      const s = g.value.get(t.id), n = e.hoverEffect ? "-3px" : "0px", i = e.hoverEffect ? "1.01" : "1", c = {
        "--hover-translate": n,
        "--hover-scale": i,
        width: `${h.value}px`
      };
      return s ? {
        ...c,
        position: "absolute",
        left: `${s.x}px`,
        top: `${s.y}px`,
        ...e.fadeInAndOut ? {} : { opacity: 1 }
      } : c;
    }, y = (t) => {
      const s = t.target;
      s.style.opacity = "0";
    };
    S(g, (t) => {
      t.size > 0 && !o.value && setTimeout(() => {
        o.value = !0;
      }, 100);
    }, { immediate: !0 }), S(() => e.items, (t, s) => {
      t.length !== s?.length && (o.value = !1), b();
    }, { deep: !0 });
    const k = (t) => {
      e.clickFunction && e.clickFunction(t);
    }, E = (t) => {
      e.hoverFunction && e.hoverFunction(t);
    }, N = (t) => {
      e.hoverLeaveFunction && e.hoverLeaveFunction(t);
    };
    return (t, s) => (O(), x("div", {
      ref_key: "containerRef",
      ref: v,
      class: "waterfall-container",
      style: z({ height: `${A(W)}px` })
    }, [
      !o.value && t.items.length > 0 ? (O(!0), x(B, { key: 0 }, T(t.items, (n, i) => (O(), x("div", {
        key: `skeleton-${n.id}`,
        class: "waterfall-skeleton",
        style: z(p(i))
      }, s[0] || (s[0] = [
        M("div", { class: "skeleton-image" }, null, -1),
        M("div", { class: "skeleton-content" }, [
          M("div", { class: "skeleton-line skeleton-line-short" }),
          M("div", { class: "skeleton-line" })
        ], -1)
      ]), 4))), 128)) : J("", !0),
      (O(!0), x(B, null, T(t.items, (n, i) => (O(), x("div", {
        class: K(["waterfall-item", {
          "is-hidden": !o.value,
          fadeInOut: e.fadeInAndOut,
          "in-view": A(w).has(n.id) && e.fadeInAndOut
        }]),
        key: n.id,
        style: z($(n)),
        ref_for: !0,
        ref: (c) => A(I)(c, n),
        onClick: (c) => k(n),
        onMouseenter: (c) => E(n),
        onMouseleave: (c) => N(n)
      }, [
        Q(t.$slots, "default", {
          item: n,
          index: i
        }, () => [
          M("img", {
            src: n.src,
            alt: n.alt || "",
            class: "waterfall-image",
            loading: "lazy",
            onError: y
          }, null, 40, ee)
        ], !0)
      ], 46, Z))), 128))
    ], 4));
  }
}), ne = (u, e) => {
  const o = u.__vccOpts || u;
  for (const [v, g] of e)
    o[v] = g;
  return o;
}, oe = /* @__PURE__ */ ne(te, [["__scopeId", "data-v-af975b1a"]]), ae = {
  install(u) {
    u.component("WaterfallContainer", oe);
  }
};
export {
  oe as WaterfallContainer,
  ae as default,
  Y as useWaterfall
};
