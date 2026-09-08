import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons/Bell";

/**
 * The homepage's "Not sure if you have a case?" banner — a full-width gold
 * strip holding one line of serif copy against two buttons.
 *
 * From `Cohen & Jaffe Homepage v1.dc.html` markup 621-628, the strip between
 * the WHY COHEN & JAFFE band and the FAQ. `CaseBanner.astro` carries the layout
 * reasoning and `scripts/seed-home-case-banner.ts` the provenance.
 *
 * ⚠️ THIS IS NOT THE BOARD'S "MID CTA BAR". That comment (line 576, above the
 * why-us band) has no markup under it and nothing was ever built for it. This
 * is a separate, fully drawn section further down the page.
 *
 * TWO FIELDS AND NO MORE. Two things the band draws are deliberately absent:
 *
 *   - NO PHONE NUMBER, and no field for one. The board writes the second button
 *     as "Call 516-358-6900", but the number is a Site Settings fact — it is in
 *     the header, the drawer, the footer and the fee explainer — so the
 *     component reads it through `getFirm()` and composes the label. That is
 *     AGENTS.md rule 9, and it is what stops this one button dialling a number
 *     the rest of the site has since corrected. The word "Call" is presentation
 *     glue in the component, the way the deadlines band renders its units.
 *   - NO EYEBROW. The band is one line and two buttons; the board draws no
 *     kicker over it and there is nothing for one to introduce.
 */
export const caseBannerSection = defineType({
  name: "caseBannerSection",
  title: "Case review banner",
  type: "object",
  icon: BellIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      description: "One line, set in the serif beside the buttons.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(40)
          .warning(
            "Measured: at 28px on a 375px phone this line has 335px to sit in, and the approved copy fills 313px of it. Much past ~40 characters it wraps to two lines there.",
          ),
    }),
    defineField({
      name: "cta",
      title: "Button",
      description:
        "The dark button. The second button beside it is the firm's phone number, which comes from Site Settings — it is not editable here, so it can never disagree with the header, the drawer or the footer.",
      type: "ctaLink",
      /**
       * OPTIONAL, matching `reviewsSection`, `deadlinesSection` and
       * `attorneysSection`, and the component guards it. Unlike the attorneys
       * band — where the button is the section's ONLY link out — removing this
       * one still leaves the call button, so the band keeps working rather than
       * becoming a dead end.
       */
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "cta.label" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "Case review banner",
      subtitle,
    }),
  },
});
