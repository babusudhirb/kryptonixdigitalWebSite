"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, FileText, Loader2, Upload, X } from "lucide-react";
import { applicationForm, brand, careers } from "@/content/site";
import { resumeProblem, validEmail, validPhone } from "@/lib/validate";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { Honeypot, honeypotValue } from "./Honeypot";
import styles from "./ApplicationForm.module.css";

type Field = "name" | "email" | "phone" | "role" | "resume" | "message";
type Values = { name: string; email: string; phone: string; role: string; message: string };
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", role: "", message: "" };

const ROLE_OPTIONS = [
  ...careers.roles.map((r) => r.title),
  applicationForm.generalRole,
];

function validate(v: Values, resume: File | null): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please tell us your name.";
  if (!v.email.trim()) e.email = "We need an email to reply to.";
  else if (!validEmail(v.email)) e.email = "That email doesn't look right.";
  if (!v.phone.trim()) e.phone = "We need a number to call you on.";
  else if (!validPhone(v.phone)) e.phone = "Enter a 10-digit mobile number.";
  if (!v.role) e.role = "Pick the role you're applying for.";
  if (!resume) e.resume = "Attach your resume to apply.";
  else {
    const problem = resumeProblem(resume);
    if (problem) e.resume = problem;
  }
  return e;
}

export function ApplicationForm({
  titleId,
  roleId,
  onDone,
}: {
  titleId: string;
  /** Pre-selects the role when opened from a specific opening. */
  roleId?: string;
  onDone: () => void;
}) {
  const preset = careers.roles.find((r) => r.id === roleId)?.title ?? "";
  const [values, setValues] = useState<Values>({ ...EMPTY, role: preset });
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearError = (field: Field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const set =
    (field: Exclude<Field, "resume">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      clearError(field);
    };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResume(e.target.files?.[0] ?? null);
    clearError("resume");
  };

  const dropFile = () => {
    setResume(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Never reload: a reload would throw away everything already typed.
    e.preventDefault();

    const found = validate(values, resume);
    setErrors(found);
    const firstBad = (Object.keys(found) as Field[])[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      // multipart, not JSON — the resume is a real file.
      const body = new FormData();
      body.append("name", values.name);
      body.append("email", values.email);
      body.append("phone", values.phone);
      body.append("role", values.role);
      body.append("message", values.message);
      if (resume) body.append("resume", resume);
      body.append(HONEYPOT_FIELD, honeypotValue(formRef.current));

      const res = await fetch("/api/careers", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneTile} aria-hidden="true">
          <Check size={26} strokeWidth={3} />
        </span>
        <h2 id={titleId} className={styles.doneTitle}>
          {applicationForm.success.title}
        </h2>
        <p className={styles.doneBody}>{applicationForm.success.body}</p>
        <button type="button" className="kx-btn kx-btn--violet" onClick={onDone}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2 id={titleId} className={styles.title}>
        {applicationForm.title}
      </h2>
      <p className={styles.lead}>{applicationForm.lead}</p>

      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <Text
          field="name"
          label="Full Name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={set("name")}
        />
        <Text
          field="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={set("email")}
        />
        <Text
          field="phone"
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          error={errors.phone}
          onChange={set("phone")}
        />

        <p className={styles.field}>
          <label className={styles.label} htmlFor="kx-role">
            Role applying for <span className={styles.req}>*</span>
          </label>
          <select
            id="kx-role"
            name="role"
            className={`${styles.input} ${styles.select} ${errors.role ? styles.bad : ""}`}
            value={values.role}
            onChange={set("role")}
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={errors.role ? "kx-role-err" : undefined}
          >
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.role ? (
            <span id="kx-role-err" className={styles.err}>
              {errors.role}
            </span>
          ) : null}
        </p>

        {/* Resume ------------------------------------------------------- */}
        <p className={styles.field}>
          <label className={styles.label} htmlFor="kx-resume">
            Resume <span className={styles.req}>*</span>{" "}
            <span className={styles.opt}>
              (PDF, DOC or DOCX — max {applicationForm.maxResumeMb}MB)
            </span>
          </label>

          <input
            ref={fileRef}
            id="kx-resume"
            name="resume"
            type="file"
            accept={applicationForm.accept}
            className={styles.fileInput}
            onChange={onFile}
            aria-invalid={errors.resume ? true : undefined}
            aria-describedby={errors.resume ? "kx-resume-err" : undefined}
          />

          <label
            htmlFor="kx-resume"
            className={`${styles.drop} ${errors.resume ? styles.bad : ""} ${
              resume ? styles.dropFilled : ""
            }`}
          >
            {resume ? (
              <>
                <FileText size={18} strokeWidth={2} aria-hidden="true" />
                <span className={styles.fileName}>{resume.name}</span>
                <span className={styles.fileSize}>
                  {(resume.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </>
            ) : (
              <>
                <Upload size={18} strokeWidth={2} aria-hidden="true" />
                <span className={styles.fileName}>Choose a file</span>
              </>
            )}
          </label>

          {resume ? (
            <button type="button" className={styles.clear} onClick={dropFile}>
              <X size={13} strokeWidth={2.6} aria-hidden="true" />
              Remove file
            </button>
          ) : null}

          {errors.resume ? (
            <span id="kx-resume-err" className={styles.err}>
              {errors.resume}
            </span>
          ) : null}
        </p>

        <p className={styles.field}>
          <label className={styles.label} htmlFor="kx-message">
            Message <span className={styles.opt}>(Optional)</span>
          </label>
          <textarea
            id="kx-message"
            name="message"
            rows={4}
            className={`${styles.input} ${styles.textarea}`}
            value={values.message}
            onChange={set("message")}
            placeholder="Anything you'd like us to know — a portfolio link, what you want to work on…"
          />
        </p>

        <Honeypot />

        {status === "failed" ? (
          <p className={styles.formErr} role="alert">
            Something went wrong sending that. Please try again, or email us at{" "}
            <a href={brand.emailHref}>{brand.email}</a>.
          </p>
        ) : null}

        <button
          type="submit"
          className={`kx-btn kx-btn--grad ${styles.submit}`}
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <Loader2 size={17} className={styles.spin} aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              {applicationForm.submit}
              <ArrowRight size={18} className="kx-arrow" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function Text({
  field,
  label,
  value,
  error,
  onChange,
  type = "text",
  ...rest
}: {
  field: Field;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  const id = `kx-app-${field}`;
  return (
    <p className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label} <span className={styles.req}>*</span>
      </label>
      <input
        id={id}
        name={field}
        type={type}
        className={`${styles.input} ${error ? styles.bad : ""}`}
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${id}-err`} className={styles.err}>
          {error}
        </span>
      ) : null}
    </p>
  );
}
