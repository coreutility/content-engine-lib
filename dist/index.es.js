const h = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const n = Math.random() * 16 | 0;
    return (t == "x" ? n : n & 3 | 8).toString(16);
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
      const n = t.name, a = document.getElementById(t.el_id);
      if (!a)
        throw new Error("[el_id] is invalid");
      ((c) => {
        const r = (i) => {
          ((s) => {
            const l = s.getAttribute("data-ce");
            if (!l)
              return;
            const _ = JSON.parse(l).filter((e) => e?.k.startsWith("t-"));
            if (_.length != 0)
              for (const e of _) {
                const y = e.k, m = e.v.split(" ");
                if (y == `t-${n}-class`)
                  for (const u of m)
                    s.classList.add(u);
                else
                  for (const u of m)
                    s.classList.remove(u);
              }
          })(i);
        };
        for (const i of c.getElementsByTagName("*"))
          r(i);
        r(c);
      })(a);
    } catch (n) {
      const a = `err: [theme] ${n}`;
      throw console.log(a), a;
    }
  }
});
function x(t, n = 1e3) {
  let a = {
    cnt: 0
  };
  return new Promise((c) => {
    const r = () => {
      console.log(`[setInterval] is running.. [count=${a.cnt}]`);
      try {
        t() && (clearInterval(i), c());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${n}]`);
      }
      a.cnt += 1;
    }, i = setInterval(() => {
      r();
    }, n);
    r();
  });
}
console.log("content_engine_lib");
let o = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const n = t?.lib || [];
      for (const [a, c] of n.entries()) {
        const r = c, i = `${r.name}:${t.run_from}`, s = `${t.run_from}_src`;
        let l = r[s];
        const d = `${t.run_from}_src`;
        let _ = t?.lazy_lib?.[d] || null;
        if (_ && (_ = _.replace("{*}", `${r.name}`)), console.log(`_lazy_src: ${_}`), console.log(`_src: ${l}`), o.lib.l.hasOwnProperty(`${i}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(l) && l.includes("/") == !1 && o.lib.inbuilt_lib.indexOf(`${r.name}`) === -1)
            if (_)
              l = _;
            else
              throw `[lib-name=${r.name},lib-src=${l}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (l.startsWith("./") || l.startsWith("../")) {
            const e = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            o.lib.l[`${i}`] = {
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
            o.lib.l[`${i}`] = {
              lib: e,
              src: l
            };
          }
        }
      }
      console.log(await o.lib.get_all({}));
    },
    get: async (t) => {
      let n = null;
      const a = `${t.name}:${t.run_from}`;
      return o.lib.l.hasOwnProperty(`${a}`) == !1 && await o.lib.set({
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
      }), n = o.lib.l[`${a}`], n;
    },
    get_all: async (t) => o.lib.l
  },
  path: {
    set: (t) => {
      let n = "";
      const a = t.src.split("/");
      if (a.indexOf(t.type) !== -1)
        for (const [c, r] of a.entries()) {
          let i = c == 0 ? "" : "/";
          if (n += `${i}${r}`, r == t.type)
            return `${n}${t.name}`;
        }
      else
        for (const [c, r] of a.entries()) {
          let i = c == 0 ? "" : "/";
          if (n += `${i}${r}`, r == "src")
            return `${n}${t.name}`;
        }
      return `${n}${t.name}`;
    }
  }
};
const $ = async (t) => {
  const n = await f();
  return await o.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (a, c) => {
      console.log("--renderer [set]");
      let r = {
        r: "",
        style: ""
      };
      return await (async () => {
        for (const s of a.data?.value?.l || a.data.l) {
          const l = await await o.lib.get({ name: s.type, run_from: "renderer", lazy_lib: t.lazy_lib }), _ = await (await l.lib.index({
            f: {
              name: (e) => n.f.name({ id: s.id, name: e }),
              get_lib: async (e) => await await o.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => o.path.set({ src: l.src, type: s.type, name: e })
            }
          })).set({
            data: {
              curr: s
            }
          }, c);
          r.r += _.r, r.style += _.style;
        }
      })(), r;
    }
  };
}, g = async (t) => {
  const n = await f();
  return await o.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (a, c) => {
      console.log("--hydrator [set]");
      let r = {
        r: "",
        style: ""
      };
      const i = async () => {
        for (const s of a.data?.value?.l || a.data.l) {
          const l = await await o.lib.get({ name: s.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), _ = await (await l.lib.index({
            f: {
              name: (e) => n.f.name({ id: s.id, name: e }),
              get_lib: async (e) => await await o.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await w()).set(e),
              path: (e) => o.path.set({ src: l.src, type: s.type, name: e })
            }
          })).set({
            data: {
              curr: s
            }
          }, c);
          r.style += _.style;
        }
      };
      return await x(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await i(), r;
    }
  };
}, z = async (t) => (await f(), await o.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (n, a) => {
    console.log("--editor [set]");
    let c = {
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
    const i = $, s = g, l = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await s({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), _ = await l.set({
      data: c.data
    });
    return (async () => {
      const e = await d.set({
        data: c.data
      }, {
        change: (y) => {
          a?.change(y);
        }
      });
      ((y) => {
        const b = document.createElement("style");
        b.innerHTML = `${e.style}`, y.appendChild(b);
      })(document.head);
    })(), r.r = _.r, r.style = `
            ${_.style}
            `, r;
  }
});
export {
  z as ce_editor,
  g as ce_hydrator,
  $ as ce_renderer
};
