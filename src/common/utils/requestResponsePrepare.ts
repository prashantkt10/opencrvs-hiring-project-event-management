// this file is used to prepare the request and response for the api

import { IEvent, IEventForDB, IGetAllEventsResponse, IGetEventResponse } from "@/api/event/eventInterfaces";
import { logger } from "@/server";
import { format, startOfDay } from "date-fns";
import { Types } from "mongoose";


// [format(event.startTime, 'yyyy-MM-dd')]: [user._id]
export const prepareCreateEventRequest = (event: IEvent, user: any): IEventForDB => {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  return {
    name: event.name,
    description: event.description,
    location: event.location,
    organizer: new Types.ObjectId(user._id),
    attendees: [new Types.ObjectId(user._id)],
    dates: event.dates.reduce((acc: any, date: string) => {
      acc[format(date, 'yyyy-MM-dd')] = [user._id];
      return acc;
    }, {}),
    startTime: startTime,
    endTime: endTime
  };
};

export const prepareGetAllEventsResponse = (events: any): IGetAllEventsResponse => {
  return events.map((event: any) => ({
    id: event._id,
    name: event.name,
    description: event.description,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime
  }));
};

export const prepareGetEventResponse = (event: any): IGetEventResponse => {
  event = event.toObject();
  const attendesMap = event.attendees.reduce((acc: any, attendee: any) => {
    acc[attendee._id] = attendee;
    return acc;
  }, {});
  return {
    id: event._id,
    name: event.name,
    description: event.description,
    location: event.location,
    organizer: event.organizer,
    votes: Object.keys(event.dates).map((date) => ({
      date: date,
      people: event.dates[date].map((person: any) => attendesMap[person])
    })),
    dates: Object.keys(event.dates),
    startTime: event.startTime,
    endTime: event.endTime
  };
};

export const prepareVoteDBRequest = (event: any, newAttendee: any, dates: string[]): any => {
  event.attendees.push(newAttendee);
  event.attendees = Array.from(new Set(event.attendees));

  // check if the date is already in the dates array and if it is, add the new attendee to the array or create a new array
  // if all dates already have user id as vote, dont add the new attendee to the array
  dates.forEach((date) => {
    if (event.dates[date]) {
      date = format(date, 'yyyy-MM-dd')
      event.dates[date].push(String(newAttendee));
      event.dates[date] = Array.from(new Set(event.dates[date]));
    } else {
      event.dates[date] = [String(newAttendee)];
    }
  });
    
  return event;
};

export const prepareGetEventResultsResponse = (event: any): any => {
  const response: any = {
    id: event._id,
    name: event.name,
    suitableDates: []
  }
  Object.keys(event.dates).forEach((date) => {
    if(event.dates[date].length === event.attendees.length) {
      response.suitableDates.push({
        date: date,
        people: event.dates[date]
      });
    }
  });
  return response;
};

