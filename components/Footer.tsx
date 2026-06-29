type FooterProps = {
  logoUrl?: string;
  logoAlt?: string;
};

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M6.94 8.98H3.69v10.37h3.25V8.98ZM5.32 4.65a1.89 1.89 0 1 0 0 3.78 1.89 1.89 0 0 0 0-3.78Zm13.98 8.76c0-3.13-1.67-4.58-3.9-4.58a3.36 3.36 0 0 0-3.02 1.66h-.04V8.98H9.22v10.37h3.25v-5.13c0-1.35.25-2.66 1.93-2.66 1.65 0 1.67 1.55 1.67 2.75v5.04h3.24v-5.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        fillRule="evenodd"
        d="M7.63 3.9h8.74a3.74 3.74 0 0 1 3.73 3.73v8.74a3.74 3.74 0 0 1-3.73 3.73H7.63a3.74 3.74 0 0 1-3.73-3.73V7.63A3.74 3.74 0 0 1 7.63 3.9Zm0 1.72a2.02 2.02 0 0 0-2.01 2.01v8.74c0 1.1.9 2.01 2.01 2.01h8.74c1.1 0 2.01-.9 2.01-2.01V7.63c0-1.1-.9-2.01-2.01-2.01H7.63Zm8.85 1.68a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 8.06a3.94 3.94 0 1 1 0 7.88 3.94 3.94 0 0 1 0-7.88Zm0 1.72a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M14.2 8.33V6.76c0-.72.48-.9.82-.9h2.08V2.66L14.24 2.65c-3.18 0-3.9 2.38-3.9 3.9v1.78H8.5v3.3h1.84v9.72h3.86v-9.72h2.6l.34-3.3H14.2Z" />
    </svg>
  );
}

export function Footer({ logoUrl, logoAlt = "Janet Lee Design Studio" }: FooterProps) {
  return (
    <footer id="colophon" className="site-footer">
      <div className="footer-container">
        <div className="footer-logo-panel reveal-on-scroll">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl || "/images/hero-logo.png"} alt={logoAlt} className="footer-logo" />
        </div>

        <div className="footer-contact-panel reveal-on-scroll reveal-delay-1">
          <nav className="social-links" aria-label="Social links">
            <a href="#" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="#" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </nav>

          <p className="form-intro">We&apos;d love to collaborate with you! Drop us a line.</p>

          <form className="footer-form">
            <div className="form-grid">
              <div className="form-left">
                <select name="inquiry_type" defaultValue="" required>
                  <option value="" disabled>
                    GENERAL INQUIRY
                  </option>
                  <option value="GENERAL INQUIRY">GENERAL INQUIRY</option>
                  <option value="PARTNERS INQUIRY">PARTNERS INQUIRY</option>
                  <option value="CAREERS INQUIRY">CAREERS INQUIRY</option>
                </select>
                <input type="text" name="full_name" placeholder="FULL NAME / COMPANY NAME" required />
                <input type="email" name="email_address" placeholder="EMAIL ADDRESS" required />
              </div>
              <div className="form-right">
                <textarea name="message" placeholder="MESSAGE" required />
                <button type="submit" className="btn-send">
                  SEND
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
}
