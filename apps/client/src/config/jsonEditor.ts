import { FakerSchema } from "@mock-api-builder/schema";
import type { TypeOptions } from "json-edit-react";

// The value types a response-schema field may hold in the JsonEditor: the JSON
// primitives/collections plus the project's supported Faker types.
export const FAKER_TYPE_SELECTION: TypeOptions = [
  "object",
  "array",
  "string",
  "number",
  "boolean",
  {
    enum: "Faker Type",
    values: FakerSchema.options,
    matchPriority: 1,
  },
];

// The Faker type pre-selected when a new response-schema field is added.
export const DEFAULT_FAKER_TYPE = FakerSchema.options[0];
