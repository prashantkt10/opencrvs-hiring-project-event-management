import mongoose from "mongoose";
import { isValid, z } from "zod";

export const commonValidations = {
  id: z.string().refine((idVal) => mongoose.Types.ObjectId.isValid(idVal), {
    message: "Invalid user id !"
  })
};
