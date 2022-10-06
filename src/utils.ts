import { Demote } from "./types";
import {DateTime} from "luxon";

export const test = (regex: RegExp, str: string) => (new RegExp(regex)).test(str);
export const ist = <T>(test: (obj:any) => boolean) => (obj:any): obj is T => test(obj);
export const upsert = <T>(arr: Array<T>, entry: Partial<T> | null, replacedBy: T): Array<T> => {
  const index = !entry ? -1 : arr.indexOf(entry as T);

  return index === -1 ? arr.concat(replacedBy) : [
    ...arr.slice(0, index),
    replacedBy,
    ...arr.slice(index+1, arr.length)
  ];
}
export const remove = <T>(arr: Array<T>, entry: Partial<T> | null): Array<T> =>
  arr.filter((_entry) => entry !== _entry);

const dateFields = ['createdOn', 'modifiedOn', 'expiresOn', 'start', 'end'];
export const promote = <T>(entity: Demote<T>): T => {
  const result:any = {};
  for(const [key, val] of Object.entries(entity)) {
    if(Array.isArray(val)) {
      result[key] = val.map((v) => promote(v));
    } else if(typeof val === 'object' && val !== null) {
      result[key] = promote(val);
    } else if(typeof val === 'string' && dateFields.includes(key)) {
      try {
        result[key] = DateTime.fromISO(val);
      } catch(e) {
        console.error(`Unable to convert: [${key}, ${val}]`);
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }
  
  return result;
};
