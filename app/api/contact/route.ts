import { NextResponse } from "next/server";

type ContactPayload = {
  inquiry_type?: string;
  full_name?: string;
  email_address?: string;
  message?: string;
};

const inquiryRecipients: Record<string, string> = {
  "GENERAL INQUIRY": "jldsv22026@gmail.com",
  "PARTNERS INQUIRY": "jldsv22026@gmail.com",
  "CAREERS INQUIRY": "jldsv22026@gmail.com"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    console.error("Contact form email environment variables are not configured.");
    return NextResponse.json({ error: "Email is not configured yet." }, { status: 500 });
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const inquiryType = clean(payload.inquiry_type) || "GENERAL INQUIRY";
  const fullName = clean(payload.full_name);
  const emailAddress = clean(payload.email_address);
  const message = clean(payload.message);
  const recipientEmail = inquiryRecipients[inquiryType] || inquiryRecipients["GENERAL INQUIRY"];

  if (!fullName || !emailPattern.test(emailAddress) || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const safeInquiryType = escapeHtml(inquiryType);
  const safeFullName = escapeHtml(fullName);
  const safeEmailAddress = escapeHtml(emailAddress);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const notificationResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipientEmail,
      reply_to: emailAddress,
      subject: `Website ${inquiryType} from ${fullName}`,
      html: `
        <h2>New website inquiry</h2>
        <p><strong>Inquiry type:</strong> ${safeInquiryType}</p>
        <p><strong>Name / Company:</strong> ${safeFullName}</p>
        <p><strong>Email:</strong> ${safeEmailAddress}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `
    })
  });

  if (!notificationResponse.ok) {
    const error = await notificationResponse.text();
    console.error("Resend notification email failed:", error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 502 });
  }

  const receiptResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: emailAddress,
      reply_to: recipientEmail,
      subject: "We received your message",
      html: `
        <h2>Thank you for contacting Janet Lee Design Studio</h2>
        <p>Hello ${safeFullName},</p>
        <p>We received your ${safeInquiryType.toLowerCase()} and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
      `
    })
  });

  if (!receiptResponse.ok) {
    const error = await receiptResponse.text();
    console.error("Resend receipt email failed:", error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
