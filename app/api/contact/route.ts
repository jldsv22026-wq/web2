import { NextResponse } from "next/server";

type ContactPayload = {
  inquiry_type?: string;
  full_name?: string;
  email_address?: string;
  message?: string;
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
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
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

  if (!fullName || !emailPattern.test(emailAddress) || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const safeInquiryType = escapeHtml(inquiryType);
  const safeFullName = escapeHtml(fullName);
  const safeEmailAddress = escapeHtml(emailAddress);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail.split(",").map((email) => email.trim()).filter(Boolean),
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

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend email failed:", error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
