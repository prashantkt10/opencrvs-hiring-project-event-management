import type { Request, RequestHandler, Response } from "express";

import { eventService } from "@/api/event/eventService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { IGetAllEventsQuery } from "./eventInterfaces";

class EventController {
  public createEvent: RequestHandler = async (req: Request, res: Response) => {
    const event = req.body;
    const user = res.locals.user;
    const serviceResponse = await eventService.create(event, user);
    return handleServiceResponse(serviceResponse, res);
  };

  public getEventById: RequestHandler = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const serviceResponse = await eventService.getEventById(eventId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllEvents: RequestHandler = async (req: Request, res: Response) => {
    const query: IGetAllEventsQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string
    };
    const serviceResponse = await eventService.getAllEvents(query);
    return handleServiceResponse(serviceResponse, res);
  };

  public voteEvent: RequestHandler = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const dates = req.body.dates;
    const user = res.locals.user;
    const serviceResponse = await eventService.voteEvent(eventId, dates, user);
    return handleServiceResponse(serviceResponse, res);
  };

  public getEventResults: RequestHandler = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const serviceResponse = await eventService.getEventResults(eventId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const eventController = new EventController();
