const m = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const n = Math.random() * 16 | 0;
    return (t == "x" ? n : n & 3 | 8).toString(16);
  })
}), d = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
});
function f(t, n = 1e3) {
  let l = {
    cnt: 0
  };
  return new Promise((o) => {
    const e = () => {
      console.log(`[setInterval] is running.. [count=${l.cnt}]`);
      try {
        t() && (clearInterval(c), o());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${n}]`);
      }
      l.cnt += 1;
    }, c = setInterval(() => {
      e();
    }, n);
    e();
  });
}
console.log("content_engine_lib");
let r = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const n = t?.lib || [];
      for (const [l, o] of n.entries()) {
        const e = o, c = `${e.name}:${t.run_from}`, s = `${t.run_from}_src`;
        let i = e[s];
        const _ = `${t.run_from}_src`;
        let a = t?.lazy_lib?.[_] || null;
        if (a && (a = a.replace("{*}", `${e.name}`)), console.log(`_lazy_src: ${a}`), console.log(`_src: ${i}`), r.lib.l.hasOwnProperty(`${c}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(i) && i.includes("/") == !1 && r.lib.inbuilt_lib.indexOf(`${e.name}`) === -1)
            if (a)
              i = a;
            else
              throw `[lib-name=${e.name},lib-src=${i}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (i.startsWith("./") || i.startsWith("../")) {
            const b = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${i}`
            );
            r.lib.l[`${c}`] = {
              lib: b
            };
          }
          if (i.startsWith("http://") || i.startsWith("https://")) {
            const b = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${i}`
            );
            r.lib.l[`${c}`] = {
              lib: b
            };
          }
        }
      }
      console.log(await r.lib.get_all({}));
    },
    get: async (t) => {
      let n = null;
      const l = `${t.name}:${t.run_from}`;
      return r.lib.l.hasOwnProperty(`${l}`) == !1 && await r.lib.set({
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
      }), n = r.lib.l[`${l}`], n;
    },
    get_all: async (t) => r.lib.l
  }
};
const x = async (t) => {
  const n = await d();
  return await r.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (l, o) => {
      console.log("--renderer [set]");
      let e = {
        r: "",
        style: ""
      };
      return await (async () => {
        for (const s of l.data?.value?.l || l.data.l) {
          const _ = await (await (await (await r.lib.get({ name: s.type, run_from: "renderer", lazy_lib: t.lazy_lib })).lib).index({
            f: {
              name: (a) => n.f.name({ id: s.id, name: a }),
              get_lib: async (a) => await await r.lib.get({ name: a.name, run_from: a.run_from, lazy_lib: t.lazy_lib })
            }
          })).set({
            data: {
              curr: s
            }
          }, o);
          e.r += _.r, e.style += _.style;
        }
      })(), e;
    }
  };
}, w = async (t) => {
  const n = await d();
  return await r.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (l, o) => {
      console.log("--hydrator [set]");
      let e = {
        r: "",
        style: ""
      };
      const c = async () => {
        for (const s of l.data?.value?.l || l.data.l) {
          const _ = await (await (await (await r.lib.get({ name: s.type, run_from: "hydrator", lazy_lib: t.lazy_lib })).lib).index({
            f: {
              name: (a) => n.f.name({ id: s.id, name: a }),
              get_lib: async (a) => await await r.lib.get({ name: a.name, run_from: a.run_from, lazy_lib: t.lazy_lib })
            }
          })).set({
            data: {
              curr: s
            }
          }, o);
          e.style += _.style;
        }
      };
      return await f(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await c(), e;
    }
  };
}, g = async (t) => (await d(), await r.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (n, l) => {
    console.log("--editor [set]");
    let o = {
      data: {
        l: [
          {
            id: m().set(),
            type: "editor",
            data: {
              l: []
            }
          }
        ]
      }
    }, e = {
      r: "",
      style: ""
    };
    const c = x, s = w, i = await c({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), _ = await s({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), a = await i.set({
      data: o.data
    });
    return (async () => {
      const b = await _.set({
        data: o.data
      }, {
        change: (y) => {
          l?.change(y);
        }
      });
      ((y) => {
        const u = document.createElement("style");
        u.innerHTML = `${b.style}`, y.appendChild(u);
      })(document.head);
    })(), e.r = a.r, e.style = `
            ${a.style}
            `, e;
  }
});
export {
  g as ce_editor,
  w as ce_hydrator,
  x as ce_renderer
};
