 2nd

 1st
 main
import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
  2nd
};

};



jadskbvjklvblkjadviuvjkavla
 main

