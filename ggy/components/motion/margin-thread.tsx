"use client";

import { useEffect, useRef, useState } from "react";
import { PageSentinel, usePageRoot } from "./page-root";

type Node = { id: string; label: string; at: number };

/**
 * A thin line fixed at the right edge of wide windows: the journey line of
 * the page you are on. It carries one node for each section marked
 * [data-thread="Label"], fills as you read, and each node jumps to its
 * section. Where the reader has not got to a section, its node is open.
 */
export function MarginThread() {
  const { ref, root } = usePageRoot();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [active, setActive] = useState(-1);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const page = root();
    let frame = 0;
    const measure = () => {
      const sections = Array.from(page.querySelectorAll<HTMLElement>("[data-thread]"));
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setNodes(
        sections.map((el, i) => {
          if (!el.id) el.id = `thread-${i}`;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return { id: el.id, label: el.dataset.thread ?? "", at: Math.min(1, Math.max(0, (top - 80) / max)) };
        }),
      );
    };
    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      fill.current?.style.setProperty("--p", String(p));
      const mid = window.scrollY + window.innerHeight * 0.45;
      const sections = Array.from(page.querySelectorAll<HTMLElement>("[data-thread]"));
      let a = -1;
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top + window.scrollY <= mid) a = i;
      });
      setActive(a);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };
    measure();
    update();
    // Images and fonts move things after first paint.
    const t = window.setTimeout(remeasure, 900);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageSentinel innerRef={ref} />
      {nodes.length > 1 ? (
        <nav className="thread" aria-label="On this page">
          <span aria-hidden="true" className="thread-line">
            <span ref={fill} className="thread-fill" />
          </span>
          <ol>
            {nodes.map((n, i) => (
              <li key={n.id} style={{ top: `${n.at * 100}%` }}>
                <a href={`#${n.id}`} className={`thread-node ${i <= active ? "is-read" : ""}`} aria-current={i === active ? "location" : undefined}>
                  <span className="thread-dot" aria-hidden="true" />
                  <span className="thread-label">{n.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </>
  );
}
