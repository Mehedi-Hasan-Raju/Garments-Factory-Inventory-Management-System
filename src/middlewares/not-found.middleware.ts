 conflict-demo-b-real

 2nd

 1st
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
 conflict-demo-b-real
};

  2nd
};

};



jadskbvjklvblkjadviuvjkavla
 main

 main
