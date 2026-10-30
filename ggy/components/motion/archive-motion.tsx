"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToY } from "@/lib/scroll";

/**
 * Archive motion, owned by GSAP.
 * - Figures count up from zero when they enter.
 * - Large screens: the road pins and the track travels sideways with scroll;
 *   year cards rise into place and archival photographs develop from a pale
 *   monochrome print as they cross the screen.
 */
export function ArchiveMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-archive]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      q("[data-count]").forEach((el) => {
        const target = Number((el as HTMLElement).dataset.count);
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
    });

    // Year index: on large screens with motion, scroll the road to the year;
    // elsewhere, bring the year's card into view.
    const jump = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.yearJump);
      const card = root.querySelector<HTMLElement>(`[data-year-index="${i}"]`);
      if (!card) return;
      if (travelST) {
        const track = root.querySelector<HTMLElement>("[data-track]")!;
        const dist = track.scrollWidth - window.innerWidth;
        const x = Math.min(dist, Math.max(0, card.offsetLeft - window.innerWidth * 0.3));
        scrollToY(travelST.start + (x / dist) * (travelST.end - travelST.start));
      } else {
        scrollToY(card.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
      }
    };
    const chips = root.querySelectorAll<HTMLElement>("[data-year-jump]");
    chips.forEach((c) => c.addEventListener("click", jump));
    let travelST: ScrollTrigger | null = null;

    mm.add(MOTION_QUERIES.desktop, () => {
      root.classList.add("is-sequenced");
      const road = q("[data-road]")[0] as HTMLElement;
      const track = q("[data-track]")[0] as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;

      const travel = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: road,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // The second pin on the page, so it refreshes after the hero's.
          refreshPriority: 1,
        },
      });
      travelST = travel.scrollTrigger ?? null;
      // Positions come from the list items, which stay put; the bodies inside
      // them are what the arrival animation moves.
      const cards = q("[data-year-index]") as HTMLElement[];
      gsap.to(q("[data-road-progress]"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: road,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1.2,
          onUpdate: (self) => {
            // Mark the year nearest the reading line.
            const x = self.progress * distance() + window.innerWidth * 0.35;
            let best = 0;
            cards.forEach((c, k) => {
              if (c.offsetLeft <= x) best = k;
            });
            const idx = Number(cards[best]?.dataset.yearIndex ?? 0);
            chips.forEach((c) => c.setAttribute("aria-current", String(Number(c.dataset.yearJump) === idx)));
          },
        },
      });

      q("[data-year-card]").forEach((body) => {
        gsap.from(body, {
          yPercent: 40,
          autoAlpha: 0,
          ease: "land",
          duration: 1.1,
          scrollTrigger: { trigger: body.closest("li") ?? body, containerAnimation: travel, start: "left 92%", toggleActions: "play none none reverse" },
        });
      });
      q("[data-develop] img").forEach((img) => {
        gsap.fromTo(
          img,
          { filter: "grayscale(1) sepia(0.35) contrast(0.85) brightness(1.1)", scale: 1.18 },
          {
            filter: "grayscale(0) sepia(0) contrast(1) brightness(1)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: img.closest("figure"), containerAnimation: travel, start: "left 95%", end: "center 50%", scrub: true },
          },
        );
      });
      return () => {
        travelST = null;
        root.classList.remove("is-sequenced");
      };
    });

    return () => {
      chips.forEach((c) => c.removeEventListener("click", jump));
      mm.revert();
    };
  });
  return null;
}
