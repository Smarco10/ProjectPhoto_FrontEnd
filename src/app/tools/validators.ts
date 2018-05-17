
import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';

enum DatashemasTypes {
    EMAIL = "email",
    STRING = "string",
    NUMBER = "number",
    SUBSET = "subset"
};

export class MyValidators {
    static subsetOf(values: string[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            return values.indexOf(control.value) >= 0 ? { 'subsetOf': { value: control.value } } : null;
        };
    }
}

export function generateShema(shema): Array<ValidatorFn> {
    var validator: Array<ValidatorFn> = [];

    if (!!shema) {
        switch (shema.type) {
            case DatashemasTypes.EMAIL:
                validator.splice(validator.length, 0, Validators.email);
                break;

            case DatashemasTypes.STRING:
                if (!!shema.pattern) {
                    validator.splice(validator.length, 0, Validators.pattern(shema.pattern));
                }

                if (!!shema.min) {
                    validator.splice(validator.length, 0, Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validator.splice(validator.length, 0, Validators.minLength(shema.max));
                }
                break;

            case DatashemasTypes.SUBSET:
                if (!!shema.subsetOf) {
                    validator.splice(validator.length, 0, MyValidators.subsetOf(shema.subsetOf));
                }
                break;

            case DatashemasTypes.NUMBER:
                if (!!shema.min) {
                    validator.splice(validator.length, 0, Validators.min(shema.min));
                }

                if (!!shema.max) {
                    validator.splice(validator.length, 0, Validators.min(shema.max));
                }
                break;

            default:
                break;
        }

        if (shema.required) {
            validator.splice(validator.length, 0, Validators.required);
        }
    }

    return validator;
}