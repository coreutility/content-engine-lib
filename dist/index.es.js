const h = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const a = Math.random() * 16 | 0;
    return (t == "x" ? a : a & 3 | 8).toString(16);
  })
}), m = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), w = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const a = t.name, l = document.getElementById(t.el_id);
      if (!l)
        throw new Error("[el_id] is invalid");
      ((_) => {
        const r = (c) => {
          ((i) => {
            const n = i.getAttribute("data-ce");
            if (!n)
              return;
            const o = JSON.parse(n).filter((e) => e?.k.startsWith("t-"));
            if (o.length != 0)
              for (const e of o) {
                const y = e.k, f = e.v.split(" ");
                if (y == `t-${a}-class`)
                  for (const u of f)
                    i.classList.add(u);
                else
                  for (const u of f)
                    i.classList.remove(u);
              }
          })(c);
        };
        for (const c of _.getElementsByTagName("*"))
          r(c);
        r(_);
      })(l);
    } catch (a) {
      const l = `err: [theme] ${a}`;
      throw console.log(l), l;
    }
  }
});
function x(t, a = 1e3) {
  let l = {
    cnt: 0
  };
  return new Promise((_) => {
    const r = () => {
      console.log(`[setInterval] is running.. [count=${l.cnt}]`);
      try {
        t() && (clearInterval(c), _());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${a}]`);
      }
      l.cnt += 1;
    }, c = setInterval(() => {
      r();
    }, a);
    r();
  });
}
console.log("content_engine_lib");
let s = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const a = t?.lib || [];
      for (const [l, _] of a.entries()) {
        const r = _, c = `${r.name}:${t.run_from}`, i = `${t.run_from}_src`;
        let n = r[i];
        const d = `${t.run_from}_src`;
        let o = t?.lazy_lib?.[d] || null;
        if (o && (o = o.replace("{*}", `${r.name}`)), console.log(`_lazy_src: ${o}`), console.log(`_src: ${n}`), s.lib.l.hasOwnProperty(`${c}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(n) && n.includes("/") == !1 && s.lib.inbuilt_lib.indexOf(`${r.name}`) === -1)
            if (o)
              n = o;
            else
              throw `[lib-name=${r.name},lib-src=${n}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (n.startsWith("./") || n.startsWith("../")) {
            const e = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${n}`
            );
            s.lib.l[`${c}`] = {
              lib: e,
              src: n
            };
          }
          if (n.startsWith("http://") || n.startsWith("https://")) {
            const e = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${n}`
            );
            s.lib.l[`${c}`] = {
              lib: e,
              src: n
            };
          }
        }
      }
      console.log(await s.lib.get_all({}));
    },
    get: async (t) => {
      let a = null;
      const l = `${t.name}:${t.run_from}`;
      return s.lib.l.hasOwnProperty(`${l}`) == !1 && await s.lib.set({
        lib: [
          {
            renderer_src: t.name,
            hydrator_src: t.name,
            editor_src: t.name,
            name: t.name
          }
        ],
        run_from: t.run_from,
        lazy_lib: t.lazy_lib
      }), a = s.lib.l[`${l}`], a;
    },
    get_all: async (t) => s.lib.l
  },
  path: {
    set: (t) => {
      let a = "";
      const l = t.src.split("/");
      for (const [_, r] of l.entries()) {
        let c = _ == 0 ? "" : "/";
        if (a += `${c}${r}`, r == t.type)
          return `${a}${t.name}`;
      }
      return `${a}${t.name}`;
    }
  }
};
const g = async (t) => {
  const a = await m();
  return await s.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (l, _) => {
      console.log("--renderer [set]");
      let r = {
        r: "",
        style: ""
      };
      return await (async () => {
        for (const i of l.data?.value?.l || l.data.l) {
          const n = await await s.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), o = await (await n.lib.index({
            f: {
              name: (e) => a.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await s.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => s.path.set({ src: n.src, type: i.type, name: e })
            }
          })).set({
            data: {
              curr: i
            }
          }, _);
          r.r += o.r, r.style += o.style;
        }
      })(), r;
    }
  };
}, $ = async (t) => {
  const a = await m();
  return await s.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (l, _) => {
      console.log("--hydrator [set]");
      let r = {
        r: "",
        style: ""
      };
      const c = async () => {
        for (const i of l.data?.value?.l || l.data.l) {
          const n = await await s.lib.get({ name: i.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), o = await (await n.lib.index({
            f: {
              name: (e) => a.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await s.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => s.path.set({ src: n.src, type: i.type, name: e })
            }
          })).set({
            data: {
              curr: i
            }
          }, _);
          r.style += o.style;
        }
      };
      return await x(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await c(), r;
    }
  };
}, z = async (t) => (await m(), await s.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (a, l) => {
    console.log("--editor [set]");
    let _ = {
      data: {
        l: [
          {
            id: h().set(),
            type: "editor",
            data: {
              l: []
            }
          }
        ]
      }
    }, r = {
      r: "",
      style: ""
    };
    const c = g, i = $, n = await c({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), o = await n.set({
      data: _.data
    });
    return (async () => {
      const e = await d.set({
        data: _.data
      }, {
        change: (y) => {
          l?.change(y);
        }
      });
      ((y) => {
        const b = document.createElement("style");
        b.innerHTML = `${e.style}`, y.appendChild(b);
      })(document.head);
    })(), r.r = o.r, r.style = `
            ${o.style}
            `, r;
  }
});
export {
  z as ce_editor,
  $ as ce_hydrator,
  g as ce_renderer
};
