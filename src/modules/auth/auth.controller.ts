
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { loginSchema } from "./auth.validation.js";
import { loginUser } from "./auth.service.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
