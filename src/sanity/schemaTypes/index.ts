import type { SchemaTypeDefinition } from "sanity";

import { caseResult } from "./documents/caseResult";
import { featuredCaseResult } from "./documents/featuredCaseResult";
import { homePage } from "./documents/homePage";
import { caseResultsSection } from "./objects/caseResultsSection";
import { ctaLink } from "./objects/ctaLink";
import { hero } from "./objects/hero";
import { richText } from "./objects/richText";
import { stat } from "./objects/stat";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homePage,
  featuredCaseResult,
  caseResult,
  // Objects
  hero,
  caseResultsSection,
  ctaLink,
  richText,
  stat,
];
