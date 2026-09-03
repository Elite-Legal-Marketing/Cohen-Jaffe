import type { PortableTextBlock } from "@portabletext/types";

/**
 * Hardcoded content for the homepage's "Our goals" section.
 *
 * TEMPORARY — and shaped deliberately. AGENTS.md → "Building sections: build
 * it, approve it, then wire it": the section is built with its copy hardcoded,
 * signed off, and only then modelled in Sanity. This constant is projected the
 * way the eventual GROQ query will project `homePage.about`, so wiring it up is
 * a swap in `src/pages/index.astro` — `homeAbout` becomes `home.about` — and
 * this file is deleted.
 *
 * ── Where the copy comes from ────────────────────────────────────────────────
 * The heading and both intro paragraphs are VERBATIM from the live WordPress
 * homepage (`Sitesucker/index.html`). The artboard's only edit is dropping the
 * SEO-stuffed firm name — live reads "At the Law Office of Cohen & Jaffe: Long
 * Island Personal Injury Lawyer" — which is kept here.
 *
 * The four "What you can expect" rows are NOT on the live site; they are the
 * artboard's own copy. Because they are operational promises about a real law
 * firm, each was checked against the mirror and two were rewritten to what the
 * firm actually publishes — see the notes on the rows themselves.
 */

export interface AboutExpectation {
  _key: string;
  /** Which brand glyph to draw. See `EXPECTATION_ICONS` in `About.astro`. */
  icon: "pressure" | "attorney" | "day-to-day" | "calls";
  title: string;
  blurb: string;
  /** The paragraph behind the "+" toggle. Optional: no detail, no toggle. */
  detail: string | null;
}

export interface AboutSection {
  eyebrow: string;
  heading: string;
  body: PortableTextBlock[];
  expectationsLabel: string;
  expectations: AboutExpectation[];
  quote: {
    text: string;
    /** The closing clause, set in olive roman against the italic. Optional. */
    accent: string | null;
    /** Becomes a `reference` to an `attorney` document when this is modelled. */
    attorney: {
      name: string;
      role: string;
      slug: string;
    };
  } | null;
  video: {
    eyebrow: string;
    title: string;
    wistiaId: string;
    coverAlt: string;
  } | null;
}

export const homeAbout: AboutSection = {
  eyebrow: "Compassionate. Relentless. Experienced.",
  heading: "Our goals are the same as yours.",

  body: [
    {
      _type: "block",
      _key: "about-body-1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "about-body-1a",
          marks: [],
          text: "At Cohen & Jaffe, our New York personal injury attorneys want to help you reclaim your life after you have suffered a serious personal injury. It’s about more than just negotiating with an insurance company or filing a lawsuit. An experienced Long Island personal injury lawyer will guide you through every step.",
        },
      ],
    },
    {
      _type: "block",
      _key: "about-body-2",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "about-body-2a",
          marks: [],
          text: "At the Law Office of Cohen & Jaffe, we take a comprehensive approach to helping accident victims. ",
        },
        {
          _type: "span",
          _key: "about-body-2b",
          marks: ["strong"],
          text: "We know that your immediate concerns include paying your bills, keeping your job and securing transportation",
        },
        {
          _type: "span",
          _key: "about-body-2c",
          marks: [],
          text: " — not to mention taking care of yourself and your family. We are here to help figure all that out.",
        },
      ],
    },
  ],

  expectationsLabel: "What you can expect",

  expectations: [
    {
      _key: "expect-pressure",
      icon: "pressure",
      title: "We take the pressure off",
      blurb:
        "The calls, the paperwork, and the lowball offers stop with us, so you can focus on healing.",
      detail:
        "Once you hire us, the adjuster calls us, not you. We handle the recorded statement request, the records release, the medical bills piling up in your mailbox, and the first lowball offer. You will not have to argue with anyone about your own injury.",
    },
    {
      _key: "expect-attorney",
      icon: "attorney",
      /**
       * REWRITTEN from the artboard, which read "Not just a paralegal or a
       * secretary, and never a call center queue" / "One of our partners is
       * assigned to your case and stays on it."
       *
       * Neither half survives a check against the firm's own site. It credits
       * its paralegals by name in the testimonials it publishes ("Paralegal
       * Cheryl, Attorney Caitlin"), so the dig is off-brand; and nothing
       * anywhere says a partner is assigned to each case. What the live site
       * DOES say is the stronger claim, so it is used instead.
       */
      title: "You work directly with an attorney",
      blurb: "Not a call center queue, and not a rotating case manager.",
      detail:
        "Clients get partner Richard Jaffe’s cell phone number for 24/7 accessibility. You will have your attorney’s name, and you will speak with them.",
    },
    {
      _key: "expect-day-to-day",
      icon: "day-to-day",
      title: "We help with the day-to-day",
      blurb:
        "Finding doctors who will treat you, replacing your vehicle, and handling persistent adjusters.",
      /**
       * TRIMMED. The artboard also promised "arranging transportation to
       * appointments" and "dealing with your employer about time off", which
       * the firm does not claim anywhere. The lien explanation is the live
       * site's own.
       */
      detail:
        "Finding doctors who will treat you on a lien — they will not require payment at the time they render care. Most of what people need in the first month is not legal work.",
    },
    {
      _key: "expect-calls",
      icon: "calls",
      title: "Calls returned within 24 hours",
      blurb:
        "With evening and weekend appointments when work or treatment gets in the way.",
      /** Every clause here is on the live site, including "we can come to you". */
      detail:
        "We return calls within 24 hours. We can arrange evening and weekend appointments when work or treatment makes daytime impossible — and if you cannot come to us, we can come to you.",
    },
  ],

  /**
   * ⚠️ THIS QUOTE IS NOT FROM A REAL SOURCE, and it is attributed to a real
   * person. It is the artboard's line, restored here on the client's explicit
   * instruction after the point was raised — the same call that was made for
   * the four featured case results. Richard Jaffe has never said it in
   * anything the site mirror contains.
   *
   * What the mirror DOES support: Jaffe is a certified emergency response
   * medic and a former firefighter. What it contradicts: his bio puts that
   * work in the past, so the artboard's companion line about a weekly
   * volunteer shift in Brentwood is not used anywhere.
   *
   * His real, sourced quote is on his `attorney` document and is what the
   * attorneys band should use — do not print this one and that one on the same
   * page. Get this line confirmed or replaced before launch.
   */
  quote: {
    text: "I worked ambulances before I practiced law, so I know what a serious injury does to a family.",
    accent: "We handle these cases personally.",
    attorney: {
      name: "Richard S. Jaffe",
      /**
       * The live site's title, not the artboard's "Managing Partner · Lead
       * Trial Lawyer" — that one is unevidenced and is an open question with
       * the firm. It comes from the `attorney` document once this is modelled,
       * so it will correct itself.
       */
      role: "Partner \u00b7 Personal Injury Attorney",
      slug: "richard-jaffe",
    },
  },

  /**
   * ⚠️ PLACEHOLDER VIDEO. No firm video exists on Wistia yet — all 81 are still
   * sitting in `~/Downloads/Cohen & Jaffe/Videos/` with an empty `wistia_id`
   * column — and the artboard's "Why we do this work · 2 min" is on neither the
   * site nor the YouTube channel. `c6b0eghb5r` is the same test id already
   * wired to the first case-result card, here so the card is verifiable end to
   * end. The id, the title and the duration all need replacing after upload.
   */
  video: {
    eyebrow: "Watch · 2 min",
    title: "Why we do this work",
    wistiaId: "c6b0eghb5r",
    coverAlt: "Richard S. Jaffe outside the Nassau County courthouse",
  },
};
