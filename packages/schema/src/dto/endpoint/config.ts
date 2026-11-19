import { z } from "zod";
import { MockSchema } from "../../mock_schema.js";

export const EndpointConfig = z.object({
  id: z.string(),
  method: z.enum(["GET", "POST"]),
  path: z.string(),
  delay: z.number().default(0),
  responseSchema: MockSchema,
});

export type EndpointConfig = z.infer<typeof EndpointConfig>;
