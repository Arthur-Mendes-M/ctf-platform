export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends (...args: unknown[]) => unknown
    ? T[K] // mantém função como está
    : T[K] extends Array<infer U>
    ? DeepPartial<U>[] // aplica recursivo dentro de arrays
    : T[K] extends object
    ? DeepPartial<T[K]> // aplica recursivo dentro de objetos
    : T[K];
};