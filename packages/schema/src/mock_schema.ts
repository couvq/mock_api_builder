import { z } from "zod";

export const FakerType = z.enum([
    "faker.string.uuid",
    "faker.internet.email",
    "faker.person.firstName",
    "faker.person.lastName",
    "faker.person.fullName",
]);

export type FakerType = z.infer<typeof FakerType>;

export const MockSchema = z.record(
    z.string(),
    FakerType
);

export type MockSchema = z.infer<typeof MockSchema>;