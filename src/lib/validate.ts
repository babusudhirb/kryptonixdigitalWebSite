/**
 * Validation rules shared by the browser and the API routes, so the two can
 * never drift apart. The client copy exists to give fast inline feedback; the
 * server copy is the one that actually decides.
 */

export const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function validEmail(raw: string) {
  return EMAIL.test(raw.trim());
}

/**
 * Indian mobile numbers, written however people actually type them:
 * `9876543210`, `98765 43210`, `+91 98765-43210`, `091…`, `0 98765 43210`.
 * Strip everything that is not a digit, drop a leading 91 or 0, then require
 * ten digits starting 6-9.
 */
export function validPhone(raw: string) {
  const local = raw.replace(/\D/g, "").replace(/^(?:0+|91)/, "");
  return /^[6-9]\d{9}$/.test(local);
}

/** Digits-only form of the phone, for a tel: link that always dials. */
export function telHref(raw: string) {
  const local = raw.replace(/\D/g, "").replace(/^(?:0+|91)/, "");
  return `+91${local}`;
}

/* ---------- Resume upload ---------- */

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

/** Browsers are inconsistent about .doc/.docx MIME types, so the extension is
 *  the primary check and the MIME list is a secondary allow-list. */
export const RESUME_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

export function resumeProblem(file: { name: string; size: number; type: string }): string | null {
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Upload a PDF, DOC or DOCX file.";
  }
  if (file.type && !RESUME_MIME.includes(file.type)) {
    return "Upload a PDF, DOC or DOCX file.";
  }
  if (file.size > RESUME_MAX_BYTES) {
    return `That file is over ${RESUME_MAX_BYTES / 1024 / 1024}MB. Please upload a smaller one.`;
  }
  if (file.size === 0) {
    return "That file appears to be empty.";
  }
  return null;
}
