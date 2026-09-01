import z from "zod";
import { EndpointConfig } from "./config.js";

export const CreateEndpointRequestSchema = EndpointConfig.omit({ id: true });

export type CreateEndpointRequest = z.infer<typeof CreateEndpointRequestSchema>;

export const CreateEndpointResponseSchema = EndpointConfig;

export type CreateEndpointResponse = z.infer<
  typeof CreateEndpointResponseSchema
>;

export const UpdateEndpointRequestSchema = EndpointConfig;

export type UpdateEndpointRequest = z.infer<typeof UpdateEndpointRequestSchema>;

export const UpdateEndpointResponseSchema = EndpointConfig;

export type UpdateEndpointResponse = z.infer<
  typeof UpdateEndpointResponseSchema
>;
