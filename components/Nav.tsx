"use client";

import { useEffect, useRef, useState } from "react";
import { engine } from "@/lib/engine";
import { vars } from "@/lib/css";
import { SECTIONS, SITE } from "@/lib/site";

/** on wide screens the bar shows every section except Contact, which has its own button */
const BAR_LINKS = SECTIONS.filter((s) => s.id !== "contact");

export default function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const navEl = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // scroll progress line + which section is on screen (a section counts once its top passes 40% of the screen).
  // Section positions come from the engine, which measures them only on resize.
  useEffect(() => {
    let last = -1;
    let current = "";
    let shaded = false;
    return engine.onTick(() => {
      // once the page has moved, a blurred bar sits behind the nav so text never runs under it
      const s = engine.y > 24;
      if (s !== shaded && shade.current) {
        shaded = s;
        shade.current.classList.toggle("is-on", s);
      }
      const p = Math.round(engine.progress * 1000) / 1000;
      if (p !== last && bar.current) {
        last = p;
        bar.current.style.transform = `scaleX(${p})`;
      }
      let next = "";
      for (const s of SECTIONS) {
        const it = engine.find(s.id);
        if (it && engine.y + engine.vh * 0.4 >= it.top) next = s.id;
      }
      // at the very bottom the last section may be too short to reach the 40% line
      if (engine.progress > 0.995) next = SECTIONS[SECTIONS.length - 1].id;
      if (next !== current) {
        current = next;
        setActive(next);
      }
    });
  }, []);

  // the bar behind the nav matches the nav's height, whatever the screen
  useEffect(() => {
    const el = navEl.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // while the menu is open: the page underneath can't scroll, Escape closes it
  useEffect(() => {
    if (!open) return;
    engine.lock(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      engine.lock(false);
    };
  }, [open]);

  // the menu only exists on small screens; close it if the window grows past that
  useEffect(() => {
    const wide = matchMedia("(min-width: 1081px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  // unlock before the smooth scroll starts: React's click handler runs before Lenis' own
  // anchor handler, which then scrolls to the section
  const go = () => {
    engine.lock(false);
    setOpen(false);
  };

  return (
    <>
      <div className="progress" aria-hidden>
        <div ref={bar} className="progress-bar" />
      </div>
      <div ref={shade} className="nav-shade" aria-hidden />
      <nav ref={navEl} className="nav" aria-label="Main">
        <a href="#top" className="logo" onClick={open ? go : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element -- small local logo, sized by CSS */}
          <img src="/brand/udvoy-logo-white.png" alt={SITE.name} width={1089} height={242} />
        </a>
        <div className="nav-links">
          {BAR_LINKS.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <a
            href="#contact"
            className="nav-cta"
            aria-current={active === "contact" ? "true" : undefined}
            onClick={open ? go : undefined}
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <i aria-hidden />
            <i aria-hidden />
          </button>
        </div>
      </nav>

      <div id="menu" className={`menu${open ? " is-open" : ""}`} inert={!open}>
        <nav className="menu-links" aria-label="Sections">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={go}
              aria-current={active === s.id ? "true" : undefined}
              style={vars({ "--i": i })}
            >
              <span>0{i + 1}</span>
              {s.label}
            </a>
          ))}
        </nav>
        <p className="menu-foot">
          <span>( {SITE.name} )</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </div>
    </>
  );
}
