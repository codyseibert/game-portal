export type Maybe<T> = T | null;
export type MaybeAsync<T> = T | Promise<T>;
export type UUID = string | number;
export type Endpoint = `/${string}`
export type Email = `${string}@${string}.${string}`
export type DateString = string;
export type Constructor<T> = { new (...args: any[]):  T };
export type ObjectLiteral = {
  [key: string]: any;
}