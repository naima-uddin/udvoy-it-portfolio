/**
 * A tiny scroll engine — one requestAnimationFrame loop for the whole site.
 *
 * - Lenis (if enabled) is stepped from this loop, so smooth-scroll, scroll
 *   tracking and every scroll-driven animation happen in the same frame.
 * - Element positions are measured only on resize, never per frame, so the
 *   loop does no layout reads while scrolling.
 * - Each tracked element gets a `--p` CSS variable (0 → 1). Most animations
 *   are pure CSS `calc()` on top of that variable.
 */

export type TrackMode =
  /** 0 when the element's top enters the bottom of the viewport, 1 when its bottom leaves the top */
  | "view"
  /** for tall sections with a sticky child: 0 when top hits viewport top, 1 when bottom hits viewport bottom */
  | "pin"
  /** 0 when the top is at the viewport top, 1 when the element has fully scrolled out */
  | "exit"
  /** 0 when the top enters at the viewport bottom, 1 when the top reaches the viewport top */
  | "enter";

export interface Tracked {
  el: HTMLElement;
  mode: TrackMode;
  name?: string;
  top: number;
  height: number;
  progress: number;
  written: string;
  onProgress?: (p: number) => void;
}

type TickFn = (time: number, dt: number) => void;

/** The part of Lenis we use; lets the engine run with or without it. */
export interface ScrollDriver {
  raf: (time: number) => void;
  readonly scroll: number;
  readonly velocity: number;
  scrollTo(target: number | string | HTMLElement, options?: object): void;
  stop(): void;
  start(): void;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

class ScrollEngine {
  y = 0;
  vh = 1;
  vw = 1;
  max = 1;
  velocity = 0;
  progress = 0;

  private items = new Set<Tracked>();
  private ticks = new Set<TickFn>();
  private driver: ScrollDriver | null = null;
  private dirty = true;
  private rafId = 0;
  private last = 0;
  private running = false;

  setDriver(driver: ScrollDriver | null) {
    this.driver = driver;
  }

  track(
    el: HTMLElement,
    opts: { mode?: TrackMode; name?: string; onProgress?: (p: number) => void } = {},
  ) {
    const item: Tracked = {
      el,
      mode: opts.mode ?? "view",
      name: opts.name,
      top: 0,
      height: 0,
      progress: 0,
      written: "",
      onProgress: opts.onProgress,
    };
    this.items.add(item);
    this.dirty = true;
    return () => {
      this.items.delete(item);
    };
  }

  find(name: string) {
    for (const it of this.items) if (it.name === name) return it;
    return undefined;
  }

  onTick(fn: TickFn) {
    this.ticks.add(fn);
    return () => {
      this.ticks.delete(fn);
    };
  }

  invalidate = () => {
    this.dirty = true;
  };

  scrollTo(target: number | string | HTMLElement) {
    if (this.driver) {
      this.driver.scrollTo(target, { duration: 1.8 });
      return;
    }
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }

  /** freezes page scrolling, e.g. while the full-screen mobile menu is open */
  lock(locked: boolean) {
    if (this.driver) {
      if (locked) this.driver.stop();
      else this.driver.start();
    }
    document.documentElement.classList.toggle("is-locked", locked);
  }

  private measure() {
    this.vh = window.innerHeight;
    this.vw = window.innerWidth;
    this.max = Math.max(1, document.documentElement.scrollHeight - this.vh);
    const sy = window.scrollY;
    for (const it of this.items) {
      const r = it.el.getBoundingClientRect();
      it.top = r.top + sy;
      it.height = r.height;
      it.written = "";
    }
    this.dirty = false;
  }

  private progressOf(it: Tracked) {
    const { y, vh } = this;
    switch (it.mode) {
      case "pin":
        return clamp01((y - it.top) / Math.max(1, it.height - vh));
      case "exit":
        return clamp01((y - it.top) / Math.max(1, it.height));
      case "enter":
        return clamp01((y + vh - it.top) / vh);
      default:
        return clamp01((y + vh - it.top) / (vh + it.height));
    }
  }

  private frame = (t: number) => {
    this.rafId = requestAnimationFrame(this.frame);
    const dt = this.last ? Math.min(t - this.last, 100) : 16.7;
    this.last = t;

    this.driver?.raf(t);
    if (this.dirty) this.measure();

    const prev = this.y;
    this.y = this.driver ? this.driver.scroll : window.scrollY;
    this.velocity = this.driver ? this.driver.velocity : this.y - prev;
    this.progress = clamp01(this.y / this.max);

    for (const it of this.items) {
      const p = this.progressOf(it);
      const s = p.toFixed(4);
      if (s === it.written) continue;
      it.written = s;
      it.progress = p;
      it.el.style.setProperty("--p", s);
      it.onProgress?.(p);
    }

    for (const fn of this.ticks) fn(t, dt);
  };

  start() {
    if (this.running) return () => {};
    this.running = true;
    this.last = 0;
    this.dirty = true;

    const ro = new ResizeObserver(this.invalidate);
    ro.observe(document.body);
    window.addEventListener("resize", this.invalidate);
    document.fonts?.ready.then(this.invalidate);
    this.rafId = requestAnimationFrame(this.frame);

    return () => {
      cancelAnimationFrame(this.rafId);
      ro.disconnect();
      window.removeEventListener("resize", this.invalidate);
      this.running = false;
    };
  }
}

export const engine = new ScrollEngine();
