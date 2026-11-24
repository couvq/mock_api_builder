import { z } from "zod";
import { MockSchema } from "../../mock_schema.js";

export const MIN_DELAY = 0;
export const MAX_DELAY = 10000;
export const DEFAULT_DELAY = 0;

/**
 * HTTP status codes span the informational (1xx) through server-error (5xx)
 * ranges; 200 OK is the default a newly created endpoint returns.
 */
export const MIN_STATUS_CODE = 100;
export const MAX_STATUS_CODE = 599;
export const DEFAULT_STATUS_CODE = 200;

export const EndpointConfig = z.object({
  id: z.string(),
  method: z.enum(["GET", "POST"]),
  path: z.string(),
  statusCode: z
    .int()
    .min(MIN_STATUS_CODE)
    .max(MAX_STATUS_CODE)
    .default(DEFAULT_STATUS_CODE),
  delay: z.int().min(MIN_DELAY).max(MAX_DELAY).default(DEFAULT_DELAY),
  responseSchema: MockSchema,
});

export type EndpointConfig = z.infer<typeof EndpointConfig>;
