const w = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t == "x" ? e : e & 3 | 8).toString(16);
  })
}), x = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), $ = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const e = t.name, r = document.getElementById(t.el_id);
      if (!r)
        throw new Error("[el_id] is invalid");
      ((n) => {
        const s = (i) => {
          ((a) => {
            const o = a.getAttribute("data-ce");
            if (!o)
              return;
            const l = JSON.parse(o).filter((u) => u?.k.startsWith("t-"));
            if (l.length != 0)
              for (const u of l) {
                const _ = u.k, h = u.v.split(" ");
                if (_ == `t-${e}-class`)
                  for (const y of h)
                    a.classList.add(y);
                else
                  for (const y of h)
                    a.classList.remove(y);
              }
          })(i);
        };
        for (const i of n.getElementsByTagName("*"))
          s(i);
        s(n);
      })(r);
    } catch (e) {
      const r = `err: [theme] ${e}`;
      throw console.log(r), r;
    }
  }
});
function g(t, e = 1e3) {
  let r = {
    cnt: 0
  };
  return new Promise((n) => {
    const s = () => {
      console.log(`[setInterval] is running.. [count=${r.cnt}]`);
      try {
        t() && (clearInterval(i), n());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${e}]`);
      }
      r.cnt += 1;
    }, i = setInterval(() => {
      s();
    }, e);
    s();
  });
}
let E = class {
  listeners = {};
  on = (e, r) => ((this.listeners[e] ||= []).push(r), () => this.off(e, r));
  off = (e, r) => {
    this.listeners[e] = this.listeners[e]?.filter((n) => n !== r);
  };
  /** Sequential execution (await each listener) */
  emit = async (e, ...r) => {
    for (const n of this.listeners[e] ?? [])
      await n(...r);
  };
  /** Parallel execution (await all listeners) */
  emitParallel = async (e, ...r) => {
    await Promise.all(
      (this.listeners[e] ?? []).map((n) => n(...r))
    );
  };
  //Error-safe emit
  emitSafe = async (e, ...r) => {
    for (const n of this.listeners[e] ?? [])
      try {
        await n(...r);
      } catch (s) {
        this.listeners.error?.forEach(
          (i) => i(s)
        );
      }
  };
};
const b = () => new E();
class k {
  startTime;
  endTime;
  isRunning;
  constructor() {
    this.startTime = 0, this.endTime = 0, this.isRunning = !1;
  }
  // Starts the timer
  start() {
    if (this.isRunning)
      throw new Error("Benchmark has already started.");
    this.startTime = performance.now(), this.isRunning = !0;
  }
  // Stops the timer and records the end time
  stop() {
    if (!this.isRunning)
      throw new Error("Benchmark hasn't started.");
    this.endTime = performance.now(), this.isRunning = !1;
  }
  // Get the result in milliseconds
  result() {
    if (this.isRunning)
      throw new Error("Benchmark is still running.");
    return {
      time_taken_ms: (this.endTime - this.startTime).toFixed(4)
    };
  }
}
console.log("content-engine-lib");
let c = {
  lib: {
    inbuilt_lib: [],
    // <any>[], // [`text`,`table`,`editor`]
    l: {},
    set: async (t) => {
      const e = t?.lib || [];
      for (const [r, n] of e.entries()) {
        const s = n, i = `${s.name}:${t.run_from}`, a = `${t.run_from}_src`;
        let o = s[a];
        const d = `${t.run_from}_src`;
        let l = t?.lazy_lib?.[d] || null;
        if (l && (l = l.replace("{*}", `${s.name}`)), console.log(`_lazy_src: ${l}`), console.log(`_src: ${o}`), c.lib.l.hasOwnProperty(`${i}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(o) && o.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${s.name}`) === -1)
            if (l)
              o = l;
            else
              throw `[lib-name=${s.name},lib-src=${o}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (o.startsWith("./") || o.startsWith("../")) {
            const u = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${o}`
            );
            c.lib.l[`${i}`] = {
              lib: u,
              src: o
            };
          }
          if (o.startsWith("http://") || o.startsWith("https://")) {
            const u = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${o}`
            );
            c.lib.l[`${i}`] = {
              lib: u,
              src: o
            };
          }
        }
      }
      console.log(await c.lib.get_all({}));
    },
    get: async (t) => {
      let e = null;
      const r = `${t.name}:${t.run_from}`;
      if (c.lib.l.hasOwnProperty(`${r}`) == !1) {
        let n = [{
          renderer_src: t.name,
          hydrator_src: t.name,
          editor_src: t.name,
          name: t.name
        }];
        try {
          ["name", "renderer", "hydrator", "editor"].indexOf(t.run_from) === -1 && (n[0][`${t.run_from}_src`] = t.name);
        } catch (s) {
          console.log(`_lib_a[0] failed to set custom run_from ${s}`);
        }
        await c.lib.set({
          lib: n,
          run_from: t.run_from,
          lazy_lib: t.lazy_lib
        });
      }
      return e = c.lib.l[`${r}`], e;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let e = "", r = "";
      const n = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (r = "/dist"), n.indexOf(t.type) !== -1)
        for (const [s, i] of n.entries()) {
          let a = s == 0 ? "" : "/";
          if (e += `${a}${i}`, i == t.type)
            return `${e}${r}${t.name}`;
        }
      else
        for (const [s, i] of n.entries()) {
          let a = s == 0 ? "" : "/";
          if (e += `${a}${i}`, i == "src")
            return `${e}${r}${t.name}`;
        }
      return `${e}${r}${t.name}`;
    }
  }
};
const p = b(), z = b(), T = p.on, N = p.emit, S = z.emit, R = z.on, I = async (t) => {
  const e = await x(), r = JSON.parse(JSON.stringify(t));
  return r.run ??= "renderer", await c.lib.set({ lib: t.lib, run_from: r.run, lazy_lib: t.lazy_lib }), {
    set: async (n) => {
      console.log("--renderer [set]"), n.return = n?.return || {}, n.return.r = n?.return?.r || "full";
      const s = new k();
      s.start();
      let i = n.data?.value?.l || n.data.l, a = {
        r: null,
        //``
        style: "",
        head: "",
        // `<test>head-1</test>`
        //set..
        //total:_l.length,
        benchmark: null
      };
      return n.return.r == "full" ? a.r = "" : a.r = [], await (async () => {
        for (const d of i) {
          const l = await await c.lib.get({ name: d.type, run_from: r.run, lazy_lib: t.lazy_lib }), _ = await (await l.lib.index({
            f: {
              name: (f) => e.f.name({ id: d.id, name: f }),
              get_lib: async (f) => await await c.lib.get({ name: f.name, run_from: f.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (f) => await (await $()).set(f),
              path: (f) => c.path.set({ src: l.src, type: d.type, name: f }),
              //set..
              uuid: () => w().set(),
              wait_until: g
            },
            //set..
            custom: t.custom
          })).set(
            {
              data: {
                curr: d
              }
            }
            /*_$cb*/
          );
          n?.return?.r == "full" ? a.r += _?.r || "" : a.r.push(_?.r || ""), a.style += _?.style || "", a.head += _?.head || "";
        }
      })(), s.stop(), a.benchmark = s.result(), a;
    }
  };
}, J = async (t) => {
  const e = JSON.parse(JSON.stringify(t));
  e.run ??= "hydrator";
  const r = await x();
  return await c.lib.set({ lib: t.lib, run_from: e.run, lazy_lib: t.lazy_lib }), {
    set: async (n) => {
      console.log("--hydrator [set]");
      const s = new k();
      s.start();
      let i = {
        r: "",
        style: ""
      }, a = {
        style_id: `${w().set()}_stl`
      }, o = n.data?.value?.l || n.data.l;
      const d = async () => {
        for (const l of o) {
          const u = await await c.lib.get({ name: l.type, run_from: e.run, lazy_lib: t.lazy_lib }), _ = u.lib, f = b(), h = f.on, y = await (await _.index({
            /**@my module can use it to set custom variables. */
            my: {},
            //NOTE: We cannot add or use any variable of this object, It's reserved for module.
            f: {
              name: (m) => r.f.name({ id: l.id, name: m }),
              get_lib: async (m) => await await c.lib.get({ name: m.name, run_from: m.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (m) => await (await $()).set(m),
              path: (m) => c.path.set({ src: u.src, type: l.type, name: m }),
              //set..
              uuid: () => w().set(),
              wait_until: g,
              //set..
              call: S,
              listen: h,
              //set..
              new_emitter: () => b()
            },
            //set..
            custom: t.custom
          })).set(
            {
              data: {
                curr: l
              }
            }
            /*_$cb*/
          );
          T("msg", async (m) => {
            try {
              if (Object.keys(m.where || {}).length == 0) {
                await f.emit("msg", m);
                return;
              }
            } catch {
            }
            try {
              if (l?.[m.where?.key || ""] == m.where?.value) {
                await f.emit("msg", m);
                return;
              }
            } catch {
            }
          }), i.style += y.style;
        }
      };
      await g(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await d();
      try {
        ((l) => {
          const u = document.getElementById(`${a.style_id}`);
          u && u.remove();
          const _ = document.createElement("style");
          _.id = `${a.style_id}`, _.innerHTML = `${i.style}`, l.appendChild(_);
        })(document.head);
      } catch (l) {
        console.log(`${l}, Failed to set style..`);
      }
      return s.stop(), {
        //style_id:_ins.style_id,
        //total:_l.length,
        benchmark: s.result()
      };
    }
  };
};
export {
  N as ce_call,
  J as ce_hydrator,
  R as ce_listen,
  I as ce_renderer
};
