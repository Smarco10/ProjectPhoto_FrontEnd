
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

export enum ValidatorMethods {
    ALL = "all",
    FIND = "find",
    GET = "get",
    CREATE = "create",
    UPDATE = "update",
    PATCH = 'patch',
    REMOVE = 'remove'
};

enum DatashemasTypes {
    EMAIL = "email",
    STRING = "string",
    NUMBER = "number",
    ARRAY = "array"
};

const formBuilder: FormBuilder = new FormBuilder();

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
                validator.push(Validators.email);
                break;

            case DatashemasTypes.STRING:
                if (!!shema.pattern) {
                    validator.push(Validators.pattern(shema.pattern));
                }

                if (!!shema.min) {
                    validator.push(Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validator.push(Validators.minLength(shema.max));
                }
                break;

            case DatashemasTypes.ARRAY:
                if (!!shema.subsetOf) {
                    validator.push(MyValidators.subsetOf(shema.subsetOf));
                }

                if (!!shema.eltShema) {
                    //TODO: validator.push(MyValidators.eltShema(generateShema(eltShema)));
                }

                if (!!shema.min) {
                    validator.push(Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validator.push(Validators.minLength(shema.max));
                }
                break;

            case DatashemasTypes.NUMBER:
                if (!!shema.min) {
                    validator.push(Validators.min(shema.min));
                }

                if (!!shema.max) {
                    validator.push(Validators.min(shema.max));
                }
                break;

            default:
                break;
        }

        if (shema.required) {
            validator.push(Validators.required);
        }
    }

    return validator;
}

export function generateFormGroup(validatorShemas): FormGroup {
    var formValidators = {};
    for (let validatorName of Object.keys(validatorShemas)) {
        //TODO: recuperer la default value
        formValidators[validatorName] = ['', generateShema(validatorShemas[validatorName])];
    }
    return formBuilder.group(formValidators);
}

