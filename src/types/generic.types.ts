export type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<any, any>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Thing {
  id: string;
  name: string;
}
