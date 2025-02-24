import { Router } from 'express';

import * as accountController from '../../../controllers/account.ts';
import { validate } from '../../../middlewares/validate.ts';
import * as accountValidation from '../../../validations/account.ts';

export const router = Router();

router.get('/', accountController.getAccounts);

router.get(
  '/:id',
  validate({ Schema: accountValidation.getAccountById }),
  accountController.getAccountById,
);

router.post(
  '/',
  validate({ Schema: accountValidation.createAccount }),
  accountController.createAccount,
);

router.put(
  '/:id',
  validate({ Schema: accountValidation.updateAccountById }),
  accountController.updateAccountById,
);

router.delete(
  '/:id',
  validate({ Schema: accountValidation.deleteAccountById }),
  accountController.deleteAccountById,
);
