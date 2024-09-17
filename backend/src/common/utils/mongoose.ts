// setup mongodb mongoose typescript
import mongoose from "mongoose";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

export const setupMongoose = () => {
    logger.info(`Connecting to MongoDB: ${env.MONGO_URI}`);
    mongoose.connect(env.MONGO_URI as string);
    mongoose.connection.on("connected", () => {
        logger.info(`Connected to MongoDB: ${env.MONGO_URI}`);
    });
    mongoose.connection.on("error", (err) => {
        logger.error("Error connecting to MongoDB", err);
    });
};
