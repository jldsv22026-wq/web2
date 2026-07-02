"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";

const navItems = [
  { label: "HOME", href: "/#" },
  { label: "PROJECTS", href: "/projects" },
  { label: "PRESS", href: "/press" },
  { label: "ABOUT US", href: "/#company" },
  { label: "CONTACT US", href: "/#colophon" }
];

type HeaderProps = {
  logoUrl?: string;
  logoAlt?: string;
};

export function Header({ logoUrl, logoAlt = "Janet Lee Design Studio" }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const closeMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 120);
  };

  const closeMenuOnBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeMenu();
    }
  };

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);

    if (pathname === "/") {
      event.preventDefault();
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const heroSection = document.querySelector<HTMLElement>(".hero-section");
    const projectsSection = document.querySelector<HTMLElement>("#projects");

    if (!heroSection) {
      const frame = window.requestAnimationFrame(() => setShowHeader(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const updateHeaderState = () => {
      const revealDistance = projectsSection?.offsetTop || heroSection.offsetHeight || window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(revealDistance, 1)));
      const header = document.querySelector<HTMLElement>(".site-header");

      header?.style.setProperty("--header-progress", progress.toString());
      header?.style.setProperty("--header-border-alpha", (progress * 0.16).toString());
      header?.style.setProperty("--header-shadow-alpha", (progress * 0.18).toString());
      setShowHeader(progress > 0.02);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);

    return () => {
      clearCloseTimer();
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
    };
  }, [pathname]);

  return (
    <header className={`site-header ${showHeader ? "site-header--visible" : ""}`} id="masthead">
      {logoUrl ? (
        <Link href="/" className="floating-header-logo" aria-label="Janet Lee Design Studio home" onClick={scrollHome}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={logoAlt} />
        </Link>
      ) : null}
      <div className="header-inner">
        <button
          className={`menu-toggle-premium ${isOpen ? "menu-toggle--active" : ""}`}
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-controls="side-navigation"
          aria-expanded={isOpen}
          onBlur={closeMenuOnBlur}
          onClick={openMenu}
          onFocus={openMenu}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
        </button>

        <div
          id="side-navigation"
          className={`side-nav ${isOpen ? "side-nav--open" : ""}`}
          onBlur={closeMenuOnBlur}
          onFocus={openMenu}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <div className="side-nav-inner">
            <ul className="menu">
              {navItems.map((item) => (
                <li className="menu-item" key={item.label}>
                  <Link href={item.href} onClick={item.label === "HOME" ? scrollHome : () => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
