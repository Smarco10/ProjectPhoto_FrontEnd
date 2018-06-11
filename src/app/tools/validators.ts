
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
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

class UniqueRulesFormGroup extends FormGroup {

    private control: AbstractControl;

    private static assign(validators: ValidatorFn | ValidatorFn[], ...controls: string[]): {
        [key: string]: AbstractControl;
    } {
        var obj: {
            [key: string]: AbstractControl;
        } = {};

        for (var key of controls) {
            obj[key] = new FormControl(validators);
        }

        return obj;
    }

    constructor(validatorOrOpts: ValidatorFn | ValidatorFn[], ...controls?: string[]) {
        super(MyFormGroup.assign(validatorOrOpts, controls), null, null); //TODO: AsyncValidatorFn
        this.validators = validatorOrOpts;
    }

    addControl(name: string): void {
        super.addControl(name, new FormControl(this.validators));
    }
}

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
}

export function generateShema(shema): ValidatorFn[] {
    var validators: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (!!shema) {
        if (!!shema.subsetOf) {
            validators.push(MyValidators.subsetOf(shema.subsetOf));
        }

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

export function generateControl(shema: any): AbstractControl {
    var control: AbstractControl;
    var validators: validators: ValidatorFn | ValidatorFn[] = generateShema(shema);

    if (!!shema.eltShema) {
        control = new UniqueRulesFormGroup(validators, generateShema(shema.eltShema));
    } else {
        control = new FormControl('', validators);
    }

    return control;
}

export function generateFormGroup(validatorShemas): FormGroup {
    var formValidators = {};
    for (let validatorName of Object.keys(validatorShemas)) {
        let shema = validatorShemas[validatorName];
        formValidators[validatorName] = generateControl(shema);
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

