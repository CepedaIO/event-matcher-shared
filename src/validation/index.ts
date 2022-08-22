import {Keyed, StringKey, Tuple} from "../types";
import { omitBy, isNil } from "lodash";
import {ist} from "../utils";

export * from "./DateTime";

export type Validator<Values extends Keyed, Field extends StringKey<Values>> =
  (values: Values, ctx: {
    field: Field,
    value?: Values[Field],
    required: (field: StringKey<Values>, assertions:ValidatorSuite<Values[Field]>) => ValidatorSuite<Values[Field]>
  }) => ValidatorSuite<Values[Field]>;

type Assertion<Value> = ((val: Value) => boolean);
type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;
type AssertionResult<Value> = Tuple<true, Value> | [false, Value, string];
type ValidatorSuite<Value> = Array<AssertionWithMessage<Value> | ValidatorSuite<Value>>
type ValidationError = string;
type ValuesDict<Values extends Keyed> = {
  [Field in StringKey<Values>]?: Values[Field]
};
type ErrorDict<Values extends Keyed> = {
  [Field in StringKey<Values>]?: ValidationError
};

export type ValidateResult<Values extends Keyed> = [true, Values] | [false, ValuesDict<Values>, ErrorDict<Values>];

interface ValidateOptions {
  stopOnFirstFail?: boolean
}

interface UseValidationProps<Values extends Keyed> {
  validators: {[Field in StringKey<Values>]?: Validator<Values, Field>};
  shouldOmit: (field: StringKey<Values>) => boolean;
}

export const useValidation = <Values extends Keyed>({ validators, shouldOmit }: UseValidationProps<Values>) => {
  const requiredFields = new Map<string, string[]>();

  const requiredFactory = <Field extends StringKey<Values>>(field:Field, values:Values) =>
    (otherField: StringKey<Values>, additionalAssertions: ValidatorSuite<Values[Field]>): ValidatorSuite<Values[Field]> => {
      if(!requiredFields.has(otherField)) {
        requiredFields.set(otherField, []);
      }

      const fields = requiredFields.get(otherField) || [];
      requiredFields.set(otherField, [
        ...fields,
        field
      ]);

      return values[otherField] ? additionalAssertions : [];
    };

  const runSuite = <Field extends StringKey<Values>>(value:Values[Field], assertions: ValidatorSuite<Values[Field]>): AssertionResult<Values[Field]> => {
    if(assertions.length === 0) return [true, value!];
      const isAssertionWithMessage = ist<AssertionWithMessage<Values[Field]>>((obj:any) =>
        Array.isArray(obj)
          && typeof obj[0] === 'function'
          && typeof obj[1] === 'string'
    );

    const [assertion, ...nextAssertions] = assertions;

    if(isAssertionWithMessage(assertion)) {
      const [assert, message] = assertion;
      const isValid = assert(value!);
      if(!isValid) return [false, value, message];
    } else {
      nextAssertions.unshift.apply(nextAssertions, assertion);
    }

    return runSuite(value, nextAssertions);
  };

  const runValidator = <Field extends StringKey<Values>>(field: Field, values: Values, validator:Validator<Values, Field>): AssertionResult<Values[Field]> =>  {
    const value = values[field];
    const required = requiredFactory(field, values);
    const assertions = validator(values as Values, { field, value, required });

    return runSuite(value!, assertions);
  };

  const _validate = (fields:StringKey<Values>[], values:Values, options: ValidateOptions = {}, result: ValidateResult<Values> = [true, {} as Values]): ValidateResult<Values> => {
    if(fields.length === 0 || (options.stopOnFirstFail && !result[0])) return result;
    const [field, ...nextFields] = fields;
    const validator = validators[field];
    const errors:ErrorDict<Values> = {};

    if(validator && !shouldOmit(field)) {
      const [isValid, res, error] = runValidator(field, values, validator);

      if(!isValid) {
        errors[field] = error;
      }

      if(requiredFields.has(field)) {
        const definedFields = Object.keys(result[1]).concat(fields);
        const _fields = requiredFields.get(field)!.filter((field) => !definedFields.includes(field));
        nextFields.push.apply(nextFields, _fields);
      }

      return _validate(nextFields, values, options,[isValid && result[0], {
        ...result[1],
        [field]: res
      }, {
        ...result[2],
        ...errors,
      }] as ValidateResult<Values>);
    } else if(!shouldOmit(field)) {
      return _validate(nextFields, values, options, [result[0], {
        ...result[1],
        [field]: values[field]
      }, result[2]] as ValidateResult<Values>);
    }

    return _validate(nextFields, values, options, result);
  };

  const validate = (fields:StringKey<Values>[], values:Values, options: ValidateOptions = {}): ValidateResult<Values> => {
    const [isValid, _values, errors] = _validate(fields, values, options);
    const omitted = omitBy(_values, isNil);
    return [isValid, omitted, errors] as ValidateResult<Values>;
  };

  return validate;
}




