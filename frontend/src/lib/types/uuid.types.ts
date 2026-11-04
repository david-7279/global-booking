// src/lib/types/uuid.types.ts

export type UUID = string & { readonly brand: unique symbol }

export function asUUID(value: string): UUID {
    return value as UUID
}
