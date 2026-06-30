"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function FooterContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inquiry_type: formData.get("inquiry_type"),
          full_name: formData.get("full_name"),
          email_address: formData.get("email_address"),
          message: formData.get("message")
        })
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message right now.");
      }

      form.reset();
      setSubmitState("sent");
      setStatusMessage("MESSAGE SENT. THANK YOU.");
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to send message right now.");
    }
  }

  return (
    <form className="footer-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-send" disabled={submitState === "sending"}>
            {submitState === "sending" ? "SENDING" : "SEND"}
          </button>
          {statusMessage ? (
            <p className={`footer-form-status footer-form-status--${submitState}`} role="status">
              {statusMessage}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
