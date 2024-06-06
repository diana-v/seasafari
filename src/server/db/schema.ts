import { bigserial, pgEnum, index, pgTable, text, timestamp, date, integer } from 'drizzle-orm/pg-core';

function enumToPgEnum(myEnum: any): [string, ...string[]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as [string, ...string[]];
}

export enum Status {
    CREATED = 'created',
    COMPLETED = 'completed',
}

export interface Order {
    id: number;
    orderRef: string;
    orderEmail: string;
    orderAmount: number;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    validFrom: Date;
    validTo: Date;
}

export const statusEnum = pgEnum('status', enumToPgEnum(Status));

export const orders = pgTable(
    'orders',
    {
        id: bigserial('id', { mode: 'number' }).primaryKey(),
        orderRef: text('order_ref').notNull(),
        orderEmail: text('order_email').notNull(),
        orderAmount: integer('order_amount').notNull(),
        status: statusEnum('status').notNull().default('created'),
        createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
        validFrom: date('valid_from', { mode: 'date' }).notNull().defaultNow(),
        validTo: date('valid_to', { mode: 'date' }).notNull(),
    },
    (example) => ({
        orderRefIndex: index('order_ref_idx').on(example.orderRef),
    })
);
