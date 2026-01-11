const y = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const r = Math.random() * 16 | 0;
    return (t == "x" ? r : r & 3 | 8).toString(16);
  })
}), x = async () => ({
  f: {
    name: (t) => `${t.name}${t.id}`
  }
}), g = async () => ({
  set: async (t) => {
    console.log("--theme");
    try {
      if (!t.el_id)
        throw new Error("[el_id] is required");
      const r = t.name, e = document.getElementById(t.el_id);
      if (!e)
        throw new Error("[el_id] is invalid");
      ((s) => {
        const a = (n) => {
          ((f) => {
            const i = f.getAttribute("data-ce");
            if (!i)
              return;
            const u = JSON.parse(i).filter((l) => l?.k.startsWith("t-"));
            if (u.length != 0)
              for (const l of u) {
                const _ = l.k, d = l.v.split(" ");
                if (_ == `t-${r}-class`)
                  for (const o of d)
                    f.classList.add(o);
                else
                  for (const o of d)
                    f.classList.remove(o);
              }
          })(n);
        };
        for (const n of s.getElementsByTagName("*"))
          a(n);
        a(s);
      })(e);
    } catch (r) {
      const e = `err: [theme] ${r}`;
      throw console.log(e), e;
    }
  }
});
function b(t, r = 1e3) {
  let e = {
    cnt: 0
  };
  return new Promise((s) => {
    const a = () => {
      console.log(`[setInterval] is running.. [count=${e.cnt}]`);
      try {
        t() && (clearInterval(n), s());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${r}]`);
      }
      e.cnt += 1;
    }, n = setInterval(() => {
      a();
    }, r);
    a();
  });
}
let E = class {
  listeners = {};
  on = (r, e) => ((this.listeners[r] ||= []).push(e), () => this.off(r, e));
  off = (r, e) => {
    this.listeners[r] = this.listeners[r]?.filter((s) => s !== e);
  };
  /** Sequential execution (await each listener) */
  emit = async (r, ...e) => {
    for (const s of this.listeners[r] ?? [])
      await s(...e);
  };
  /** Parallel execution (await all listeners) */
  emitParallel = async (r, ...e) => {
    await Promise.all(
      (this.listeners[r] ?? []).map((s) => s(...e))
    );
  };
  //Error-safe emit
  emitSafe = async (r, ...e) => {
    for (const s of this.listeners[r] ?? [])
      try {
        await s(...e);
      } catch (a) {
        this.listeners.error?.forEach(
          (n) => n(a)
        );
      }
  };
};
const h = () => new E();
class $ {
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
      const r = t?.lib || [];
      for (const [e, s] of r.entries()) {
        const a = s, n = `${a.name}:${t.run_from}`, f = `${t.run_from}_src`;
        let i = a[f];
        const m = `${t.run_from}_src`;
        let u = t?.lazy_lib?.[m] || null;
        if (u && (u = u.replace("{*}", `${a.name}`)), console.log(`_lazy_src: ${u}`), console.log(`_src: ${i}`), c.lib.l.hasOwnProperty(`${n}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(i) && i.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${a.name}`) === -1)
            if (u)
              i = u;
            else
              throw `[lib-name=${a.name},lib-src=${i}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (i.startsWith("./") || i.startsWith("../")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${i}`
            );
            c.lib.l[`${n}`] = {
              lib: l,
              src: i
            };
          }
          if (i.startsWith("http://") || i.startsWith("https://")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${i}`
            );
            c.lib.l[`${n}`] = {
              lib: l,
              src: i
            };
          }
        }
      }
      console.log(await c.lib.get_all({}));
    },
    get: async (t) => {
      let r = null;
      const e = `${t.name}:${t.run_from}`;
      return c.lib.l.hasOwnProperty(`${e}`) == !1 && await c.lib.set({
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
      }), r = c.lib.l[`${e}`], r;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let r = "", e = "";
      const s = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (e = "/dist"), s.indexOf(t.type) !== -1)
        for (const [a, n] of s.entries()) {
          let f = a == 0 ? "" : "/";
          if (r += `${f}${n}`, n == t.type)
            return `${r}${e}${t.name}`;
        }
      else
        for (const [a, n] of s.entries()) {
          let f = a == 0 ? "" : "/";
          if (r += `${f}${n}`, n == "src")
            return `${r}${e}${t.name}`;
        }
      return `${r}${e}${t.name}`;
    }
  }
};
const p = h(), k = h(), T = p.on, R = p.emit, O = k.emit, I = k.on, P = async (t) => {
  const r = await x();
  return await c.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--renderer [set]"), e.return = e?.return || {}, e.return.r = e?.return?.r || "full";
      const s = new $();
      s.start();
      let a = e.data?.value?.l || e.data.l, n = {
        r: null,
        //``
        style: "",
        head: "",
        // `<test>head-1</test>`
        //set..
        //total:_l.length,
        benchmark: null
      };
      return e.return.r == "full" ? n.r = "" : n.r = [], await (async () => {
        for (const i of a) {
          const m = await await c.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), l = await (await m.lib.index({
            f: {
              name: (_) => r.f.name({ id: i.id, name: _ }),
              get_lib: async (_) => await await c.lib.get({ name: _.name, run_from: _.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (_) => await (await g()).set(_),
              path: (_) => c.path.set({ src: m.src, type: i.type, name: _ }),
              //set..
              uuid: () => y().set(),
              wait_until: b
            }
          })).set(
            {
              data: {
                curr: i
              }
            }
            /*_$cb*/
          );
          e?.return?.r == "full" ? n.r += l?.r || "" : n.r.push(l?.r || ""), n.style += l?.style || "", n.head += l?.head || "";
        }
      })(), s.stop(), n.benchmark = s.result(), n;
    }
  };
}, W = async (t) => {
  const r = await x();
  return await c.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--hydrator [set]");
      const s = new $();
      s.start();
      let a = {
        r: "",
        style: ""
      }, n = {
        style_id: `${y().set()}_stl`
      }, f = e.data?.value?.l || e.data.l;
      const i = async () => {
        for (const m of f) {
          const u = await await c.lib.get({ name: m.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), l = u.lib, _ = h(), w = _.on, d = await (await l.index({
            /**@my module can use it to set custom variables. */
            my: {},
            //NOTE: We cannot add or use any variable of this object, It's reserved for module.
            f: {
              name: (o) => r.f.name({ id: m.id, name: o }),
              get_lib: async (o) => await await c.lib.get({ name: o.name, run_from: o.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (o) => await (await g()).set(o),
              path: (o) => c.path.set({ src: u.src, type: m.type, name: o }),
              //set..
              uuid: () => y().set(),
              wait_until: b,
              //set..
              call: O,
              listen: w,
              //set..
              new_emitter: () => h()
            }
          })).set(
            {
              data: {
                curr: m
              }
            }
            /*_$cb*/
          );
          T("msg", async (o) => {
            try {
              if (Object.keys(o.where || {}).length == 0) {
                await _.emit("msg", o);
                return;
              }
            } catch {
            }
            try {
              if (m?.[o.where?.key || ""] == o.where?.value) {
                await _.emit("msg", o);
                return;
              }
            } catch {
            }
          }), a.style += d.style;
        }
      };
      await b(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await i();
      try {
        ((m) => {
          const u = document.getElementById(`${n.style_id}`);
          u && u.remove();
          const l = document.createElement("style");
          l.id = `${n.style_id}`, l.innerHTML = `${a.style}`, m.appendChild(l);
        })(document.head);
      } catch (m) {
        console.log(`${m}, Failed to set style..`);
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
  R as ce_call,
  W as ce_hydrator,
  I as ce_listen,
  P as ce_renderer
};
