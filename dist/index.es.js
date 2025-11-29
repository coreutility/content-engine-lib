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
      const a = t.name, n = document.getElementById(t.el_id);
      if (!n)
        throw new Error("[el_id] is invalid");
      ((_) => {
        const r = (s) => {
          ((i) => {
            const l = i.getAttribute("data-ce");
            if (!l)
              return;
            const o = JSON.parse(l).filter((e) => e?.k.startsWith("t-"));
            if (o.length != 0)
              for (const e of o) {
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
        for (const s of _.getElementsByTagName("*"))
          r(s);
        r(_);
      })(n);
    } catch (a) {
      const n = `err: [theme] ${a}`;
      throw console.log(n), n;
    }
  }
});
function x(t, a = 1e3) {
  let n = {
    cnt: 0
  };
  return new Promise((_) => {
    const r = () => {
      console.log(`[setInterval] is running.. [count=${n.cnt}]`);
      try {
        t() && (clearInterval(s), _());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${a}]`);
      }
      n.cnt += 1;
    }, s = setInterval(() => {
      r();
    }, a);
    r();
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
      for (const [n, _] of a.entries()) {
        const r = _, s = `${r.name}:${t.run_from}`, i = `${t.run_from}_src`;
        let l = r[i];
        const d = `${t.run_from}_src`;
        let o = t?.lazy_lib?.[d] || null;
        if (o && (o = o.replace("{*}", `${r.name}`)), console.log(`_lazy_src: ${o}`), console.log(`_src: ${l}`), c.lib.l.hasOwnProperty(`${s}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(l) && l.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${r.name}`) === -1)
            if (o)
              l = o;
            else
              throw `[lib-name=${r.name},lib-src=${l}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
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
      const n = `${t.name}:${t.run_from}`;
      return c.lib.l.hasOwnProperty(`${n}`) == !1 && await c.lib.set({
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
      }), a = c.lib.l[`${n}`], a;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let a = "", n = "";
      const _ = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (n = "/dist"), _.indexOf(t.type) !== -1)
        for (const [r, s] of _.entries()) {
          let i = r == 0 ? "" : "/";
          if (a += `${i}${s}`, s == t.type)
            return `${a}${n}${t.name}`;
        }
      else
        for (const [r, s] of _.entries()) {
          let i = r == 0 ? "" : "/";
          if (a += `${i}${s}`, s == "src")
            return `${a}${n}${t.name}`;
        }
      return `${a}${n}${t.name}`;
    }
  }
};
const $ = async (t) => {
  const a = await f();
  return await c.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (n, _) => {
      console.log("--renderer [set]");
      let r = {
        r: "",
        style: "",
        head: ""
        // `<test>head-1</test>`
      };
      return await (async () => {
        for (const i of n.data?.value?.l || n.data.l) {
          const l = await await c.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), o = await (await l.lib.index({
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
          }, _);
          r.r += o?.r || "", r.style += o?.style || "", r.head += o?.head || "";
        }
      })(), r;
    }
  };
}, g = async (t) => {
  const a = await f();
  return await c.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (n, _) => {
      console.log("--hydrator [set]");
      let r = {
        r: "",
        style: ""
      };
      const s = async () => {
        for (const i of n.data?.value?.l || n.data.l) {
          const l = await await c.lib.get({ name: i.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), o = await (await l.lib.index({
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
          }, _);
          r.style += o.style;
        }
      };
      return await x(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await s(), r;
    }
  };
}, z = async (t) => (await f(), await c.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (a, n) => {
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
    const s = $, i = g, l = await s({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), o = await l.set({
      data: _.data
    });
    return (async () => {
      const e = await d.set({
        data: _.data
      }, {
        change: (y) => {
          n?.change(y);
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
  g as ce_hydrator,
  $ as ce_renderer
};
