import type { SchemaTypeDefinition } from "sanity";

import { homePage } from "./documents/homePage";
import { ctaLink } from "./objects/ctaLink";
import { hero } from "./objects/hero";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homePage,
  // Objects
  hero,
  ctaLink,
];
