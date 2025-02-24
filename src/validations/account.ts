import { z } from 'zod';

export const getAccountById = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteAccountById = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createAccount = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Account name is required',
      invalid_type_error: 'Account name must be a string',
    }),
    number: z.string({
      required_error: 'Account number is required',
      invalid_type_error: 'Account number must be a string',
    }),
    status: z
      .enum(['new', 'active', 'inactive', 'blocked'], {
        errorMap: (issue) => ({
          ...issue,
          message:
            issue.code === 'invalid_enum_value'
              ? 'Invalid account status'
              : 'Unknown error. Contact support',
        }),
      })
      .optional(),
    type: z.enum(['root', 'sub']).optional(),
  }),
});

export const updateAccountById = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account'),
  }),
  body: z.object({
    name: z.string().optional(),
    number: z.string().optional(),
    status: z
      .enum(['new', 'active', 'inactive', 'blocked'], {
        errorMap: (issue) => ({
          ...issue,
          message:
            issue.code === 'invalid_enum_value'
              ? 'Invalid account status'
              : 'Unknown error. Contact support',
        }),
      })
      .optional(),
    type: z.enum(['root', 'sub']).optional(),
  }),
});
