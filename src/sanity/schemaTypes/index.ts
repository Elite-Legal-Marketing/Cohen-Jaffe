import type { SchemaTypeDefinition } from "sanity";

import { homePage } from "./documents/homePage";
import { ctaLink } from "./objects/ctaLink";
import { hero } from "./objects/hero";
import { richText } from "./objects/richText";
import { stat } from "./objects/stat";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homePage,
  // Objects
  hero,
  ctaLink,
  richText,
  stat,
];
