import { NextResponse } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { mailErrorSummary, mailerConfigured, missingMailVars, sendLeadEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/spam";

/**
 * Strategy-call lead intake.
 *
 * A valid lead is emailed to TRIAL_RECEIVER_EMAIL (see src/lib/mailer.ts).
 * Success is only reported once that email has actually been sent: when the
 * mail env vars are missing the request fails with 503, and a failed send
 * with 502, so the visitor knows to retry or call.
 *
 * Privacy: the email is the only record of a lead. Server logs are not lead
 * storage and never receive a name, business, phone, email or interest —
 * only event names, timestamps, missing env var *names* and SMTP error codes.
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
  // not learn to adapt, and send nothing. The log line only counts the event.
  if (str(body[HONEYPOT_FIELD])) {
    console.warn("[kryptonix] lead honeypot tripped — not emailed", {
      at: new Date().toISOString(),
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
    // Never claim success for a lead nobody will receive. Log which env vars
    // are missing (names only, never values) and when — nothing about the lead.
    console.error("[kryptonix] mail not configured — lead NOT emailed", {
      missing: missingMailVars,
      at: new Date().toISOString(),
    });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 503 },
    );
  }

  try {
    await sendLeadEmail(lead);
  } catch (err) {
    // Diagnostic codes only — no lead data, no raw error object.
    console.error("[kryptonix] lead email failed", {
      ...mailErrorSummary(err),
      at: new Date().toISOString(),
    });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
