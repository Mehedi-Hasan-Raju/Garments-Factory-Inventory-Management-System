
import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import {
  registerOrganization,
  loginUser,
} from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerOrganization(validatedData);

    res.status(201).json({
      success: true,
      message: "Organization registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
