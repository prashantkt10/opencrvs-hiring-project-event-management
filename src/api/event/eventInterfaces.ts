import { z } from "zod";
import { CreateEventResponseSchema, EventSchema, EventSchemaForDB, GetAllEventsSchema, GetEventResponseSchema, GetEventResultsSchema } from "./eventRequestModel";

export type IEvent = z.infer<typeof EventSchema>;
export type IEventForDB = z.infer<typeof EventSchemaForDB>;
export type IEventResponse = z.infer<typeof CreateEventResponseSchema>;
export type IGetEventResponse = z.infer<typeof GetEventResponseSchema>;
export type IGetAllEventsQuery = z.infer<typeof GetAllEventsSchema.shape.query>;
export type IGetAllEventsResponse = z.infer<typeof GetEventResponseSchema>;
export type IGetEventResultsResponse = z.infer<typeof GetEventResultsSchema>;

