import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';

import type { IApp } from '../types.ts';

export function verify(
  req: Request & { user?: { userId?: string } },
  res: Response,
  next: NextFunction,
) {
  const app = req.app as IApp;

  const Authorization = req.header('Authorization');

  if (Authorization == null || Authorization.startsWith('Bearer ') !== true) {
    res.status(401).json({ message: 'Unauthorized: Missing JWT token' });

    return;
  }

  const [, token] = Authorization.split(' ');

  jwt.verify(
    token,
    app.config.SECRET_ACCESS_TOKEN,
    undefined,
    (error, decoded) => {
      const decodedData = z.object({ userId: z.string() }).safeParse(decoded);

      if (error != null || decodedData.success !== true) {
        if (
          error?.name === 'JsonWebTokenError' ||
          decodedData.success !== true
        ) {
          res
            .status(401)
            .json({ message: 'Unauthorized: Invalid JWT token format' });

          return;
        }

        if (error?.name === 'TokenExpiredError') {
          res.status(401).json({ message: 'Unauthorized: JWT token expired' });

          return;
        }

        // eslint-disable-next-line no-console
        console.error('JWT verification error: ', error);

        res.status(500).json({ message: 'Internal Server Error' });

        return;
      }

      req.user = decodedData.data;

      next();
    },
  );
}
