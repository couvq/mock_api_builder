import z from "zod";
import { EndpointConfig } from "./config";

export const CreateEndpointRequestSchema = EndpointConfig.omit({ id: true });

export type CreateEndpointRequest = z.infer<typeof CreateEndpointRequestSchema>