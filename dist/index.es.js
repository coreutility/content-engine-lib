const h = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const a = Math.random() * 16 | 0;
    return (t == "x" ? a : a & 3 | 8).toString(16);
  })
}), f = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), w = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const a = t.name, r = document.getElementById(t.el_id);
      if (!r)
        throw new Error("[el_id] is invalid");
      ((o) => {
        const n = (s) => {
          ((i) => {
            const l = i.getAttribute("data-ce");
            if (!l)
              return;
            const _ = JSON.parse(l).filter((e) => e?.k.startsWith("t-"));
            if (_.length != 0)
              for (const e of _) {
                const y = e.k, m = e.v.split(" ");
                if (y == `t-${a}-class`)
                  for (const u of m)
                    i.classList.add(u);
                else
                  for (const u of m)
                    i.classList.remove(u);
              }
          })(s);
        };
        for (const s of o.getElementsByTagName("*"))
          n(s);
        n(o);
      })(r);
    } catch (a) {
      const r = `err: [theme] ${a}`;
      throw console.log(r), r;
    }
  }
});
function x(t, a = 1e3) {
  let r = {
    cnt: 0
  };
  return new Promise((o) => {
    const n = () => {
      console.log(`[setInterval] is running.. [count=${r.cnt}]`);
      try {
        t() && (clearInterval(s), o());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${a}]`);
      }
      r.cnt += 1;
    }, s = setInterval(() => {
      n();
    }, a);
    n();
  });
}
console.log("content_engine_lib");
let c = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const a = t?.lib || [];
      for (const [r, o] of a.entries()) {
        const n = o, s = `${n.name}:${t.run_from}`, i = `${t.run_from}_src`;
        let l = n[i];
        const d = `${t.run_from}_src`;
        let _ = t?.lazy_lib?.[d] || null;
        if (_ && (_ = _.replace("{*}", `${n.name}`)), console.log(`_lazy_src: ${_}`), console.log(`_src: ${l}`), c.lib.l.hasOwnProperty(`${s}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(l) && l.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${n.name}`) === -1)
            if (_)
              l = _;
            else
              throw `[lib-name=${n.name},lib-src=${l}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (l.startsWith("./") || l.startsWith("../")) {
            const e = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            c.lib.l[`${s}`] = {
              lib: e,
              src: l
            };
          }
          if (l.startsWith("http://") || l.startsWith("https://")) {
            const e = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            c.lib.l[`${s}`] = {
              lib: e,
              src: l
            };
          }
        }
      }
      console.log(await c.lib.get_all({}));
    },
    get: async (t) => {
      let a = null;
      const r = `${t.name}:${t.run_from}`;
      return c.lib.l.hasOwnProperty(`${r}`) == !1 && await c.lib.set({
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
      }), a = c.lib.l[`${r}`], a;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let a = "", r = "";
      const o = t.src.split("/");
      if (o.indexOf("://localhost") !== -1 || o.indexOf("://127.0.0.1") !== -1 || (r = "/dist"), o.indexOf(t.type) !== -1)
        for (const [n, s] of o.entries()) {
          let i = n == 0 ? "" : "/";
          if (a += `${i}${s}`, s == t.type)
            return `${a}${r}${t.name}`;
        }
      else
        for (const [n, s] of o.entries()) {
          let i = n == 0 ? "" : "/";
          if (a += `${i}${s}`, s == "src")
            return `${a}${r}${t.name}`;
        }
      return `${a}${r}${t.name}`;
    }
  }
};
const $ = async (t) => {
  const a = await f();
  return await c.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (r, o) => {
      console.log("--renderer [set]");
      let n = {
        r: "",
        style: ""
      };
      return await (async () => {
        for (const i of r.data?.value?.l || r.data.l) {
          const l = await await c.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), _ = await (await l.lib.index({
            f: {
              name: (e) => a.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await c.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => c.path.set({ src: l.src, type: i.type, name: e })
            }
          })).set({
            data: {
              curr: i
            }
          }, o);
          n.r += _.r, n.style += _.style;
        }
      })(), n;
    }
  };
}, g = async (t) => {
  const a = await f();
  return await c.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (r, o) => {
      console.log("--hydrator [set]");
      let n = {
        r: "",
        style: ""
      };
      const s = async () => {
        for (const i of r.data?.value?.l || r.data.l) {
          const l = await await c.lib.get({ name: i.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), _ = await (await l.lib.index({
            f: {
              name: (e) => a.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await c.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => c.path.set({ src: l.src, type: i.type, name: e })
            }
          })).set({
            data: {
              curr: i
            }
          }, o);
          n.style += _.style;
        }
      };
      return await x(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await s(), n;
    }
  };
}, z = async (t) => (await f(), await c.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (a, r) => {
    console.log("--editor [set]");
    let o = {
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
    }, n = {
      r: "",
      style: ""
    };
    const s = $, i = g, l = await s({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), _ = await l.set({
      data: o.data
    });
    return (async () => {
      const e = await d.set({
        data: o.data
      }, {
        change: (y) => {
          r?.change(y);
        }
      });
      ((y) => {
        const b = document.createElement("style");
        b.innerHTML = `${e.style}`, y.appendChild(b);
      })(document.head);
    })(), n.r = _.r, n.style = `
            ${_.style}
            `, n;
  }
});
export {
  z as ce_editor,
  g as ce_hydrator,
  $ as ce_renderer
};
