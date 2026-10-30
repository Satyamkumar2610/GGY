"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToY } from "@/lib/scroll";

/**
 * Archive motion, owned by GSAP.
 * - The title opens from Anek's condensed width to its resting width as it
 *   rises up the screen, and the running head draws its rule — both scrubbed.
 * - Figures count up from zero when they enter, while the ledger is ruled
 *   off under each one in turn, at the pace of the scroll.
 * - Large screens: the road pins and the track travels sideways with scroll
 *   across the road's own width;
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
      // The title is set condensed and opens to its resting width as it
      // comes up the screen: the same axis the band answers scroll with.
      const title = q("[data-archive-title]")[0];
      gsap.fromTo(
        title,
        { fontVariationSettings: '"wdth" 75', letterSpacing: "-0.055em" },
        {
          fontVariationSettings: '"wdth" 112',
          letterSpacing: "-0.03em",
          ease: "none",
          scrollTrigger: { trigger: title, start: "top 92%", end: "top 38%", scrub: 0.8 },
        },
      );

      gsap.from(q("[data-archive-rule]"), {
        scaleX: 0,
        ease: "none",
        scrollTrigger: { trigger: q("[data-archive-kicker]")[0], start: "top 92%", end: "top 55%", scrub: 0.8 },
      });

      // The ledger is ruled off column by column, at the pace of the scroll.
      gsap.from(q("[data-figure-rule]"), {
        scaleX: 0,
        ease: "none",
        stagger: 0.35,
        scrollTrigger: { trigger: q(".archive-figures")[0], start: "top 88%", end: "top 45%", scrub: 0.8 },
      });

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
        const w = track.parentElement!.clientWidth;
        const dist = track.scrollWidth - w;
        const x = Math.min(dist, Math.max(0, card.offsetLeft - w * 0.3));
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
      const distance = () => track.scrollWidth - road.clientWidth;

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
          // The third pin on the page, so it refreshes after the hero and the idea stage.
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
            const x = self.progress * distance() + road.clientWidth * 0.35;
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
