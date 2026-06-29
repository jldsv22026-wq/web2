"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "HOME", href: "/#" },
  { label: "PROJECTS", href: "/#projects" },
  { label: "COMPANY", href: "/#company" },
  { label: "CONTACT", href: "/#colophon" }
];

type HeaderProps = {
  logoUrl?: string;
  logoAlt?: string;
};

export function Header({ logoUrl, logoAlt = "Janet Lee Design Studio" }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(pathname !== "/");

  useEffect(() => {
    const heroSection = document.querySelector<HTMLElement>(".hero-section");

    if (!heroSection) {
      const frame = window.requestAnimationFrame(() => setShowHeader(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const updateHeaderState = () => {
      const headerRevealPoint = heroSection.offsetTop + heroSection.offsetHeight;
      setShowHeader(window.scrollY >= headerRevealPoint);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
    };
  }, [pathname]);

  return (
    <header className={`site-header ${showHeader ? "site-header--visible" : ""}`} id="masthead">
      {logoUrl ? (
        <Link href="/" className="floating-header-logo" aria-label="Janet Lee Design Studio home">
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
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
        </button>

        <div id="side-navigation" className={`side-nav ${isOpen ? "side-nav--open" : ""}`}>
          <div className="side-nav-inner">
            <ul className="menu">
              {navItems.map((item) => (
                <li className="menu-item" key={item.label}>
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
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
