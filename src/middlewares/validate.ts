import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validate(args: { Schema: ZodSchema }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { Schema } = args;

    const { success, data, error } = Schema.safeParse(req);

    if (success !== true) {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.issues.map((issue) => ({
          received: 'received' in issue ? issue.received : undefined,
          field: issue.path.at(-1),
          message: issue.message,
        })),
      });

      return;
    }

    Object.assign(req, data);

    next();
  };
}
