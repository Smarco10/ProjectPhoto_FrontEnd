
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
    static subsetOf<T>(values: T[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            return values.indexOf(control.value) > -1 ? { 'subsetOf': { value: control.value } } : null;
        };
    }
}

export function generateShema(shema): Array<ValidatorFn> {
    var validators: Array<ValidatorFn> = [];

    if (!!shema) {
        switch (shema.type) {
            case DatashemasTypes.EMAIL:
                validators.push(Validators.email);
                break;

            case DatashemasTypes.STRING:
                if (!!shema.pattern) {
                    validators.push(Validators.pattern(shema.pattern));
                }

                if (!!shema.min) {
                    validators.push(Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validators.push(Validators.minLength(shema.max));
                }
                break;

            case DatashemasTypes.ARRAY:
                if (!!shema.subsetOf) {
                    validators.push(MyValidators.subsetOf(shema.subsetOf));
                }

                if (!!shema.eltShema) {
                    //validators.push(MyValidators.eltShemas(generateShema(shema.eltShema)));
                }

                if (!!shema.min) {
                    validators.push(Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validators.push(Validators.minLength(shema.max));
                }
                break;

            case DatashemasTypes.NUMBER:
                if (!!shema.min) {
                    validators.push(Validators.min(shema.min));
                }

                if (!!shema.max) {
                    validators.push(Validators.min(shema.max));
                }
                break;

            default:
                break;
        }

        if (shema.required) {
            validators.push(Validators.required);
        }
    }

    return validators;
}

export function generateFormGroup(validatorShemas): FormGroup {
    var formValidators = {};
    for (let validatorName of Object.keys(validatorShemas)) {
        //TODO: recuperer la default value
        formValidators[validatorName] = ['', generateShema(validatorShemas[validatorName])];
    }
    return formBuilder.group(formValidators);
}

