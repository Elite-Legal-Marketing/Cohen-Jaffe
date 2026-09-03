/**
 * Hardcoded content for the homepage's fee explainer band.
 *
 * TEMPORARY, and shaped the way the eventual GROQ projection will return
 * `homePage.fees` — AGENTS.md → "Building sections": build it, approve it, then
 * model it. Wiring is a swap in `src/pages/index.astro` and this file is
 * deleted.
 *
 * ── Where the copy comes from ────────────────────────────────────────────────
 * This band is the homepage's version of the firm's **"No Fee Promise"**, which
 * is a named thing with its own page — `Sitesucker/about/no-fee-promise/`.
 * That page is the source, and it is unusually good: it states the fee, the
 * costs and the losing case explicitly, which is exactly what the three columns
 * need. (It is also under /about/, which is why this section reads as part of
 * "about" even though it sits on the homepage.)
 *
 * These are FEE REPRESENTATIONS BY A LAW FIRM, so every clause was checked
 * against that page rather than taken from the artboard. Two did not survive;
 * both are noted on the field itself.
 */

export interface FeeColumn {
  _key: string;
  label: string;
  body: string;
}

export interface FeesSection {
  heading: string;
  columns: FeeColumn[];
  quote: {
    text: string;
    /** Becomes a `reference` to an `attorney` document when this is modelled. */
    attorney: { name: string; role: string; slug: string };
  } | null;
  cta: { label: string; href: string } | null;
  /** The "or call …" line beside the button. */
  phone: { label: string; number: string } | null;
  disclaimer: string;
}

export const homeFees: FeesSection = {
  heading: "No fee unless we win — here is what that actually means.",

  columns: [
    {
      _key: "fee-what",
      label: "What is the fee",
      /**
       * REWRITTEN. The artboard's second sentence — "you are welcome to have
       * another lawyer review it first" — is supported nowhere on the live
       * site. It is a benign, client-favourable claim, but it is still a
       * representation about how this firm operates, so it is not ours to
       * make up. Replaced with two things the No Fee Promise page states
       * outright: no hourly fees, and no bill for contact time.
       */
      body: "An agreed-upon percentage of what we recover for you, and nothing else. There are no hourly fees, ever — and no bill for a phone call, an email, or a meeting in our office.",
    },
    {
      _key: "fee-costs",
      label: "What about costs",
      /**
       * The artboard also lists "depositions". The live site names court and
       * filing fees, medical records and expert doctors; depositions are a
       * normal litigation cost but the firm does not list them, so the list
       * here is theirs rather than ours.
       */
      body: "Costs are separate from fees, and this is where people get surprised. Court and filing fees, medical records, expert doctors — we advance all of it. We will never ask you for money the entire time we work on your case.",
    },
    {
      _key: "fee-lose",
      label: "What if we lose",
      /**
       * The load-bearing one, and it is fully evidenced: "if you don't win
       * your case, you don't owe us a penny. Period." and "If for some reason
       * we are unable to get you compensation, you will never have to pay us
       * back for these expenses." Many firms do NOT absorb advanced costs on a
       * loss — this one says it does, in writing, on its own site.
       */
      body: "Nothing. You do not owe us a penny, and you never pay back the costs we advanced. No bill from this firm for a case we did not win.",
    },
  ],

  /**
   * The artboard's line here — "No one should have to decide between paying
   * rent and hiring a lawyer" — is INVENTED, like the one it gives Jaffe in the
   * section above. It appears nowhere in the mirror.
   *
   * Cohen's real quote is used instead, and it is a good fit for a section
   * about not pricing people out: it is about the firm's footing with its
   * clients, and it is the one of the three partners' sourced quotes still
   * unspent, since the band above took Jaffe's. Same person the artboard
   * attributes to, so nothing about the design changes.
   *
   * If the artboard's line is wanted anyway, that is the same call already
   * made for Jaffe — but note this one sits inside a paragraph about money,
   * where an invented sentence is a worse thing to be wrong about.
   */
  quote: {
    text: "I take great pride that the firm is really people-related. I want the firm to convey the idea that when they come in to see us, we’re no better than they are.",
    attorney: {
      name: "Stephen M. Cohen",
      role: "Partner",
      slug: "stephen-cohen",
    },
  },

  cta: { label: "Talk to us — it is free", href: "/contact/" },
  phone: { label: "or call", number: "516-358-6900" },

  /**
   * Accurate and worth keeping. New York Judiciary Law § 474-a really does put
   * medical malpractice on a sliding scale rather than a flat percentage, and
   * the firm's own blog already explains it — "the fee usually starts at 30% of
   * the first $250,000". Do not drop this line to save space.
   */
  disclaimer:
    "Your written fee agreement governs. Medical malpractice cases follow a different fee schedule under New York law.",
};
