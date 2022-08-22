export type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };
export type Keyed<T = any> = { [key:string | number]: T };
export type StringKey<T, V = any> = keyof PickByType<T, V> & string;
export type Tuple<T, K = T> = [T, K];
