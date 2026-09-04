import type { SchemaTypeDefinition } from "sanity";

import { attorney } from "./documents/attorney";
import { caseResult } from "./documents/caseResult";
import { firmDetails } from "./documents/firmDetails";
import { featuredCaseResult } from "./documents/featuredCaseResult";
import { homePage } from "./documents/homePage";
import { practiceArea } from "./documents/practiceArea";
import { aboutSection } from "./objects/aboutSection";
import { attorneyQuote } from "./objects/attorneyQuote";
import { caseResultsSection } from "./objects/caseResultsSection";
import { expectation } from "./objects/expectation";
import { feeColumn } from "./objects/feeColumn";
import { feesSection } from "./objects/feesSection";
import { ctaLink } from "./objects/ctaLink";
import { hero } from "./objects/hero";
import { office } from "./objects/office";
import { representativeCase } from "./objects/representativeCase";
import { richText } from "./objects/richText";
import { stat } from "./objects/stat";
import { videoCard } from "./objects/videoCard";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homePage,
  featuredCaseResult,
  caseResult,
  attorney,
  practiceArea,
  firmDetails,
  // Section objects — one per band of a page
  hero,
  caseResultsSection,
  aboutSection,
  feesSection,
  // Shared objects
  attorneyQuote,
  ctaLink,
  expectation,
  feeColumn,
  office,
  representativeCase,
  richText,
  stat,
  videoCard,
];
