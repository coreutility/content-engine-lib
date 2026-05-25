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
      ((n) => {
        const i = (s) => {
          ((d) => {
            const a = d.getAttribute("data-ce");
            if (!a)
              return;
            const u = JSON.parse(a).filter((l) => l?.k.startsWith("t-"));
            if (u.length != 0)
              for (const l of u) {
                const f = l.k, _ = l.v.split(" ");
                if (f == `t-${r}-class`)
                  for (const o of _)
                    d.classList.add(o);
                else
                  for (const o of _)
                    d.classList.remove(o);
              }
          })(s);
        };
        for (const s of n.getElementsByTagName("*"))
          i(s);
        i(n);
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
  return new Promise((n) => {
    const i = () => {
      console.log(`[setInterval] is running.. [count=${e.cnt}]`);
      try {
        t() && (clearInterval(s), n());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${r}]`);
      }
      e.cnt += 1;
    }, s = setInterval(() => {
      i();
    }, r);
    i();
  });
}
let T = class {
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
          (s) => s(i)
        );
      }
  };
};
const h = () => new T();
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
      for (const [e, n] of r.entries()) {
        const i = n, s = `${i.name}:${t.run_from}`, d = `${t.run_from}_src`;
        let a = i[d];
        const m = `${t.run_from}_src`;
        let u = t?.lazy_lib?.[m] || null;
        if (u && (u = u.replace("{*}", `${i.name}`)), console.log(`_lazy_src: ${u}`), console.log(`_src: ${a}`), c.lib.l.hasOwnProperty(`${s}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(a) && a.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${i.name}`) === -1)
            if (u)
              a = u;
            else
              throw `[lib-name=${i.name},lib-src=${a}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (a.startsWith("./") || a.startsWith("../")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${a}`
            );
            c.lib.l[`${s}`] = {
              lib: l,
              src: a
            };
          }
          if (a.startsWith("http://") || a.startsWith("https://")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${a}`
            );
            c.lib.l[`${s}`] = {
              lib: l,
              src: a
            };
          }
        }
      }
      console.log(await c.lib.get_all({}));
    },
    get: async (t) => {
      let r = null;
      const e = `${t.name}:${t.run_from}`;
      if (c.lib.l.hasOwnProperty(`${e}`) == !1) {
        let n = [{
          renderer_src: t.name,
          hydrator_src: t.name,
          editor_src: t.name,
          name: t.name
        }];
        try {
          ["name", "renderer", "hydrator", "editor"].indexOf(t.run_from) === -1 && (n[0][`${t.run_from}_src`] = t.name);
        } catch (i) {
          console.log(`_lib_a[0] failed to set custom run_from ${i}`);
        }
        await c.lib.set({
          lib: n,
          run_from: t.run_from,
          lazy_lib: t.lazy_lib
        });
      }
      return r = c.lib.l[`${e}`], r;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let r = "", e = "";
      const n = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (e = "/dist"), n.indexOf(t.type) !== -1)
        for (const [i, s] of n.entries()) {
          let d = i == 0 ? "" : "/";
          if (r += `${d}${s}`, s == t.type)
            return `${r}${e}${t.name}`;
        }
      else
        for (const [i, s] of n.entries()) {
          let d = i == 0 ? "" : "/";
          if (r += `${d}${s}`, s == "src")
            return `${r}${e}${t.name}`;
        }
      return `${r}${e}${t.name}`;
    }
  }
};
const k = h(), z = h(), p = k.on, R = k.emit, O = z.emit, I = z.on, P = async (t) => {
  const r = await x();
  return t.run || (t.run = "renderer"), await c.lib.set({ lib: t.lib, run_from: t.run, lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--renderer [set]"), e.return = e?.return || {}, e.return.r = e?.return?.r || "full";
      const n = new $();
      n.start();
      let i = e.data?.value?.l || e.data.l, s = {
        r: null,
        //``
        style: "",
        head: "",
        // `<test>head-1</test>`
        //set..
        //total:_l.length,
        benchmark: null
      };
      return e.return.r == "full" ? s.r = "" : s.r = [], await (async () => {
        for (const a of i) {
          const m = await await c.lib.get({ name: a.type, run_from: t.run, lazy_lib: t.lazy_lib }), l = await (await m.lib.index({
            f: {
              name: (f) => r.f.name({ id: a.id, name: f }),
              get_lib: async (f) => await await c.lib.get({ name: f.name, run_from: f.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (f) => await (await g()).set(f),
              path: (f) => c.path.set({ src: m.src, type: a.type, name: f }),
              //set..
              uuid: () => y().set(),
              wait_until: b
            }
          })).set(
            {
              data: {
                curr: a
              }
            }
            /*_$cb*/
          );
          e?.return?.r == "full" ? s.r += l?.r || "" : s.r.push(l?.r || ""), s.style += l?.style || "", s.head += l?.head || "";
        }
      })(), n.stop(), s.benchmark = n.result(), s;
    }
  };
}, W = async (t) => {
  t.run || (t.run = "hydrator");
  const r = await x();
  return await c.lib.set({ lib: t.lib, run_from: t.run, lazy_lib: t.lazy_lib }), {
    set: async (e) => {
      console.log("--hydrator [set]");
      const n = new $();
      n.start();
      let i = {
        r: "",
        style: ""
      }, s = {
        style_id: `${y().set()}_stl`
      }, d = e.data?.value?.l || e.data.l;
      const a = async () => {
        for (const m of d) {
          const u = await await c.lib.get({ name: m.type, run_from: t.run, lazy_lib: t.lazy_lib }), l = u.lib, f = h(), w = f.on, _ = await (await l.index({
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
          p("msg", async (o) => {
            try {
              if (Object.keys(o.where || {}).length == 0) {
                await f.emit("msg", o);
                return;
              }
            } catch {
            }
            try {
              if (m?.[o.where?.key || ""] == o.where?.value) {
                await f.emit("msg", o);
                return;
              }
            } catch {
            }
          }), i.style += _.style;
        }
      };
      await b(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await a();
      try {
        ((m) => {
          const u = document.getElementById(`${s.style_id}`);
          u && u.remove();
          const l = document.createElement("style");
          l.id = `${s.style_id}`, l.innerHTML = `${i.style}`, m.appendChild(l);
        })(document.head);
      } catch (m) {
        console.log(`${m}, Failed to set style..`);
      }
      return n.stop(), {
        //style_id:_ins.style_id,
        //total:_l.length,
        benchmark: n.result()
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
