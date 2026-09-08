import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/**
 * The contact band — the firm's three ways in, and the consultation form.
 *
 * A SITE SETTINGS SINGLETON, not a field on a page. The artboard imports this
 * same band on the FAQs page, the blog post and elsewhere, and rule 9's bar for
 * Site Settings is "appears in more than one place". Modelling it per page would
 * mean the same paragraph maintained in five documents, drifting apart.
 *
 * ⚠️ THE PHONE AND TEXT NUMBERS ARE NOT HERE. They are `firmDetails.phone` and
 * `firmDetails.sms`, read through `getFirm()`, with `telHref()` / `smsHref()`
 * deriving the links. What this document holds is the LABEL over each number —
 * "Call, 24 hours a day" — because the number itself already appears in the
 * header, the drawer, the footer, the fee band and the case banner, and a sixth
 * copy is a sixth thing to forget when it changes.
 *
 * ⚠️ THE DISCLAIMER IS THE ONE FIELD HERE WITH LEGAL WEIGHT. "Submitting this
 * form does not create an attorney-client relationship" is the sentence that
 * stops an enquiry being treated as representation, and the messaging line is
 * what makes the firm's SMS follow-up consented to. Neither is decoration and
 * neither should be trimmed for length.
 *
 * ⚠️ NOTHING HERE CHANGES WHERE THE FORM SUBMITS. It still has no destination —
 * see `ContactForm.astro`, where `ENDPOINT` is null and a valid submission says
 * so rather than pretending. Modelling the copy does not wire the form.
 */
export const contactSection = defineType({
  name: "contactSection",
  title: "Contact Form",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "ways", title: "Ways to reach us" },
    { name: "form", title: "The form" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "copy",
      validation: (rule) => rule.required().max(28).warning("One line above the heading."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule.required().max(56).warning("Set at 42px in a half-width column — two lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "text",
      rows: 3,
      group: "copy",
      validation: (rule) => rule.required().max(220).warning("Three lines at most."),
    }),
    defineField({
      name: "callLabel",
      title: "Label over the phone number",
      description: "The number itself comes from Site Settings → Firm Details.",
      type: "string",
      group: "ways",
      validation: (rule) => rule.required().max(28).warning("A short label on one line."),
    }),
    defineField({
      name: "textLabel",
      title: "Label over the text number",
      description: "The number itself comes from Site Settings → Firm Details.",
      type: "string",
      group: "ways",
      validation: (rule) => rule.required().max(28).warning("A short label on one line."),
    }),
    defineField({
      name: "travelLabel",
      title: "Third row — label",
      type: "string",
      group: "ways",
      validation: (rule) => rule.required().max(28).warning("A short label on one line."),
    }),
    defineField({
      name: "travelText",
      title: "Third row — answer",
      description: "Set in serif, where the other two rows show a number.",
      type: "string",
      group: "ways",
      validation: (rule) => rule.required().max(40).warning("One line."),
    }),
    defineField({
      name: "noteLabel",
      title: "Reassurance line",
      description: 'The gold line over the disclaimer — "Free · Confidential · No obligation".',
      type: "string",
      group: "copy",
      validation: (rule) => rule.required().max(48).warning("One line."),
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      description:
        "⚠️ Legal text. The first sentence is what stops an enquiry being treated as representation; the second is the consent for the firm's text messages. Do not shorten either without the firm's sign-off.",
      type: "text",
      rows: 4,
      group: "copy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Caption over the photograph",
      type: "string",
      group: "form",
      validation: (rule) => rule.required().max(40).warning("One line over the image."),
    }),
    defineField({
      name: "formHeading",
      title: "Form heading",
      type: "string",
      group: "form",
      validation: (rule) => rule.required().max(44).warning("Set at 32px — two lines at most."),
    }),
    defineField({
      name: "submitLabel",
      title: "Button",
      description: "The label on the submit button.",
      type: "string",
      group: "form",
      validation: (rule) =>
        rule
          .required()
          .max(32)
          .warning("A full-width button, but a longer label wraps on a phone."),
    }),
    defineField({
      name: "spanishLabel",
      title: "Spanish checkbox",
      description:
        "⚠️ A contact PREFERENCE, not the deferred Spanish section — it presumes someone acts on it, which is worth confirming when the form is wired.",
      type: "string",
      group: "form",
      validation: (rule) => rule.required().max(90).warning("Two lines beside the checkbox."),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Form" }),
  },
});
