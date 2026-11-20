"use client";

import { engine } from "@/lib/engine";

export default function BackToTop() {
  return (
    <button type="button" className="to-top" onClick={() => engine.scrollTo(0)}>
      Back to top ↑
    </button>
  );
}
