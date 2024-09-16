import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
  
extendZodWithOpenApi(z);

export const EventSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  dates: z.array(z.string()),
});

export const EventSchemaForDB = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  organizer: z.any(),
  attendees: z.any(),
  dates: z.record(z.array(z.string())),
  startTime: z.date(),
  endTime: z.date()
});

export const GetEventResponseSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  votes: z.array(z.object({
    date: z.string().optional(),
    people: z.array(z.string()).optional()
  })).optional(),
  dates: z.array(z.string()).optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional()
});

export const CreateEventSchema = z.object({
  body: EventSchema
});

export const CreateEventResponseSchema = z.object({
  id: commonValidations.id,
});

export const GetEventSchema = z.object({
  params: z.object({
    eventId: commonValidations.id
  })
});

export const GetAllEventsSchema = z.object({
  query: z.object({
    page: z.string().default("1").optional().transform(Number),
    limit: z.string().default("10").optional().transform(Number),
    sortBy: z.string().default("createdAt").optional(),
    sortOrder: z.string().default("desc").optional()
  })
});

export const SortOrder = z.enum(["asc", "desc"]);

export const VoteEventSchema = z.object({
  body: z.object({
    dates: z.array(z.string())
  }),
  params: z.object({
    eventId: z.string()
  })
});

export const GetEventResultsSchema = z.object({
  id: z.string(),
  name: z.string(),
  suitableDates: z.array(z.object({
    date: z.string(),
    people: z.array(z.string())
  }))
});