"use client";

import { useState } from "react";

export function HomeInteractions() {
  const [showJanet, setShowJanet] = useState(false);

  return (
    <>
      <section id="about-us" className={`about-section ${showJanet ? "hidden-section" : ""}`}>
        <div className="about-intro">
          <div className="about-intro-main">
            <div className="about-intro-content">
              <p className="about-intro-text">
                A premier interior design firm that specializes in space planning and creating beautiful,
                functional spaces that reflect our clients&apos; unique style. Our team of experienced and
                talented designers has a deep understanding of the latest trends and technologies, and we
                are committed to providing our clients with the highest level of service.
                <br />
                <br />
                We believe that every space is a blank canvas, and we are excited to help our clients bring
                their vision to life.
              </p>
            </div>
            <picture className="about-intro-image">
              <source media="(max-width: 1024px)" srcSet="/images/image-1-mobile.webp" />
              <img src="/images/image-1.webp" alt="Janet Lee Design Studio interior" />
            </picture>
          </div>
          <div className="about-intro-footer">
            <a href="#colophon" className="btn-premium">
              BOOK AN APPOINTMENT
            </a>
            <button className="btn-about-janet" type="button" onClick={() => setShowJanet(true)}>
              ABOUT JANET
            </button>
          </div>
        </div>
      </section>

      <section id="about-janet" className={`about-janet-section ${showJanet ? "" : "hidden-section"}`}>
        <div className="about-intro">
          <div className="about-intro-main">
            <div className="janet-intro-content">
              <p className="about-intro-text">
                Janet Lee is the principal interior designer and founder of Janet Lee Design Studio. She is
                a licensed interior designer with over 10 years of experience. Passionate about finding
                solutions to spatial challenges, Janet is hands-on and involved in every step of the
                process, from concept to completion.
                <br />
                <br />A member of the Philippine Institute of Interior Designers and the International
                Interior Design Association. Also a certified LEED Green Associate.
              </p>
            </div>
          </div>
          <div className="about-intro-footer janet-intro-footer">
            <a href="#colophon" className="btn-premium">
              BOOK AN APPOINTMENT
            </a>
            <button className="btn-premium btn-back-studio" type="button" onClick={() => setShowJanet(false)}>
              ABOUT THE STUDIO
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
