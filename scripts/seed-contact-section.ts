/**
 * Seed the Contact Form singleton (Site Settings → Contact Form).
 *
 *   npx sanity exec scripts/seed-contact-section.ts --with-user-token
 *
 * From `CJContactForm.dc.html`. A Site Settings singleton rather than a page
 * field because the artboard imports this same band on several pages, which is
 * rule 9's bar — modelling it per page would mean the same paragraph maintained
 * in five documents, drifting apart.
 *
 * ⚠️ NO PHONE OR TEXT NUMBER HERE. The board hardcodes `tel:5163586900` and
 * `sms:5164004967`; both come from `firmDetails` through `getFirm()`. What this
 * holds is the LABEL over each number, because the number already appears in the
 * header, the drawer, the footer, the fee band and the case banner.
 *
 * ⚠️ THE DISCLAIMER IS LEGAL TEXT, verbatim from the board. The first sentence
 * is what stops an enquiry being treated as representation; the second is the
 * consent for the firm's text messages. Neither is decoration.
 *
 * ⚠️ SEEDING THIS DOES NOT WIRE THE FORM. It still has no destination — see
 * `ContactForm.astro`, where `ENDPOINT` is null and a valid submission says so
 * rather than pretending to succeed.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SECTION = {
  _id: "contactSection",
  _type: "contactSection",
  eyebrow: "Get answers now",
  heading: "Take the first step. We will do the rest.",
  lead: "Tell us what happened. We will listen, answer your questions, and help you understand your options — and you pay nothing unless we win.",
  callLabel: "Call, 24 hours a day",
  textLabel: "Text us 24/7",
  travelLabel: "Cannot travel?",
  travelText: "We will come to you",
  noteLabel: "Free · Confidential · No obligation",
  disclaimer:
    "Submitting this form does not create an attorney-client relationship. Cohen & Jaffe will send messages regarding case details and status updates; message and data rates may apply.",
  badge: "No pressure · no obligation",
  formHeading: "Request a free consultation",
  submitLabel: "Submit — free consultation",
  spanishLabel: "Please contact me in Spanish · Comuníquese conmigo en español",
};

async function main() {
  const existing = await client.fetch<boolean>(`defined(*[_id == "contactSection"][0]._id)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "contactSection already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }
  await client.createOrReplace(SECTION);
  console.log("Done — contactSection seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
