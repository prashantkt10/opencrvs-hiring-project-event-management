// user data model
import { Schema, model } from "mongoose";
import { IEventForDB } from "./eventInterfaces";

const eventSchema = new Schema<IEventForDB>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dates: { type: Schema.Types.Mixed, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, {
  timestamps: true
});


export const EventDataModel = model<IEventForDB>("Event", eventSchema);