const g = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const r = Math.random() * 16 | 0;
    return (t == "x" ? r : r & 3 | 8).toString(16);
  })
}), u = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), w = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const r = t.name, e = document.getElementById(t.el_id);
      if (!e)
        throw new Error("[el_id] is invalid");
      ((n) => {
        const i = (a) => {
          ((c) => {
            const l = c.getAttribute("data-ce");
            if (!l)
              return;
            const s = JSON.parse(l).filter((d) => d?.k.startsWith("t-"));
            if (s.length != 0)
              for (const d of s) {
                const o = d.k, h = d.v.split(" ");
                if (o == `t-${r}-class`)
                  for (const f of h)
                    c.classList.add(f);
                else
                  for (const f of h)
                    c.classList.remove(f);
              }
          })(a);
        };
        for (const a of n.getElementsByTagName("*"))
          i(a);
        i(n);
      })(e);
    } catch (r) {
      const e = `err: [theme] ${r}`;
      throw console.log(e), e;
    }
  }
});
function p(t, r = 1e3) {
  let e = {
    cnt: 0
  };
  return new Promise((n) => {
    const i = () => {
      console.log(`[setInterval] is running.. [count=${e.cnt}]`);
      try {
        t() && (clearInterval(a), n());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${r}]`);
      }
      e.cnt += 1;
    }, a = setInterval(() => {
      i();
    }, r);
    i();
  });
}
let z = class {
  listeners = {};
  on = (r, e) => ((this.listeners[r] ||= []).push(e), () => this.off(r, e));
  off = (r, e) => {
    this.listeners[r] = this.listeners[r]?.filter((n) => n !== e);
  };
  /** Sequential execution (await each listener) */
  emit = async (r, ...e) => {
    for (const n of this.listeners[r] ?? [])
      await n(...e);
  };
  /** Parallel execution (await all listeners) */
  emitParallel = async (r, ...e) => {
    await Promise.all(
      (this.listeners[r] ?? []).map((n) => n(...e))
    );
  };
  //Error-safe emit
  emitSafe = async (r, ...e) => {
    for (const n of this.listeners[r] ?? [])
      try {
        await n(...e);
      } catch (i) {
        this.listeners.error?.forEach(
          (a) => a(i)
        );
      }
  };
};
const m = () => new z();
console.log("content-engine-lib");
let _ = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const r = t?.lib || [];
      for (const [e, n] of r.entries()) {
        const i = n, a = `${i.name}:${t.run_from}`, c = `${t.run_from}_src`;
        let l = i[c];
        const y = `${t.run_from}_src`;
        let s = t?.lazy_lib?.[y] || null;
        if (s && (s = s.replace("{*}", `${i.name}`)), console.log(`_lazy_src: ${s}`), console.log(`_src: ${l}`), _.lib.l.hasOwnProperty(`${a}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(l) && l.includes("/") == !1 && _.lib.inbuilt_lib.indexOf(`${i.name}`) === -1)
            if (s)
              l = s;
            else
              throw `[lib-name=${i.name},lib-src=${l}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (l.startsWith("./") || l.startsWith("../")) {
            const d = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            _.lib.l[`${a}`] = {
              lib: d,
              src: l
            };
          }
          if (l.startsWith("http://") || l.startsWith("https://")) {
            const d = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${l}`
            );
            _.lib.l[`${a}`] = {
              lib: d,
              src: l
            };
          }
        }
      }
      console.log(await _.lib.get_all({}));
    },
    get: async (t) => {
      let r = null;
      const e = `${t.name}:${t.run_from}`;
      return _.lib.l.hasOwnProperty(`${e}`) == !1 && await _.lib.set({
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
      }), r = _.lib.l[`${e}`], r;
    },
    get_all: async (t) => _.lib.l
  },
  path: {
    set: (t) => {
      let r = "", e = "";
      const n = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (e = "/dist"), n.indexOf(t.type) !== -1)
        for (const [i, a] of n.entries()) {
          let c = i == 0 ? "" : "/";
          if (r += `${c}${a}`, a == t.type)
            return `${r}${e}${t.name}`;
        }
      else
        for (const [i, a] of n.entries()) {
          let c = i == 0 ? "" : "/";
          if (r += `${c}${a}`, a == "src")
            return `${r}${e}${t.name}`;
        }
      return `${r}${e}${t.name}`;
    }
  }
};
const x = m(), $ = m(), k = x.on, W = x.emit, E = $.emit, C = $.on, O = async (t) => {
  const r = await u();
  return await _.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--renderer [set]");
      let n = {
        r: "",
        style: "",
        head: ""
        // `<test>head-1</test>`
      };
      return await (async () => {
        for (const a of e.data?.value?.l || e.data.l) {
          const c = await await _.lib.get({ name: a.type, run_from: "renderer", lazy_lib: t.lazy_lib }), y = await (await c.lib.index({
            f: {
              name: (s) => r.f.name({ id: a.id, name: s }),
              get_lib: async (s) => await await _.lib.get({ name: s.name, run_from: s.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (s) => await (await w()).set(s),
              path: (s) => _.path.set({ src: c.src, type: a.type, name: s })
            }
          })).set(
            {
              data: {
                curr: a
              }
            }
            /*_$cb*/
          );
          n.r += y?.r || "", n.style += y?.style || "", n.head += y?.head || "";
        }
      })(), n;
    }
  };
}, I = async (t) => {
  const r = await u();
  return await _.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--hydrator [set]");
      let n = {
        r: "",
        style: ""
      };
      const i = async () => {
        for (const a of e.data?.value?.l || e.data.l) {
          const c = await await _.lib.get({ name: a.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), l = c.lib, y = m(), s = y.on, d = await (await l.index({
            /**@my module can use it to set custom variables. */
            my: {},
            //NOTE: We cannot add or use any variable of this object, It's reserved for module.
            f: {
              name: (o) => r.f.name({ id: a.id, name: o }),
              get_lib: async (o) => await await _.lib.get({ name: o.name, run_from: o.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (o) => await (await w()).set(o),
              path: (o) => _.path.set({ src: c.src, type: a.type, name: o }),
              //set..
              call: E,
              listen: s,
              //set..
              new_emitter: () => m()
            }
          })).set(
            {
              data: {
                curr: a
              }
            }
            /*_$cb*/
          );
          k("msg", async (o) => {
            try {
              if (Object.keys(o.where || {}).length == 0) {
                await y.emit("msg", o);
                return;
              }
            } catch {
            }
            try {
              if (a?.[o.where?.key || ""] == o.where?.value) {
                await y.emit("msg", o);
                return;
              }
            } catch {
            }
          }), n.style += d.style;
        }
      };
      return await p(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await i(), n;
    }
  };
}, S = async (t) => (await u(), await _.lib.set({ lib: t.lib, run_from: "editor", lazy_lib: t.lazy_lib }), {
  set: async (r) => {
    console.log("--editor [set]");
    let e = {
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
    const i = O, a = I, c = await i({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), l = await a({
      lib: t.lib,
      lazy_lib: t.lazy_lib
    }), y = await c.set({
      data: e.data
    });
    return (async () => {
      const s = await l.set(
        {
          data: e.data
        }
        /*{
            change: (_v:any) => {
                //console.log(`--ce:editor [change]`);
                //console.log(_v);
                //send-cb..
                _$cb?.change(_v);
            }
        }*/
      );
      ((d) => {
        const o = document.createElement("style");
        o.innerHTML = `${s.style}`, d.appendChild(o);
      })(document.head);
    })(), n.r = y.r, n.style = `
            ${y.style}
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
