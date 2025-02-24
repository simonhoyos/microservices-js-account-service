import { Router } from 'express';

import { router as accountRouter } from './accounts/index.ts';

export const router = Router();

router.use('/accounts', accountRouter);
