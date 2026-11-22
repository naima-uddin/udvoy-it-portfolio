"use server";

import { SITE } from "@/lib/site";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<ContactField, string>>;
  /** what was submitted, so a rejected form can show it again instead of clearing */
  values?: Partial<Record<ContactField, string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS: Record<ContactField, number> = {
  name: 100,
  email: 200,
  message: 5000,
};

const text = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);

async function sendEmail(values: Record<ContactField, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.CONTACT_FROM_EMAIL ?? "UDVOY IT Website <noreply@udvoy.com>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [SITE.email],
      reply_to: values.email,
      subject: `Website enquiry from ${values.name}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
      html: `
        <h2>New website enquiry</h2>
        <p><b>Name:</b> ${escapeHtml(values.name)}</p>
        <p><b>Email:</b> ${escapeHtml(values.email)}</p>
        <p><b>Message:</b></p>
        <p>${escapeHtml(values.message).replace(/\n/g, "<br />")}</p>
      `,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend answered ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  return true;
}

/**
 * Contact form handler. A Server Action is a public POST endpoint, so every field is
 * re-validated here; the browser's checks are only a convenience.
 *
 * Delivery: set RESEND_API_KEY to send directly to SITE.email. The sending domain must
 * be verified in Resend. CONTACT_WEBHOOK_URL remains available as a fallback.
 * Without either, development logs the message to the terminal and production reports an
 * offline form.
 */
export async function sendContact(_prev: ContactState, data: FormData): Promise<ContactState> {
  const values = {
    name: text(data, "name"),
    email: text(data, "email"),
    message: text(data, "message"),
  } satisfies Record<ContactField, string>;

  // hidden field that people never see or fill in; bots usually do. Pretend it worked.
  if (text(data, "website")) return { status: "success", message: "Thanks, we'll be in touch soon." };

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 10) errors.message = "A few more words, please (at least 10 characters).";
  for (const key of Object.keys(LIMITS) as ContactField[]) {
    if (values[key].length > LIMITS[key]) errors[key] = `Please keep this under ${LIMITS[key]} characters.`;
  }
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await sendEmail(values);
      return { status: "success", message: "Thanks! We'll reply within one business day." };
    }

    const url = process.env.CONTACT_WEBHOOK_URL;
    if (!url) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact] delivery is not configured, so this message was only logged:", values);
        return { status: "success", message: "Thanks! (Development: the message was logged in the terminal.)" };
      }
      console.error("[contact] neither RESEND_API_KEY nor CONTACT_WEBHOOK_URL is configured.");
      return {
        status: "error",
        message: `Our form is offline right now. Please email us at ${SITE.email}.`,
        values,
      };
    }

    const token = process.env.CONTACT_WEBHOOK_TOKEN;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        ...values,
        submittedAt: new Date().toISOString(),
        // a one-line summary, so chat webhooks (e.g. Slack) show something readable
        text: `New enquiry from ${values.name} <${values.email}>: ${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`webhook answered ${res.status}`);
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return {
      status: "error",
      message: `We couldn't send your message. Please try again, or email us at ${SITE.email}.`,
      values,
    };
  }

  return { status: "success", message: "Thanks! We'll reply within one business day." };
}
