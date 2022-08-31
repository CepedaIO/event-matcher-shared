import {
  AssertionResult,
  AssertionWithMessage, ErrorDict,
  Keyed,
  StringKey,
  ValidateOptions, ValidateResult,
  Validator,
  ValidatorSuite
} from "../types";
import {ist} from "../utils";
import { omitBy, isNil, uniq } from "lodash";

export interface FieldValidation<Values extends Keyed, Field extends StringKey<Values>> {
  validator?: Validator<Values, Field>;
  ist: (val: any) => val is Values[Field];
}

interface UseValidationProps<Values extends Keyed> {
  validation: {[Field in StringKey<Values>]?: FieldValidation<Values, Field>};
  shouldOmit: (field: StringKey<Values>) => boolean;
}

const requiredFields = new Map<string, string[]>();

const FAILED_ASSERTION: AssertionWithMessage<any> = [() => false, ''];

export const useValidation = <Values extends Keyed>({ validation, shouldOmit }: UseValidationProps<Values>) => {
  const requiredFactory = <Field extends StringKey<Values>>(field:Field, values:Values, fieldValidation: FieldValidation<Values, Field>) =>
    (otherField: StringKey<Values>, additionalAssertions: ValidatorSuite<Values[Field]>): ValidatorSuite<Values[Field]> => {
      if(!requiredFields.has(otherField)) {
        requiredFields.set(otherField, []);
      }

      const fields = requiredFields.get(otherField) || [];
      if(!fields.includes(field)) {
        requiredFields.set(otherField, [
          ...fields,
          field
        ]);
      }

      if(validation[otherField]) {
        return validation[otherField]!.ist(values[otherField]) ? additionalAssertions : [FAILED_ASSERTION];
      }

      return values[otherField] ? additionalAssertions : [FAILED_ASSERTION];
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

  const runValidator = <Field extends StringKey<Values>>(field: Field, values: Values, fieldValidation:FieldValidation<Values, Field>): AssertionResult<Values[Field]> =>  {
    const value = values[field];
    const required = requiredFactory(field, values, fieldValidation);
    const assertions = fieldValidation.validator!(values as Values, { field, value, required });

    return runSuite(value!, assertions);
  };

  const _validate = (fields:StringKey<Values>[], values:Values, options: ValidateOptions = {}, result: ValidateResult<Values> = [true, {} as Values]): ValidateResult<Values> => {
    if(fields.length === 0 || (options.stopOnFirstFail && !result[0])) return result;
    const [field, ...nextFields] = uniq(fields);
    const fieldValidation = validation[field];
    const errors:ErrorDict<Values> = {};

    if(fieldValidation && fieldValidation.validator && !shouldOmit(field)) {
      const [isValid, res, error] = runValidator(field, values, fieldValidation);

      if(!isValid) {
        errors[field] = error;
      }

      if(requiredFields.has(field) ) {
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
    requiredFields.forEach(([field]) => {
      if(typeof values[field] === "undefined") {
        requiredFields.delete(field);
      }
    });

    const [isValid, _values, errors] = _validate(fields, values, options);
    const omitted = omitBy(_values, isNil);
    return [isValid, omitted, errors] as ValidateResult<Values>;
  };

  return validate;
}
