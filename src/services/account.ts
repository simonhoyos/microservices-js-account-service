import type { Knex } from 'knex';

import { Account, type StatusEnum, type TypeEnum } from '../models/account.ts';

export async function getAccountById(args: {
  id: string;
  connectionPool: Knex;
}) {
  const { id, connectionPool } = args;

  const account = await connectionPool<Account>(Account.tableName)
    .where({ id })
    .first()
    .limit(1);

  return account;
}

export async function getAllAccounts(args: { connectionPool: Knex }) {
  const { connectionPool } = args;

  const accounts = await connectionPool<Account>(Account.tableName).orderBy(
    'created_at',
    'desc',
  );

  return accounts;
}

export async function createAccount(args: {
  connectionPool: Knex;
  data: {
    name: string;
    number: string;
    type: TypeEnum;
    status: StatusEnum;
  };
}) {
  const { connectionPool, data } = args;

  const account = (
    await connectionPool<Account>(Account.tableName).insert(data).returning('*')
  )?.at(0);

  return account;
}

export async function deleteAccountById(args: {
  id: string;
  connectionPool: Knex;
}) {
  const { id, connectionPool } = args;

  const deletedAccount = await connectionPool(Account.tableName)
    .where({ id })
    .delete();

  if (deletedAccount > 0) return true;

  return false;
}

const availableAccountStatusesForUpdate = {
  new: ['active', 'blocked'],
  active: ['inactive', 'blocked'],
  inactive: ['active'],
  blocked: ['active'],
};

const availableAccountTypesForUpdate = {
  root: ['sub'],
  sub: ['root'],
};

export const errorCodes = {
  NO_VALID_DATA_TO_UPDATE: 0,
  INVALID_STATUS_CODE: 1,
  INVALID_TYPE_CODE: 2,
  INVALID_ACCOUNT: 3,
  INVALID_STATE_TRANSITION: 4,
  INVALID_TYPE_TRANSITION: 5,
};

export async function updateAccountById(args: {
  id: string;
  connectionPool: Knex;
  data: {
    name?: string;
    number?: string;
    type?: TypeEnum;
    status?: StatusEnum;
  };
}) {
  const { id, connectionPool, data } = args;
  const { name, number, type, status } = data;

  if (name == null && number == null && type == null && status == null) {
    return {
      error: 'Provide at least one valid data to be updated',
      code: errorCodes.NO_VALID_DATA_TO_UPDATE,
    };
  }

  if (status != null && status in availableAccountStatusesForUpdate !== true) {
    return {
      error: 'Invalid status for account',
      code: errorCodes.INVALID_STATUS_CODE,
    };
  }

  if (type != null && type in availableAccountTypesForUpdate !== true) {
    return {
      error: 'Invalid type for account',
      code: errorCodes.INVALID_TYPE_CODE,
    };
  }

  const account = await connectionPool<Account>(Account.tableName)
    .where({ id })
    .first()
    .limit(1);

  if (account == null) {
    return { error: 'Account not found', code: errorCodes.INVALID_ACCOUNT };
  }

  if (status != null) {
    const allowedStatuses = availableAccountStatusesForUpdate[account.status];

    if (allowedStatuses.includes(status) !== true) {
      return {
        error: `Cannot update status from '${account.status}' to '${status}'`,
        code: errorCodes.INVALID_STATE_TRANSITION,
      };
    }
  }

  if (type != null) {
    const allowedTypes = availableAccountTypesForUpdate[account.type];

    if (allowedTypes.includes(type) !== true) {
      return {
        error: `Cannot update type from '${account.type}' to '${type}'`,
        code: errorCodes.INVALID_TYPE_TRANSITION,
      };
    }
  }

  const patch = {
    status,
    type,
    name,
    number,
    updated_at: new Date().toISOString(),
  };

  await connectionPool<Account>(Account.tableName).where({ id }).update(patch);

  return account;
}
