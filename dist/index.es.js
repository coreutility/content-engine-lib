const w = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const n = Math.random() * 16 | 0;
    return (t == "x" ? n : n & 3 | 8).toString(16);
  })
}), m = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), x = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const n = t.name, a = document.getElementById(t.el_id);
      if (!a)
        throw new Error("[el_id] is invalid");
      ((c) => {
        const r = (o) => {
          ((i) => {
            const l = i.getAttribute("data-ce");
            if (!l)
              return;
            const e = JSON.parse(l).filter((_) => _?.k.startsWith("t-"));
            if (e.length != 0)
              for (const _ of e) {
                const y = _.k, f = _.v.split(" ");
                if (y == `t-${n}-class`)
                  for (const u of f)
                    i.classList.add(u);
                else
                  for (const u of f)
                    i.classList.remove(u);
              }
          })(o);
        };
        for (const o of c.getElementsByTagName("*"))
          r(o);
        r(c);
      })(a);
    } catch (n) {
      const a = `err: [theme] ${n}`;
      throw console.log(a), a;
    }
  }
});
function g(t, n = 1e3) {
  let a = {
    cnt: 0
  };
  return new Promise((c) => {
    const r = () => {
      console.log(`[setInterval] is running.. [count=${a.cnt}]`);
      try {
        t() && (clearInterval(o), c());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${n}]`);
      }
      a.cnt += 1;
    }, o = setInterval(() => {
      r();
    }, n);
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
      const n = t?.lib || [];
      for (const [a, c] of n.entries()) {
        const r = c, o = `${r.name}:${t.run_from}`, i = `${t.run_from}_src`;
        let l = r[i];
        const d = `${t.run_from}_src`;
        let e = t?.lazy_lib?.[d] || null;
        if (e && (e = e.replace("{*}", `${r.name}`)), console.log(`_lazy_src: ${e}`), console.log(`_src: ${l}`), s.lib.l.hasOwnProperty(`${o}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(l) && l.includes("/") == !1 && s.lib.inbuilt_lib.indexOf(`${r.name}`) === -1)
            if (e)
              l = e;
            else
              throw `[lib-name=${r.name},lib-src=${l}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (l.startsWith("./") || l.startsWith("../")) {
            const _ = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            s.lib.l[`${o}`] = {
              lib: _
            };
          }
          if (l.startsWith("http://") || l.startsWith("https://")) {
            const _ = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            s.lib.l[`${o}`] = {
              lib: _
            };
          }
        }
      }
      console.log(await s.lib.get_all({}));
    },
    get: async (t) => {
      let n = null;
      const a = `${t.name}:${t.run_from}`;
      return s.lib.l.hasOwnProperty(`${a}`) == !1 && await s.lib.set({
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
      }), n = s.lib.l[`${a}`], n;
    },
    get_all: async (t) => s.lib.l
  }
};
const h = async (t) => {
  const n = await m();
  return await s.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (a, c) => {
      console.log("--renderer [set]");
      let r = {
        r: "",
        style: ""
      };
      return await (async () => {
        for (const i of a.data?.value?.l || a.data.l) {
          const d = await (await (await (await s.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib })).lib).index({
            f: {
              name: (e) => n.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await s.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib })
            }
          })).set({
            data: {
              curr: i
            }
          }, c);
          r.r += d.r, r.style += d.style;
        }
      })(), r;
    }
  };
}, $ = async (t) => {
  const n = await m();
  return await s.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (a, c) => {
      console.log("--hydrator [set]");
      let r = {
        r: "",
        style: ""
      };
      const o = async () => {
        for (const i of a.data?.value?.l || a.data.l) {
          const d = await (await (await (await s.lib.get({ name: i.type, run_from: "hydrator", lazy_lib: t.lazy_lib })).lib).index({
            f: {
              name: (e) => n.f.name({ id: i.id, name: e }),
              get_lib: async (e) => await await s.lib.get({ name: e.name, run_from: e.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (e) => await (await x()).set(e)
            }
          })).set({
            data: {
              curr: i
            }
          }, c);
          r.style += d.style;
        }
      };
      return await g(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await o(), r;
    }
  };
}, z = async (t) => (await m(), await s.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (n, a) => {
    console.log("--editor [set]");
    let c = {
      data: {
        l: [
          {
            id: w().set(),
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
    const o = h, i = $, l = await o({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), e = await l.set({
      data: c.data
    });
    return (async () => {
      const _ = await d.set({
        data: c.data
      }, {
        change: (y) => {
          a?.change(y);
        }
      });
      ((y) => {
        const b = document.createElement("style");
        b.innerHTML = `${_.style}`, y.appendChild(b);
      })(document.head);
    })(), r.r = e.r, r.style = `
            ${e.style}
            `, r;
  }
});
export {
  z as ce_editor,
  $ as ce_hydrator,
  h as ce_renderer
};
