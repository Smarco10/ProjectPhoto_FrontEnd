
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';

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

export enum ValidatorStatus {
    VALID = "VALID",
    INVALID = "INVALID",
    PENDING = "PENDING",
    DISABLED = "DISABLED"
};

const formBuilder: FormBuilder = new FormBuilder();

export class MyValidators {
    static subsetOf<T>(values: T[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            var eltInError: Array<T> = new Array<T>();

            for (let val of control.value) {
                if (values.indexOf(val) < 0) {
                    eltInError.push(val);
                }
            }

            return eltInError.length === 0 ? null : { 'subsetOf': { value: eltInError } };
        };
    }
    static eltValidators(formGroup: FormGroup): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            var eltInError: Array<any> = new Array<any>();

            for (let val of control.value) {
                //TODO: validate val with all validators
            }

            console.log("MyValidators.eltValidators", control.value, eltInError);

            return eltInError.length === 0 ? null : { 'eltValidators': { value: eltInError } };
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
                    validators.push(MyValidators.eltValidators(generateFormGroup(shema.eltShema)));
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

export function validateVariable<T>(formControl: AbstractControl, variable: T): void {
    formControl.setValue(variable);
    formControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
    });
}

