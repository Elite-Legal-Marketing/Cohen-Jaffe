import type { SchemaTypeDefinition } from "sanity";

import { attorney } from "./documents/attorney";
import { caseResult } from "./documents/caseResult";
import { contactSection } from "./documents/contactSection";
import { faq } from "./documents/faq";
import { faqsPage } from "./documents/faqsPage";
import { firmDetails } from "./documents/firmDetails";
import { featuredCaseResult } from "./documents/featuredCaseResult";
import { homePage } from "./documents/homePage";
import { organization } from "./documents/organization";
import { practiceArea } from "./documents/practiceArea";
import { thankYouPage } from "./documents/thankYouPage";
import { review } from "./documents/review";
import { videoReview } from "./documents/videoReview";
import { aboutSection } from "./objects/aboutSection";
import { attorneyQuote } from "./objects/attorneyQuote";
import { attorneysSection } from "./objects/attorneysSection";
import { caseBannerSection } from "./objects/caseBannerSection";
import { caseResultsSection } from "./objects/caseResultsSection";
import { expectation } from "./objects/expectation";
import { feeColumn } from "./objects/feeColumn";
import { feesSection } from "./objects/feesSection";
import { ctaLink } from "./objects/ctaLink";
import { deadlineFigure } from "./objects/deadlineFigure";
import { deadlinesSection } from "./objects/deadlinesSection";
import { faqSection } from "./objects/faqSection";
import { reviewsSection } from "./objects/reviewsSection";
import { hero } from "./objects/hero";
import { office } from "./objects/office";
import { practiceAreaTab } from "./objects/practiceAreaTab";
import { practiceAreasSection } from "./objects/practiceAreasSection";
import { representativeCase } from "./objects/representativeCase";
import { richText } from "./objects/richText";
import { stat } from "./objects/stat";
import { textLink } from "./objects/textLink";
import { videoCard } from "./objects/videoCard";
import { waitStep } from "./objects/waitStep";
import { whyReason } from "./objects/whyReason";
import { whyUsSection } from "./objects/whyUsSection";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homePage,
  faqsPage,
  thankYouPage,
  featuredCaseResult,
  caseResult,
  attorney,
  practiceArea,
  review,
  videoReview,
  faq,
  organization,
  firmDetails,
  contactSection,
  // Section objects — one per band of a page
  hero,
  caseResultsSection,
  aboutSection,
  feesSection,
  practiceAreasSection,
  deadlinesSection,
  reviewsSection,
  attorneysSection,
  whyUsSection,
  caseBannerSection,
  faqSection,
  // Shared objects
  attorneyQuote,
  ctaLink,
  deadlineFigure,
  expectation,
  feeColumn,
  office,
  practiceAreaTab,
  representativeCase,
  richText,
  stat,
  textLink,
  videoCard,
  waitStep,
  whyReason,
];
