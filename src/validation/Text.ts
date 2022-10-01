import {ist} from "../utils";

export const TextValidation = {
  ist: ist<string>((val) => typeof val === 'string'),
  defined: (value?: string) => !!value,
  greaterThan: (offset: number) => (value: string) => value.length > offset,
  isURL: (value: string) => {
    try { return Boolean(new URL(value)); }
    catch(e) { return false; }
  }
}

