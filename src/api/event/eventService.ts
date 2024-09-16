import { StatusCodes } from "http-status-codes";

import { IUserLogin, IUserLoginResponse, type IUser } from "@/api/user/userInterfaces";
import { EventRepository } from "@/api/event/eventRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import argon2 from 'argon2';
import { env } from "@/common/utils/envConfig";
import jwt from 'jsonwebtoken';
import { IEvent, IEventForDB, IEventResponse, IGetAllEventsQuery, IGetAllEventsResponse, IGetEventResponse, IGetEventResultsResponse } from "./eventInterfaces";
import { prepareCreateEventRequest, prepareGetAllEventsResponse, prepareGetEventResponse, prepareGetEventResultsResponse, prepareVoteDBRequest } from "@/common/utils/requestResponsePrepare";
import { UserRepository } from "@/api/user/userRepository";

export class EventService {
  private eventRepository: EventRepository;
  private userRepository: UserRepository;

  constructor(
    eventRepository: EventRepository = new EventRepository(), 
    userRepository: UserRepository = new UserRepository()
    ) {
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async create(event: IEvent, user: any): Promise<ServiceResponse<IEventResponse | null>> {
    try {
      const existingEvent = await this.eventRepository.findByEventName(event.name);
      if (existingEvent) {
        return ServiceResponse.failure("Event already exists", null, StatusCodes.CONFLICT);
      }
      const createdEvent = <IEventForDB>await this.eventRepository.create(prepareCreateEventRequest(event, user));
      return ServiceResponse.success("Event created successfully", {
        id: createdEvent._id,
      } as IEventResponse, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while creating event.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getEventById(eventId: string): Promise<ServiceResponse<IGetEventResponse | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(eventId);
      if (!event) {
        return ServiceResponse.failure("Event not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Event retrieved successfully", prepareGetEventResponse(event), StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error retrieving event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving event.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllEvents(query: IGetAllEventsQuery): Promise<ServiceResponse<IGetAllEventsResponse | null>> {
    try {
      const events = await this.eventRepository.findAllAsync(query);
      return ServiceResponse.success("Events retrieved successfully", prepareGetAllEventsResponse(events), StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error retrieving events: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving events.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async voteEvent(eventId: string, dates: string[], user: any): Promise<ServiceResponse<IEventForDB | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(eventId);
      if (!event) {
        return ServiceResponse.failure("Event not found", null, StatusCodes.NOT_FOUND);
      }

      const userInDB = await this.userRepository.findByIdAsync(user?._id);
      if (!userInDB) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const updatedEvent = prepareVoteDBRequest(event, userInDB._id, dates);
      await this.eventRepository.findOneAndUpdate({ _id: eventId }, updatedEvent);
      return ServiceResponse.success("Event voted successfully", null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error voting event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while voting event.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getEventResults(eventId: string): Promise<ServiceResponse<any | null>> {
    try {
      const event = await this.eventRepository.findByIdAsync(eventId);
      if (!event) {
        return ServiceResponse.failure("Event not found", null, StatusCodes.NOT_FOUND);
      }
      // get all the dates that has most votes
      const suitableDates = prepareGetEventResultsResponse(event);
      return ServiceResponse.success("Event results retrieved successfully", suitableDates, StatusCodes.OK);

    } catch (ex) {
      const errorMessage = `Error retrieving event results: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving event results.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const eventService = new EventService();
