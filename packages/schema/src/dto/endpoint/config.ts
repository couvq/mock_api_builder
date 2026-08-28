import { z } from "zod";
import { MockSchema } from "../../mock_schema";

export const EndpointConfig = z.object({
  id: z.string(),
  method: z.enum(["GET"]),
  path: z.string(),
  responseSchema: MockSchema,
});

export type EndpointConfig = z.infer<typeof EndpointConfig>;
