"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { engine, type TrackMode } from "@/lib/engine";

type Props = {
  as?: "section" | "header" | "footer" | "div" | "ol" | "ul";
  mode?: TrackMode;
  /** lets other code look this section up with engine.find() */
  name?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** Wraps server-rendered markup and feeds it a live `--p` scroll-progress CSS variable. */
export default function Track({ as = "section", mode = "view", name, id, className, style, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return engine.track(ref.current, { mode, name });
  }, [mode, name]);

  const Tag = as as ElementType;
  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
