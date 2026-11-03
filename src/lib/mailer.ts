import nodemailer, { type Transporter } from "nodemailer";
// Shared with the client and both API routes so the rules cannot drift.
import { telHref } from "./validate";

/**
 * Booking notifications.
 *
 * Gmail SMTP via an App Password — the plain account password will not work
 * and 2-step verification has to be on for the sending account. All three
 * env vars are read on the server only: .env.local in development, the
 * hosting panel's environment variables in production.
 */

export type Lead = {
  name: string;
  business: string;
  interest: string;
  phone: string;
  email: string;
};

const user = process.env.EMAIL_USER?.trim();
// App passwords are shown as "abcd efgh ijkl mnop"; the spaces are display-only.
const pass = process.env.EMAIL_APP_PASSWORD?.replace(/\s+/g, "");
const to = process.env.TRIAL_RECEIVER_EMAIL?.trim();

/**
 * Names (never values) of the mail env vars that are unset or blank. Empty
 * when mail is fully configured. The API routes refuse to report success
 * while this is non-empty, so a misconfigured deploy fails loudly instead of
 * telling visitors their request went through.
 */
export const missingMailVars: string[] = [
  ["EMAIL_USER", user],
  ["EMAIL_APP_PASSWORD", pass],
  ["TRIAL_RECEIVER_EMAIL", to],
]
  .filter(([, value]) => !value)
  .map(([name]) => name as string);

export const mailerConfigured = missingMailVars.length === 0;

// One pooled transport for the process; building it per request re-does the
// TLS handshake and the Gmail login every time.
let transport: Transporter | null = null;
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      pool: true,
    });
  }
  return transport;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function stamp() {
  return `${new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  })} IST`;
}

/** Renders the label/value table both notification emails share. */
function table(rows: [string, string][]) {
  return `<table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:8px 12px 8px 0;color:#666;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:8px 0;font-weight:600">${esc(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

export async function sendLeadEmail(lead: Lead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Business", lead.business],
    ["Looking for", lead.interest],
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["Received", stamp()],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;font-size:18px">New strategy-call booking</h2>
      <p style="margin:0 0 16px;color:#666;font-size:13px">From the KRYPTONIX website form</p>
      ${table(rows)}
      <p style="margin:20px 0 0">
        <a href="tel:${esc(telHref(lead.phone))}"
           style="display:inline-block;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px">
          Call ${esc(lead.name)}
        </a>
      </p>
    </div>`;

  await getTransport().sendMail({
    from: `"KRYPTONIX Website" <${user}>`,
    to,
    // So hitting Reply in the inbox answers the lead, not our own sending account.
    replyTo: lead.email || undefined,
    subject: `New booking — ${lead.name} (${lead.business})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html,
  });
}

export type Application = {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
};

/**
 * Job application notification. Same inbox as leads, but a distinct subject
 * line so the two are easy to separate, and the resume rides along as a real
 * attachment rather than a link.
 */
export async function sendApplicationEmail(
  app: Application,
  resume: { filename: string; content: Buffer },
) {
  const rows: [string, string][] = [
    ["Name", app.name],
    ["Applying for", app.role],
    ["Email", app.email],
    ["Phone", app.phone],
    ["Resume", resume.filename],
    ["Received", stamp()],
  ];

  const note = app.message
    ? `<h3 style="margin:22px 0 6px;font-size:14px">Message</h3>
       <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(app.message)}</p>`
    : "";

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;font-size:18px">New job application</h2>
      <p style="margin:0 0 16px;color:#666;font-size:13px">From the KRYPTONIX careers section</p>
      ${table(rows)}
      ${note}
      <p style="margin:20px 0 0">
        <a href="tel:${esc(telHref(app.phone))}"
           style="display:inline-block;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px">
          Call ${esc(app.name)}
        </a>
      </p>
    </div>`;

  await getTransport().sendMail({
    from: `"KRYPTONIX Careers" <${user}>`,
    to,
    replyTo: app.email,
    subject: `New application — ${app.name} (${app.role})`,
    text: [
      ...rows.map(([k, v]) => `${k}: ${v}`),
      app.message ? `\nMessage:\n${app.message}` : "",
    ].join("\n"),
    html,
    attachments: [{ filename: resume.filename, content: resume.content }],
  });
}
