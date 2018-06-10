
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

class MyFormGroup extends FormGroup {

    private control: AbstractControl;

    private static assign(controls: string[], control: AbstractControl): {
        [key: string]: AbstractControl;
    } {
        var obj: {
            [key: string]: AbstractControl;
        } = {};

        for (var key of controls) {
            obj[key] = control;
        }

        return obj;
    }

    constructor(controls: string[], control: AbstractControl, validatorOrOpts?: ValidatorFn | ValidatorFn[] | null) {
        super(MyFormGroup.assign(controls, control), validatorOrOpts, null); //TODO: AsyncValidatorFn
        this.control = control;
    }

    addControl(name: string): void {
        //use control: AbstractControl from global control
        super.addControl(name, this.control);
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

export function generateShema(shema): AbstractControl {
    var validators: Array<ValidatorFn> = new Array<ValidatorFn>();
    var control: AbstractControl;

    if (!!shema.subsetOf) {
        validators.push(MyValidators.subsetOf(shema.subsetOf));
    }

    if (shema.required) {
        validators.push(Validators.required);
    }

    if (!!shema) {
        switch (shema.type) {
            case DatashemasTypes.EMAIL:
                control = new FormControl('', Validators.email);
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

                control = new FormControl('', validators);
                break;

            case DatashemasTypes.ARRAY:
                var validators: Array<ValidatorFn> = new Array<ValidatorFn>();

                if (!!shema.min) {
                    validators.push(Validators.minLength(shema.min));
                }

                if (!!shema.max) {
                    validators.push(Validators.minLength(shema.max));
                }

                if (!!shema.eltShema) {
                    control = new MyFormGroup(validators, generateShema(shema.eltShema));
                } else {
                    control = new FormControl('', validators);
                }

                break;

            case DatashemasTypes.NUMBER:
                var validators: Array<ValidatorFn> = new Array<ValidatorFn>();

                if (!!shema.min) {
                    validators.push(Validators.min(shema.min));
                }

                if (!!shema.max) {
                    validators.push(Validators.min(shema.max));
                }

                control = new FormControl('', validators);
                break;

            default:
                control = new FormControl('');
                break;
        }
    }

    return control;
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

