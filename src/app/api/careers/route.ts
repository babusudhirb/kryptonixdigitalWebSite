import { NextResponse } from "next/server";
import { mailerConfigured, sendApplicationEmail } from "@/lib/mailer";
import { RESUME_MAX_BYTES, resumeProblem, validEmail, validPhone } from "@/lib/validate";

/**
 * Job application intake.
 *
 * Mirrors src/app/api/lead/route.ts — validate, then mail — with one
 * difference: the resume means the body is multipart, not JSON, so this reads
 * `request.formData()` instead of `request.json()`.
 *
 * As with leads, when the mail env vars are absent the application is logged
 * rather than dropped, so local dev works end to end without .env.local.
 */

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
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
    console.warn("[kryptonix] mail env vars missing — application not emailed", {
      ...application,
      resume: `${file.name} (${bytes.byteLength} bytes)`,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  try {
    await sendApplicationEmail(application, { filename: file.name, content: bytes });
  } catch (err) {
    // Log the whole application: the mail is gone, this line is the only copy.
    console.error("[kryptonix] application email failed", { application, err });
    return NextResponse.json(
      { ok: false, error: "Could not send that right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
