import { NextResponse } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import {
  mailErrorSummary,
  mailerConfigured,
  missingMailVars,
  sendApplicationEmail,
} from "@/lib/mailer";
import { rateLimit } from "@/lib/spam";
import { RESUME_MAX_BYTES, resumeProblem, validEmail, validPhone } from "@/lib/validate";

/**
 * Job application intake.
 *
 * Mirrors src/app/api/lead/route.ts — validate, then mail — with one
 * difference: the resume means the body is multipart, not JSON, so this reads
 * `request.formData()` instead of `request.json()`.
 *
 * As with leads, success is only reported once the email has been sent: when
 * the mail env vars are missing the request fails with 503, and a failed send
 * with 502. Same rate limit and honeypot.
 *
 * Privacy: the email is the only record of an application. Server logs are
 * not application storage and never receive a name, email, phone, role,
 * message or anything about the resume — only event names, timestamps,
 * missing env var *names* and SMTP error codes.
 */

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  const wait = rateLimit(request, "careers");
  if (wait !== null) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot filled: answer like a success and send nothing. The log line only
  // counts the event.
  if (str(form.get(HONEYPOT_FIELD))) {
    console.warn("[kryptonix] careers honeypot tripped — not emailed", {
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  const application = {
    name: str(form.get("name")),
    email: str(form.get("email")),
    phone: str(form.get("phone")),
    role: str(form.get("role")),
    message: str(form.get("message")),
  };

  const resume = form.get("resume");
  const errors: Record<string, string> = {};

  if (!application.name) errors.name = "required";
  if (!application.email) errors.email = "required";
  else if (!validEmail(application.email)) errors.email = "invalid";
  if (!application.phone) errors.phone = "required";
  else if (!validPhone(application.phone)) errors.phone = "invalid";
  if (!application.role) errors.role = "required";

  // `instanceof File` is available in the Node runtime Next 15 uses.
  if (!(resume instanceof File)) {
    errors.resume = "required";
  } else {
    const problem = resumeProblem({ name: resume.name, size: resume.size, type: resume.type });
    if (problem) errors.resume = "invalid";
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const file = resume as File;
  const bytes = Buffer.from(await file.arrayBuffer());

  // Re-check after reading: the multipart header could have understated it.
  if (bytes.byteLength > RESUME_MAX_BYTES) {
    return NextResponse.json(
      { ok: false, errors: { resume: "invalid" } },
      { status: 413 },
    );
  }

  if (!mailerConfigured) {
    // Never claim success for an application nobody will receive. Log which
    // env vars are missing (names only, never values) and when — nothing else.
    console.error("[kryptonix] mail not configured — application NOT emailed", {
      missing: missingMailVars,
      at: new Date().toISOString(),
    });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 503 },
    );
  }

  try {
    await sendApplicationEmail(application, { filename: file.name, content: bytes });
  } catch (err) {
    // Diagnostic codes only — no application data, no raw error object.
    console.error("[kryptonix] application email failed", {
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
