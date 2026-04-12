import { bigserial, date, index, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export enum Status {
    COMPLETED = 'completed',
    CREATED = 'created',
    UNPAID = 'unpaid',
}

export interface Order {
    createdAt: Date;
    id: number;
    orderAmount: number;
    orderEmail: string;
    orderRef: string;
    status: Status;
    updatedAt: Date;
    validFrom: Date;
    validTo: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function enumToPgEnum(myEnum: any): [string, ...string[]] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(myEnum).map((value: any) => `${value}`) as [string, ...string[]];
}

export const statusEnum = pgEnum('status', enumToPgEnum(Status));

export const orders = pgTable(
    'orders',
    {
        createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
        id: bigserial('id', { mode: 'number' }).primaryKey(),
        orderAmount: integer('order_amount').notNull(),
        orderEmail: text('order_email').notNull(),
        orderRef: text('order_ref').notNull(),
        status: statusEnum('status').notNull().default('created'),
        updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
        validFrom: date('valid_from', { mode: 'date' }).notNull().defaultNow(),
        validTo: date('valid_to', { mode: 'date' }).notNull(),
    },
    (example) => ({
        orderRefIndex: index('order_ref_idx').on(example.orderRef),
    })
);
