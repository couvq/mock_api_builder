import { z } from "zod";
import { MockSchema } from "../../mock_schema.js";

const MIN_DELAY = 0;
const MAX_DELAY = 10000;
const DEFAULT_DELAY = 0;

export const EndpointConfig = z.object({
  id: z.string(),
  method: z.enum(["GET", "POST"]),
  path: z.string(),
  delay: z.int().min(MIN_DELAY).max(MAX_DELAY).default(DEFAULT_DELAY),
  responseSchema: MockSchema,
});

export type EndpointConfig = z.infer<typeof EndpointConfig>;
