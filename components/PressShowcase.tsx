"use client";

import Image from "next/image";
import { useState } from "react";

const pressItems = [
  {
    id: "press-1",
    label: "PRESS 1 TITLE",
    title: "Press 1 Title",
    images: ["/images/projects/tea-1.png", "/images/projects/tea-2.png", "/images/projects/dan.png"]
  },
  {
    id: "press-2",
    label: "PRESS 2 TITLE",
    title: "Press 2 Title",
    images: ["/images/projects/tea-2.png", "/images/projects/dan.png", "/images/projects/tea-1.png"]
  },
  {
    id: "press-3",
    label: "PRESS 3 TITLE",
    title: "Press 3 Title",
    images: ["/images/projects/dan.png", "/images/projects/tea-1.png", "/images/projects/tea-2.png"]
  },
  {
    id: "press-4",
    label: "PRESS 4 TITLE",
    title: "Press 4 Title",
    images: ["/images/projects/tea-1.png", "/images/projects/dan.png", "/images/projects/tea-2.png"]
  }
];

const introText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean suscipit varius est, ac egestas sem. Donec congue dui in ligula iaculis suscipit. Praesent ut tellus consectetur, malesuada orci at, tincidunt purus. Sed id urna sit amet erat laoreet placerat. Proin tincidunt consectetur ipsum, ut tincidunt erat lobortis a. Pellentesque interdum non odio sed ullamcorper. Phasellus eu sapien ullamcorper, consectetur nunc ac, auctor lacus. Fusce quis elementum dui, non condimentum enim. Proin et eros magna. Suspendisse potenti. In hac habitasse platea dictumst. Aliquam non lobortis quam. Quisque faucibus at dui vel vulputate. Nam sit amet erat id dolor hendrerit sodales. Donec sagittis augue quis aliquet eleifend.";

const bodyText =
  "Suspendisse vitae orci et augue posuere pellentesque. Nulla ut velit at erat commodo volutpat. Nunc quis finibus nulla. Nullam sit amet tellus arcu. Integer ullamcorper velit eget dui molestie mollis. Vivamus molestie purus ut odio malesuada, vel dignissim lacus elementum. Phasellus non viverra nisi. In eu ultricies nunc. Aliquam et ipsum enim. Mauris bibendum ex volutpat dui pharetra ultricies. Duis fringilla varius ante in mattis. Fusce sollicitudin erat nec ligula dictum, ut luctus ex placerat. Nam et rhoncus ligula, sed aliquam ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";

export function PressShowcase() {
  const [activePressId, setActivePressId] = useState(pressItems[0].id);
  const activePress = pressItems.find((item) => item.id === activePressId) ?? pressItems[0];

  return (
    <>
      <header className="projects-page-hero press-page-hero">
        <div className="filter-container" aria-label="Press articles">
          {pressItems.map((item) => (
            <button
              className={`filter-btn${activePress.id === item.id ? " active" : ""}`}
              key={item.id}
              onClick={() => setActivePressId(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <article className="press-article">
        <section className="press-article__lead">
          <div className="press-article__copy">
            <h1>{activePress.title}</h1>
            <p>{introText}</p>
          </div>

          <div className="press-article__image-pair">
            {activePress.images.slice(0, 2).map((image) => (
              <div className="press-article__image press-article__image--portrait" key={image}>
                <Image src={image} alt={activePress.title} fill sizes="(max-width: 1024px) 50vw, 360px" />
              </div>
            ))}
          </div>
        </section>

        <p className="press-article__body">{bodyText}</p>

        <div className="press-article__image press-article__image--wide">
          <Image src={activePress.images[2]} alt={activePress.title} fill sizes="(max-width: 1024px) 100vw, 1100px" />
        </div>

        <p className="press-article__body">{bodyText}</p>
      </article>
    </>
  );
}
