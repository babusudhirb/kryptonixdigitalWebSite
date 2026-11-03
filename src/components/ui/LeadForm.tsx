"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { leadForm } from "@/content/site";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { Honeypot, honeypotValue } from "./Honeypot";
import styles from "./LeadForm.module.css";

type Field = "name" | "business" | "interest" | "phone" | "email";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", business: "", interest: "", phone: "", email: "" };

/**
 * Indian mobile numbers, written however people actually type them:
 * `9876543210`, `98765 43210`, `+91 98765-43210`, `091…`, `0 98765 43210`.
 * Strip everything that is not a digit, drop a leading 91 or 0, then require
 * ten digits starting 6-9.
 */
function validPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const local = digits.replace(/^(?:0+|91)/, "");
  return /^[6-9]\d{9}$/.test(local);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please tell us your name.";
  if (!v.business.trim()) e.business = "Please add your business name.";
  if (!v.interest) e.interest = "Pick the one closest to what you need.";
  if (!v.phone.trim()) e.phone = "We need a number to call you back on.";
  else if (!validPhone(v.phone)) e.phone = "Enter a 10-digit mobile number.";
  // Optional — only checked when something was actually typed.
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = "That email doesn't look right.";
  return e;
}

export function LeadForm({ titleId, onDone }: { titleId: string; onDone: () => void }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    // Clear this field's error as soon as the user starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Never reload: a reload would throw away everything already typed.
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    const firstBad = (Object.keys(found) as Field[])[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypotValue(formRef.current) }),
      });
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
          {leadForm.success.title}
        </h2>
        <p className={styles.doneBody}>{leadForm.success.body}</p>
        <button type="button" className="kx-btn kx-btn--violet" onClick={onDone}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2 id={titleId} className={styles.title}>
        {leadForm.title}
      </h2>
      <p className={styles.lead}>{leadForm.lead}</p>

      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <Text
          field="name"
          label="Name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={set("name")}
        />
        <Text
          field="business"
          label="Business Name"
          autoComplete="organization"
          value={values.business}
          error={errors.business}
          onChange={set("business")}
        />

        <p className={styles.field}>
          <label className={styles.label} htmlFor="kx-interest">
            What are you looking for? <span className={styles.req}>*</span>
          </label>
          <select
            id="kx-interest"
            name="interest"
            className={`${styles.input} ${styles.select} ${errors.interest ? styles.bad : ""}`}
            value={values.interest}
            onChange={set("interest")}
            aria-invalid={errors.interest ? true : undefined}
            aria-describedby={errors.interest ? "kx-interest-err" : undefined}
          >
            <option value="">Select an option</option>
            {leadForm.interests.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.interest ? (
            <span id="kx-interest-err" className={styles.err}>
              {errors.interest}
            </span>
          ) : null}
        </p>

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
        <Text
          field="email"
          label="Email"
          optional
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={set("email")}
        />

        <Honeypot />

        {status === "failed" ? (
          <p className={styles.formErr} role="alert">
            Something went wrong sending that. Please try again, or call us on{" "}
            <a href="tel:+917004708826">+91 7004708826</a>.
          </p>
        ) : null}

        <button
          type="submit"
          className={`kx-btn kx-btn--pink ${styles.submit}`}
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <Loader2 size={17} className={styles.spin} aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              {leadForm.submit}
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
  optional = false,
  type = "text",
  ...rest
}: {
  field: Field;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  const id = `kx-${field}`;
  return (
    <p className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}{" "}
        {optional ? (
          <span className={styles.opt}>(Optional)</span>
        ) : (
          <span className={styles.req}>*</span>
        )}
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
