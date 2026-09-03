/**
 * Build a `tel:` href from a phone number as it is written on the page.
 *
 * Numbers are stored in Sanity in their DISPLAY form only — "516-358-6900" —
 * and the link is derived here. The alternative, storing the pair, is what the
 * old hardcoded constant did, and a pair is two things that can disagree: an
 * editor fixes the visible number and the link keeps dialling the old one, with
 * nothing to show for it until someone taps it on a phone.
 *
 * `+` survives for international numbers; everything else that is not a digit
 * goes, which covers the spaces, dots, dashes and parentheses a number gets
 * written with.
 */
export function telHref(display: string): string {
  return `tel:${display.replace(/[^0-9+]/g, "")}`;
}

/** The same, for a number that should open a text message instead. */
export function smsHref(display: string): string {
  return `sms:${display.replace(/[^0-9+]/g, "")}`;
}
