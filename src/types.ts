import {DateTime, DurationLikeObject, DurationObjectUnits} from "luxon";

export type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };
export type Keyed<T = any> = { [key:string | number]: T };
export type StringKey<T, V = any> = keyof PickByType<T, V> & string;
export type Tuple<T, K = T> = [T, K];
export type ValidatorDict<Values extends Keyed> = {[Field in StringKey<Values>]?: Validator<Values, Field>};
export type Validator<Values extends Keyed, Field extends StringKey<Values>> =
  (values: Values, ctx: {
    field: Field,
    value?: Values[Field],
    required: (field: StringKey<Values>, assertions:ValidatorSuite<Values[Field]>) => ValidatorSuite<Values[Field]>
  }) => ValidatorSuite<Values[Field]>;
export type Assertion<Value> = ((val: Value) => boolean);
export type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;
export type AssertionResult<Value> = Tuple<true, Value> | [false, Value, string];
export type ValidatorSuite<Value> = Array<AssertionWithMessage<Value> | ValidatorSuite<Value>>
export type ValidationError = string;
export type ValuesDict<Values extends Keyed> = {
  [Field in StringKey<Values>]?: Values[Field]
};
export type ErrorDict<Values extends Keyed> = {
  [Field in StringKey<Values>]?: ValidationError
};
export type ValidateResult<Values extends Keyed> = [true, Values] | [false, ValuesDict<Values>, ErrorDict<Values>];
export interface ValidateOptions {
  stopOnFirstFail?: boolean
}

export interface Form<Values extends Keyed> {
  validation: ValidatorDict<Values>
}

export type FormFactory<Values extends Keyed, FactoryProps extends Keyed = {}> = (props:FactoryProps) => Form<Values>
export type EventDuration = Pick<DurationLikeObject, 'minutes' | 'hours' | 'days'>
export type ISO = string;
export type Demote<Type> = {
  [Field in keyof Type]: Type[Field] extends DateTime ? ISO :
                         Type[Field] extends Date ? ISO :
                         Type[Field] extends Object ? Demote<Type[Field]> : Type[Field]
}

export type AsEntity<Type> = Type & {
  id: number;
  createdOn: Date;
}

export type AsMut<Type> = AsEntity<Type> & {
  modifiedOn: Date;
}

export type IDuration = Pick<DurationObjectUnits, 'days' | 'hours' | 'minutes'>;

export interface ISimpleResponse {
  success: boolean;
  result: string;
}
