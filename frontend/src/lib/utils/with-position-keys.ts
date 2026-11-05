// src/lib/utils/with-position-keys.ts

export type Keyed<T> = { key: string; item: T }

/**
 * Pairs each item with a positional React key.
 **/
export function withPositionKeys<T>(items: readonly T[]): readonly Keyed<T>[] {
    return items.map((item, position) => ({ key: String(position), item }))
}
