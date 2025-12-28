const g = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t == "x" ? e : e & 3 | 8).toString(16);
  })
}), h = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), w = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const e = t.name, r = document.getElementById(t.el_id);
      if (!r)
        throw new Error("[el_id] is invalid");
      ((a) => {
        const n = (o) => {
          ((i) => {
            const s = i.getAttribute("data-ce");
            if (!s)
              return;
            const c = JSON.parse(s).filter((l) => l?.k.startsWith("t-"));
            if (c.length != 0)
              for (const l of c) {
                const m = l.k, y = l.v.split(" ");
                if (m == `t-${e}-class`)
                  for (const u of y)
                    i.classList.add(u);
                else
                  for (const u of y)
                    i.classList.remove(u);
              }
          })(o);
        };
        for (const o of a.getElementsByTagName("*"))
          n(o);
        n(a);
      })(r);
    } catch (e) {
      const r = `err: [theme] ${e}`;
      throw console.log(r), r;
    }
  }
});
function p(t, e = 1e3) {
  let r = {
    cnt: 0
  };
  return new Promise((a) => {
    const n = () => {
      console.log(`[setInterval] is running.. [count=${r.cnt}]`);
      try {
        t() && (clearInterval(o), a());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${e}]`);
      }
      r.cnt += 1;
    }, o = setInterval(() => {
      n();
    }, e);
    n();
  });
}
let z = class {
  listeners = {};
  on = (e, r) => ((this.listeners[e] ||= []).push(r), () => this.off(e, r));
  off = (e, r) => {
    this.listeners[e] = this.listeners[e]?.filter((a) => a !== r);
  };
  /** Sequential execution (await each listener) */
  emit = async (e, ...r) => {
    for (const a of this.listeners[e] ?? [])
      await a(...r);
  };
  /** Parallel execution (await all listeners) */
  emitParallel = async (e, ...r) => {
    await Promise.all(
      (this.listeners[e] ?? []).map((a) => a(...r))
    );
  };
  //Error-safe emit
  emitSafe = async (e, ...r) => {
    for (const a of this.listeners[e] ?? [])
      try {
        await a(...r);
      } catch (n) {
        this.listeners.error?.forEach(
          (o) => o(n)
        );
      }
  };
};
const b = () => new z();
console.log("content_engine_lib");
let _ = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const e = t?.lib || [];
      for (const [r, a] of e.entries()) {
        const n = a, o = `${n.name}:${t.run_from}`, i = `${t.run_from}_src`;
        let s = n[i];
        const d = `${t.run_from}_src`;
        let c = t?.lazy_lib?.[d] || null;
        if (c && (c = c.replace("{*}", `${n.name}`)), console.log(`_lazy_src: ${c}`), console.log(`_src: ${s}`), _.lib.l.hasOwnProperty(`${o}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(s) && s.includes("/") == !1 && _.lib.inbuilt_lib.indexOf(`${n.name}`) === -1)
            if (c)
              s = c;
            else
              throw `[lib-name=${n.name},lib-src=${s}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (s.startsWith("./") || s.startsWith("../")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${s}`
            );
            _.lib.l[`${o}`] = {
              lib: l,
              src: s
            };
          }
          if (s.startsWith("http://") || s.startsWith("https://")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${s}`
            );
            _.lib.l[`${o}`] = {
              lib: l,
              src: s
            };
          }
        }
      }
      console.log(await _.lib.get_all({}));
    },
    get: async (t) => {
      let e = null;
      const r = `${t.name}:${t.run_from}`;
      return _.lib.l.hasOwnProperty(`${r}`) == !1 && await _.lib.set({
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
      }), e = _.lib.l[`${r}`], e;
    },
    get_all: async (t) => _.lib.l
  },
  path: {
    set: (t) => {
      let e = "", r = "";
      const a = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (r = "/dist"), a.indexOf(t.type) !== -1)
        for (const [n, o] of a.entries()) {
          let i = n == 0 ? "" : "/";
          if (e += `${i}${o}`, o == t.type)
            return `${e}${r}${t.name}`;
        }
      else
        for (const [n, o] of a.entries()) {
          let i = n == 0 ? "" : "/";
          if (e += `${i}${o}`, o == "src")
            return `${e}${r}${t.name}`;
        }
      return `${e}${r}${t.name}`;
    }
  }
};
const x = b(), $ = b(), k = x.on, W = x.emit, E = $.emit, C = $.on, O = async (t) => {
  const e = await h();
  return await _.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (r, a) => {
      console.log("--renderer [set]");
      let n = {
        r: "",
        style: "",
        head: ""
        // `<test>head-1</test>`
      };
      return await (async () => {
        for (const i of r.data?.value?.l || r.data.l) {
          const s = await await _.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), c = await (await s.lib.index({
            f: {
              name: (l) => e.f.name({ id: i.id, name: l }),
              get_lib: async (l) => await await _.lib.get({ name: l.name, run_from: l.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (l) => await (await w()).set(l),
              path: (l) => _.path.set({ src: s.src, type: i.type, name: l })
            }
          })).set({
            data: {
              curr: i
            }
          }, a);
          n.r += c?.r || "", n.style += c?.style || "", n.head += c?.head || "";
        }
      })(), n;
    }
  };
}, I = async (t) => {
  const e = await h();
  return await _.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (r, a) => {
      console.log("--hydrator [set]");
      let n = {
        r: "",
        style: ""
      };
      const o = async () => {
        for (const i of r.data?.value?.l || r.data.l) {
          const s = await await _.lib.get({ name: i.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), d = s.lib, c = b(), l = c.on, m = b(), f = await (await d.index({
            f: {
              name: (y) => e.f.name({ id: i.id, name: y }),
              get_lib: async (y) => await await _.lib.get({ name: y.name, run_from: y.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (y) => await (await w()).set(y),
              path: (y) => _.path.set({ src: s.src, type: i.type, name: y }),
              //set..
              call: E,
              listen: l,
              //set..
              emitter: m
            }
          })).set({
            data: {
              curr: i
            }
          }, a);
          k("msg", async (y) => {
            try {
              if (Object.keys(y.where || {}).length == 0) {
                await c.emit("msg", y);
                return;
              }
            } catch {
            }
            try {
              if (i?.[y.where?.key || ""] == y.where?.value) {
                await c.emit("msg", y);
                return;
              }
            } catch {
            }
          }), n.style += f.style;
        }
      };
      return await p(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await o(), n;
    }
  };
}, S = async (t) => (await h(), await _.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (e, r) => {
    console.log("--editor [set]");
    let a = {
      data: {
        l: [
          {
            id: g().set(),
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
    const o = O, i = I, s = await o({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), d = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), c = await s.set({
      data: a.data
    });
    return (async () => {
      const l = await d.set({
        data: a.data
      }, {
        change: (m) => {
          r?.change(m);
        }
      });
      ((m) => {
        const f = document.createElement("style");
        f.innerHTML = `${l.style}`, m.appendChild(f);
      })(document.head);
    })(), n.r = c.r, n.style = `
            ${c.style}
            `, n;
  }
});
export {
  W as ce_call,
  S as ce_editor,
  I as ce_hydrator,
  C as ce_listen,
  O as ce_renderer
};
