import { Kafka } from 'kafkajs';
import type { Knex } from 'knex';
import { z } from 'zod';

import type { IConfig } from '../config.ts';
import { Account } from '../models/account.ts';
import type { IGlobalCache } from '../types.ts';

export function connect(opts: { globalCache: IGlobalCache; config: IConfig }) {
  const { globalCache, config } = opts;

  const kafka =
    globalCache.kafka ??
    new Kafka({
      clientId: config.KAFKA_CLIENT_ID,
      brokers: [config.KAFKA_BROKERS],
    });

  if (globalCache.kafka == null) {
    globalCache.kafka = kafka;
  }

  return {
    kafka: globalCache.kafka,

    async consumerModule(args: { conn: Knex }) {
      const consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID });

      await consumer.connect();
      await consumer.subscribe({
        topic: config.KAFKA_TOPIC,
      });

      await consumer.run({
        eachMessage: async ({ message }) => {
          if (message.value == null) return;

          const transaction = MessageSchema.parse(
            JSON.parse(message.value.toString()),
          );
          const accountId = transaction.accountId;

          try {
            const blockedAccount = await args
              .conn<Account>(Account.tableName)
              .whereRaw(
                `
              account.id = :accountId
              and not account.status = :status
            `,
                { accountId, status: 'blocked' },
              )
              .limit(1)
              .first();

            if (blockedAccount == null) {
              // eslint-disable-next-line no-console
              console.log('Account not found');
              return;
            }

            if (blockedAccount.count < 3) {
              await args
                .conn<Account>(Account.tableName)
                .update({
                  count: blockedAccount.count + 1,
                })
                .where('account.id', accountId);

              return;
            }

            await args
              .conn<Account>(Account.tableName)
              .update({
                status: 'blocked',
              })
              .where('account.id', accountId);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        },
      });

      return {
        cleanup: async () => {
          await consumer.disconnect();
        },
      };
    },

    async cleanup() {
      globalCache.kafka = undefined;
    },
  };
}

const MessageSchema = z.object({
  accountId: z.string(),
});
