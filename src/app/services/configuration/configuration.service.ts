import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/shareReplay';

import { User } from '@models/user';
import { FeathersService } from "@services/feathers/feathers.service";

enum ConfigurationTypes {
    PERMISSIONS = "permissions",
    VALIDATORS = "validators"
};

@Injectable()
export class ConfigurationService {

    private configurationService: any;

    constructor(
        private feathers: FeathersService
    ) {
        this.configurationService = feathers.service('configuration');
    }

    public getConfig(type: ConfigurationTypes): Promise<any> {
        return !!type ? this.configurationService.get(type) : this.configurationService.find();
    }

    public getPermissions(): Promise<any> {
        return this.getConfig(ConfigurationTypes.PERMISSIONS);
    }

    public getValidators(): Promise<any> {
        return this.getConfig(ConfigurationTypes.VALIDATORS);
    }
}
