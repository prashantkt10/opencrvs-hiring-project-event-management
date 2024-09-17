import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateEventResponseSchema, CreateEventSchema, EventSchema, EventSchemaForDB, GetAllEventsSchema, GetEventResultsSchema, GetEventSchema, VoteEventSchema } from "@/api/event/eventRequestModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { eventController } from "@/api/event/eventController";
import { jwtDecode } from "@/common/middleware/jwtDecode";

export const eventRegistry = new OpenAPIRegistry();
export const eventRouter: Router = express.Router();

eventRegistry.register("Event", EventSchema);


// create event
eventRegistry.registerPath({
  method: "post",
  path: "/",
  tags: ["Event"],
  request: {
    body: {
      description: 'Create event body',
      required: true,
      content: {
        'application/json': {
          schema: EventSchema
        }
      }
    },
    headers: z.object({
      Authorization: z.string().describe("JWT token")
    }),
  },
  responses: createApiResponse(CreateEventResponseSchema, "Success"),
});
eventRouter.post("/", jwtDecode, validateRequest(CreateEventSchema), eventController.createEvent);


// get event by id
eventRegistry.registerPath({
  method: "get",
  path: "/:eventId",
  tags: ["Event"],
  request: {
    headers: z.object({
      Authorization: z.string().describe("JWT token")
    }),
  },
  responses: createApiResponse(EventSchemaForDB, "Success"),
});
eventRouter.get("/:eventId", jwtDecode, validateRequest(GetEventSchema), eventController.getEventById);


// get all events
eventRegistry.registerPath({
  method: "get",
  path: "/",
  tags: ["Event"],
  request: {
    headers: z.object({
      Authorization: z.string().describe("JWT token")
    }),
    query: GetAllEventsSchema.shape.query
  },
  responses: createApiResponse(EventSchemaForDB, "Success"),  
});
eventRouter.get("/", jwtDecode, validateRequest(GetAllEventsSchema), eventController.getAllEvents);


// user will vote for the event by providing multiple dates they are available
eventRegistry.registerPath({
  method: "post",
  path: "/:eventId/vote",
  tags: ["Event"],
  request: {
    headers: z.object({
      Authorization: z.string().describe("JWT token")
    }),
  },
  responses: createApiResponse(EventSchemaForDB, "Success"),
});
eventRouter.post("/:eventId/vote", jwtDecode, validateRequest(VoteEventSchema), eventController.voteEvent);


// Endpoint: /api/v1/event/{id}/results Responds with dates that are suitable for all participants.
eventRegistry.registerPath({
  method: "get",
  path: "/:eventId/results",
  tags: ["Event"],
  request: {
    headers: z.object({
      Authorization: z.string().describe("JWT token")
    }),
  },
  responses: createApiResponse(GetEventResultsSchema, "Success"),
});
eventRouter.get("/:eventId/results", jwtDecode, eventController.getEventResults);