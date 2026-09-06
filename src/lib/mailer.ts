import nodemailer from "nodemailer";

/**
 * Booking notifications.
 *
 * Gmail SMTP via an App Password — the plain account password will not work
 * and 2-step verification has to be on for the sending account. All three
 * env vars live in .env.local and are read on the server only.
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

/** False when the mail env vars are missing, so callers can fall back to logging. */
export const mailerConfigured = Boolean(user && pass && to);

// One pooled transport for the process; building it per request re-does the
// TLS handshake and the Gmail login every time.
let transport: nodemailer.Transporter | null = null;
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

/** Digits-only form of the phone, for a tel: link that always dials. */
function telHref(raw: string) {
  const local = raw.replace(/\D/g, "").replace(/^(?:0+|91)/, "");
  return `+91${local}`;
}

export async function sendLeadEmail(lead: Lead) {
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Business", lead.business],
    ["Looking for", lead.interest],
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["Received", `${when} IST`],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;font-size:18px">New strategy-call booking</h2>
      <p style="margin:0 0 16px;color:#666;font-size:13px">From the KRYPTONIX website form</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `<tr>
          <td style="padding:8px 12px 8px 0;color:#666;white-space:nowrap;vertical-align:top">${esc(k)}</td>
          <td style="padding:8px 0;font-weight:600">${esc(v)}</td>
        </tr>`
          )
          .join("")}
      </table>
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
    text,
    html,
  });
}
