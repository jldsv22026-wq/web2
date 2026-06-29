"use client";

import { useEffect, useRef } from "react";

const SECTION_SELECTORS = [".hero-section", "#projects", "#company", "#colophon"];
const SCROLL_LOCK_MS = 1150;
const WHEEL_THRESHOLD = 22;
const TOUCH_THRESHOLD = 42;

export function SmoothSectionScroll() {
  const isLocked = useRef(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((element) => {
        element.classList.add("is-revealed");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.18
      }
    );

    document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((element) => {
      revealObserver.observe(element);
    });

    const getSections = () =>
      SECTION_SELECTORS.map((selector) => document.querySelector<HTMLElement>(selector)).filter(
        (section): section is HTMLElement => section !== null && section.offsetParent !== null
      );

    const getCurrentIndex = (sections: HTMLElement[]) => {
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      let currentIndex = 0;

      sections.forEach((section, index) => {
        if (section.offsetTop <= viewportMiddle) {
          currentIndex = index;
        }
      });

      return currentIndex;
    };

    const scrollToSection = (direction: 1 | -1) => {
      if (isLocked.current) {
        return;
      }

      const sections = getSections();
      if (sections.length < 2) {
        return;
      }

      const currentIndex = getCurrentIndex(sections);
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));

      if (nextIndex === currentIndex) {
        return;
      }

      isLocked.current = true;
      sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        isLocked.current = false;
      }, SCROLL_LOCK_MS);
    };

    const handleWheel = (event: WheelEvent) => {
      if (!document.querySelector(".hero-section")) {
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) {
        return;
      }

      event.preventDefault();
      scrollToSection(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartY.current === null || !document.querySelector(".hero-section")) {
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
      const delta = touchStartY.current - endY;
      touchStartY.current = null;

      if (Math.abs(delta) < TOUCH_THRESHOLD) {
        return;
      }

      scrollToSection(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null;
}
