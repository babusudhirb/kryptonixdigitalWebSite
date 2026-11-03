import { NextResponse } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { mailerConfigured, missingMailVars, sendLeadEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/spam";

/**
 * Strategy-call lead intake.
 *
 * A valid lead is emailed to TRIAL_RECEIVER_EMAIL (see src/lib/mailer.ts).
 * Success is only reported once that email has actually been sent: when the
 * mail env vars are missing the request fails with 503 (and the lead is
 * logged, so it is not lost), exactly like a failed send.
 *
 * Spam: rate limited per IP and per route (src/lib/spam.ts), plus a honeypot
 * field that bots fill and people never see.
 */

type Body = {
  name?: unknown;
  business?: unknown;
  interest?: unknown;
  phone?: unknown;
  email?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Mirrors the client rule in LeadForm.tsx — never trust the browser's copy. */
function validPhone(raw: string) {
  const local = raw.replace(/\D/g, "").replace(/^(?:0+|91)/, "");
  return /^[6-9]\d{9}$/.test(local);
}

export async function POST(request: Request) {
  const wait = rateLimit(request, "lead");
  if (wait !== null) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  let body: Body & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot filled: almost certainly a bot. Answer like a success so it does
  // not learn to adapt, send nothing, and keep a log line in case a real
  // person ever trips it.
  if (str(body[HONEYPOT_FIELD])) {
    console.warn("[kryptonix] lead honeypot tripped — not emailed", {
      name: str(body.name),
      phone: str(body.phone),
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  const lead = {
    name: str(body.name),
    business: str(body.business),
    interest: str(body.interest),
    phone: str(body.phone),
    email: str(body.email),
  };

  const errors: Record<string, string> = {};
  if (!lead.name) errors.name = "required";
  if (!lead.business) errors.business = "required";
  if (!lead.interest) errors.interest = "required";
  if (!lead.phone) errors.phone = "required";
  else if (!validPhone(lead.phone)) errors.phone = "invalid";
  if (lead.email && !EMAIL.test(lead.email)) errors.email = "invalid";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  if (!mailerConfigured) {
    // Never claim success for a lead nobody will receive. Log it in full —
    // this line is the only copy — and name (never print) the missing vars.
    console.error("[kryptonix] mail not configured — lead NOT emailed", {
      missing: missingMailVars,
      lead,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 503 },
    );
  }

  try {
    await sendLeadEmail(lead);
  } catch (err) {
    // Log the whole lead: the mail is gone, this line is the only copy left.
    console.error("[kryptonix] lead email failed", { lead, err });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
