/**
 * Name of the hidden anti-spam field rendered by <Honeypot /> in both forms
 * and checked by both API routes. People never see or reach it; naive bots
 * fill every input they find.
 *
 * Deliberately meaningless: a name like "website" or "company" invites browser
 * autofill and password managers to fill it on a real person's behalf.
 */
export const HONEYPOT_FIELD = "kx_hp_ref";
