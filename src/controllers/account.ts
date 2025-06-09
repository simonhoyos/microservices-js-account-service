import type { Request, Response } from 'express';

import { Account } from '../models/account.ts';
import * as accountService from '../services/account.ts';
import type { IApp } from '../types.ts';

export async function getAccountById(req: Request, res: Response) {
  const app = req.app as IApp;
  const connectionPool = app.services.knex;

  // Logger automated by ELK stack
  // app.services.logger.info('getAccountById method called', {
  //   accountId: req.params.id,
  // });

  const account = await accountService.getAccountById({
    id: req.params.id,
    connectionPool,
  });

  if (account == null) {
    res.status(404).json({ success: false, message: 'Account not found' });

    return;
  }

  res.status(200).json({ success: true, account: mapToResponse({ account }) });
}

export async function getAccounts(req: Request, res: Response) {
  const app = req.app as IApp;
  const connectionPool = app.services.knex;

  const result = await accountService.getAllAccounts({ connectionPool });

  res.status(200).json({
    success: true,
    account: result.map((account) => mapToResponse({ account })),
  });
}

export async function createAccount(req: Request, res: Response) {
  const { name, number, type, status } = req.body;

  const app = req.app as IApp;
  const connectionPool = app.services.knex;

  const account = await accountService.createAccount({
    connectionPool,
    data: { name, number, type, status },
  });

  if (account == null) {
    res.status(400).json({
      success: false,
      message: 'Invalid account data',
    });

    return;
  }

  res.status(201).json({
    success: true,
    Account: mapToResponse({ account }),
  });
}

export async function deleteAccountById(req: Request, res: Response) {
  const app = req.app as IApp;
  const connectionPool = app.services.knex;

  const isDeleted = await accountService.deleteAccountById({
    id: req.params.id,
    connectionPool,
  });

  if (isDeleted !== true) {
    res
      .status(400)
      .json({ success: false, message: 'No valid data to delete' });

    return;
  }

  res.status(204).json({
    success: true,
  });
}

export async function updateAccountById(req: Request, res: Response) {
  const { name, number, type, status } = req.body;

  const app = req.app as IApp;
  const connectionPool = app.services.knex;

  const account = await accountService.updateAccountById({
    id: req.params.id,
    connectionPool,
    data: { name, number, type, status },
  });

  if ('error' in account === true) {
    switch (account.code) {
      case accountService.errorCodes.NO_VALID_DATA_TO_UPDATE:
        res.status(400).json({ success: false, message: account.error });
        return;
      case accountService.errorCodes.INVALID_STATUS_CODE:
        res.status(400).json({ success: false, message: account.error });
        return;
      case accountService.errorCodes.INVALID_TYPE_CODE:
        res.status(400).json({ success: false, message: account.error });
        return;
      case accountService.errorCodes.INVALID_ACCOUNT:
        res.status(404).json({ success: false, message: account.error });
        return;
      case accountService.errorCodes.INVALID_STATE_TRANSITION:
        res.status(400).json({ success: false, message: account.error });
        return;
      case accountService.errorCodes.INVALID_TYPE_TRANSITION:
        res.status(400).json({ success: false, message: account.error });
        return;
      default:
        res
          .status(500)
          .json({ success: false, message: 'internal server error' });
        return;
    }
  }

  res.status(200).json({
    success: true,
    Account: mapToResponse({ account }),
  });
}

function mapToResponse(args: { account: Account }) {
  const { id, name, number, type, status } = args.account;

  return {
    id,
    name,
    number,
    type,
    status,
  };
}
