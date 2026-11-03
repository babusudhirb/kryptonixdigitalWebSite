import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * Hidden anti-spam field. Uncontrolled on purpose: the forms read it from the
 * DOM at submit time, so it never touches their state.
 *
 * Hidden from everyone: clipped to nothing (no layout shift, no overflow —
 * it is absolutely positioned, so the form grid gives it no cell or gap),
 * aria-hidden for screen readers and tabIndex -1 so Tab never lands on it.
 * Keep it away from the first or last position in a form: the modal's focus
 * trap wraps on the first and last focusable inputs.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/** The honeypot's value from a form element, for the submit handlers. */
export function honeypotValue(form: HTMLFormElement | null): string {
  const el = form?.elements.namedItem(HONEYPOT_FIELD);
  return el instanceof HTMLInputElement ? el.value : "";
}
