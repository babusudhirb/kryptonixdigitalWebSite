import { NextResponse } from "next/server";
import { mailerConfigured, sendLeadEmail } from "@/lib/mailer";

/**
 * Strategy-call lead intake.
 *
 * A valid lead is emailed to TRIAL_RECEIVER_EMAIL (see src/lib/mailer.ts).
 * When the mail env vars are absent — a bare checkout, no .env.local — the
 * lead is logged instead of dropped, so local dev still works end to end.
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
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
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
    console.warn(
      "[kryptonix] mail env vars missing — lead not emailed",
      { ...lead, receivedAt: new Date().toISOString() },
    );
    return NextResponse.json({ ok: true });
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
