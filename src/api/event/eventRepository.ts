import { EventDataModel } from "@/api/event/eventDataModel";
import { IEventForDB, IGetAllEventsQuery } from "@/api/event/eventInterfaces";
import { SortOrder } from "mongoose";

export class EventRepository {
  async findAllAsync(query: IGetAllEventsQuery): Promise<IEventForDB[]> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = ((page || 1) - 1) * (limit || 10);
    return EventDataModel.find()
      .skip(skip)
      .limit(limit || 10)
      .sort({ [sortBy || "createdAt"]: sortOrder as SortOrder || "desc" });
  }

  async findByIdAsync(id: string): Promise<IEventForDB | null> {
    return EventDataModel.findById(id)
      .populate("organizer", "name")
      .populate("attendees", "name");
  }

  async findByEventName(eventName: string): Promise<IEventForDB | null> {
    return EventDataModel.findOne({ name: eventName });
  }

  async create(event: IEventForDB): Promise<IEventForDB> {
    return EventDataModel.create(event);
  }

  async findOneAndUpdate(filter: any, update: any): Promise<IEventForDB | null> {
    return EventDataModel.findOneAndUpdate(filter, update, { new: true });
  }
}

export const eventRepository = new EventRepository();
