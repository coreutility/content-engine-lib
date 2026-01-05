const y = () => ({
  set: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t == "x" ? e : e & 3 | 8).toString(16);
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
      const e = t.name, n = document.getElementById(t.el_id);
      if (!n)
        throw new Error("[el_id] is invalid");
      ((r) => {
        const a = (s) => {
          ((d) => {
            const i = d.getAttribute("data-ce");
            if (!i)
              return;
            const m = JSON.parse(i).filter((l) => l?.k.startsWith("t-"));
            if (m.length != 0)
              for (const l of m) {
                const u = l.k, f = l.v.split(" ");
                if (u == `t-${e}-class`)
                  for (const o of f)
                    d.classList.add(o);
                else
                  for (const o of f)
                    d.classList.remove(o);
              }
          })(s);
        };
        for (const s of r.getElementsByTagName("*"))
          a(s);
        a(r);
      })(n);
    } catch (e) {
      const n = `err: [theme] ${e}`;
      throw console.log(n), n;
    }
  }
});
function b(t, e = 1e3) {
  let n = {
    cnt: 0
  };
  return new Promise((r) => {
    const a = () => {
      console.log(`[setInterval] is running.. [count=${n.cnt}]`);
      try {
        t() && (clearInterval(s), r());
      } catch {
        console.log(`warn: [wait_until] ignoring the exception in setInterval and will check again after [interval=${e}]`);
      }
      n.cnt += 1;
    }, s = setInterval(() => {
      a();
    }, e);
    a();
  });
}
let E = class {
  listeners = {};
  on = (e, n) => ((this.listeners[e] ||= []).push(n), () => this.off(e, n));
  off = (e, n) => {
    this.listeners[e] = this.listeners[e]?.filter((r) => r !== n);
  };
  /** Sequential execution (await each listener) */
  emit = async (e, ...n) => {
    for (const r of this.listeners[e] ?? [])
      await r(...n);
  };
  /** Parallel execution (await all listeners) */
  emitParallel = async (e, ...n) => {
    await Promise.all(
      (this.listeners[e] ?? []).map((r) => r(...n))
    );
  };
  //Error-safe emit
  emitSafe = async (e, ...n) => {
    for (const r of this.listeners[e] ?? [])
      try {
        await r(...n);
      } catch (a) {
        this.listeners.error?.forEach(
          (s) => s(a)
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
      const e = t?.lib || [];
      for (const [n, r] of e.entries()) {
        const a = r, s = `${a.name}:${t.run_from}`, d = `${t.run_from}_src`;
        let i = a[d];
        const _ = `${t.run_from}_src`;
        let m = t?.lazy_lib?.[_] || null;
        if (m && (m = m.replace("{*}", `${a.name}`)), console.log(`_lazy_src: ${m}`), console.log(`_src: ${i}`), c.lib.l.hasOwnProperty(`${s}`) == !1) {
          if (/^[a-zA-Z0-9]/.test(i) && i.includes("/") == !1 && c.lib.inbuilt_lib.indexOf(`${a.name}`) === -1)
            if (m)
              i = m;
            else
              throw `[lib-name=${a.name},lib-src=${i}] not allowed or available in in-build mode. Need to use lazy-lib config.`;
          if (i.startsWith("./") || i.startsWith("../")) {
            const l = await import(
              /* @vite-ignore */
              /* webpackIgnore: true */
              `${i}`
            );
            c.lib.l[`${s}`] = {
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
            c.lib.l[`${s}`] = {
              lib: l,
              src: i
            };
          }
        }
      }
      console.log(await c.lib.get_all({}));
    },
    get: async (t) => {
      let e = null;
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
      }), e = c.lib.l[`${n}`], e;
    },
    get_all: async (t) => c.lib.l
  },
  path: {
    set: (t) => {
      let e = "", n = "";
      const r = t.src.split("/");
      if (t.src.indexOf("://localhost") !== -1 || t.src.indexOf("://127.0.0.1") !== -1 || (n = "/dist"), r.indexOf(t.type) !== -1)
        for (const [a, s] of r.entries()) {
          let d = a == 0 ? "" : "/";
          if (e += `${d}${s}`, s == t.type)
            return `${e}${n}${t.name}`;
        }
      else
        for (const [a, s] of r.entries()) {
          let d = a == 0 ? "" : "/";
          if (e += `${d}${s}`, s == "src")
            return `${e}${n}${t.name}`;
        }
      return `${e}${n}${t.name}`;
    }
  }
};
const p = h(), k = h(), T = p.on, R = p.emit, O = k.emit, I = k.on, P = async (t) => {
  const e = await x();
  return await c.lib.set({ lib: t.lib, run_from: "renderer", lazy_lib: t.lazy_lib }), {
    set: async (n) => {
      console.log("--renderer [set]");
      const r = new $();
      r.start();
      let a = n.data?.value?.l || n.data.l, s = {
        r: "",
        style: "",
        head: "",
        // `<test>head-1</test>`
        //set..
        //total:_l.length,
        benchmark: null
      };
      return await (async () => {
        for (const i of a) {
          const _ = await await c.lib.get({ name: i.type, run_from: "renderer", lazy_lib: t.lazy_lib }), l = await (await _.lib.index({
            f: {
              name: (u) => e.f.name({ id: i.id, name: u }),
              get_lib: async (u) => await await c.lib.get({ name: u.name, run_from: u.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (u) => await (await g()).set(u),
              path: (u) => c.path.set({ src: _.src, type: i.type, name: u }),
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
          s.r += l?.r || "", s.style += l?.style || "", s.head += l?.head || "";
        }
      })(), r.stop(), s.benchmark = r.result(), s;
    }
  };
}, W = async (t) => {
  const e = await x();
  return await c.lib.set({ lib: t.lib, run_from: "hydrator", lazy_lib: t.lazy_lib }), {
    set: async (n) => {
      console.log("--hydrator [set]");
      const r = new $();
      r.start();
      let a = {
        r: "",
        style: ""
      }, s = {
        style_id: `${y().set()}_stl`
      }, d = n.data?.value?.l || n.data.l;
      const i = async () => {
        for (const _ of d) {
          const m = await await c.lib.get({ name: _.type, run_from: "hydrator", lazy_lib: t.lazy_lib }), l = m.lib, u = h(), w = u.on, f = await (await l.index({
            /**@my module can use it to set custom variables. */
            my: {},
            //NOTE: We cannot add or use any variable of this object, It's reserved for module.
            f: {
              name: (o) => e.f.name({ id: _.id, name: o }),
              get_lib: async (o) => await await c.lib.get({ name: o.name, run_from: o.run_from, lazy_lib: t.lazy_lib }),
              set_theme: async (o) => await (await g()).set(o),
              path: (o) => c.path.set({ src: m.src, type: _.type, name: o }),
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
                curr: _
              }
            }
            /*_$cb*/
          );
          T("msg", async (o) => {
            try {
              if (Object.keys(o.where || {}).length == 0) {
                await u.emit("msg", o);
                return;
              }
            } catch {
            }
            try {
              if (_?.[o.where?.key || ""] == o.where?.value) {
                await u.emit("msg", o);
                return;
              }
            } catch {
            }
          }), a.style += f.style;
        }
      };
      await b(
        () => document.readyState === "complete" || typeof window < "u",
        50
      ), await i();
      try {
        ((_) => {
          const m = document.getElementById(`${s.style_id}`);
          m && m.remove();
          const l = document.createElement("style");
          l.id = `${s.style_id}`, l.innerHTML = `${a.style}`, _.appendChild(l);
        })(document.head);
      } catch (_) {
        console.log(`${_}, Failed to set style..`);
      }
      return r.stop(), {
        //style_id:_ins.style_id,
        //total:_l.length,
        benchmark: r.result()
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
