import { Injectable } from '@angular/core';
import { FeathersService, ServiceNames } from "@services/feathers/feathers.service";

export enum ConfigurationTypes {
    ALL = "",
    PERMISSIONS = "permissions",
    VALIDATORS = "validatorShemas"
};

@Injectable()
export class ConfigurationService {

    private static pendingPromiseFinished: any = {};
    private static pendingPromise: any = {};
    private configurationService: any;

    constructor(
        private feathers: FeathersService
    ) {
        this.configurationService = feathers.service(ServiceNames.CONFIGURATION);
    }

    public getConfig(type?: ConfigurationTypes): Promise<any> {
        const finalType: ConfigurationTypes = !type ? ConfigurationTypes.ALL : type;
        let promiseStatic = ConfigurationService.pendingPromise[finalType];
        if (!!ConfigurationService.pendingPromise[finalType] ? ConfigurationService.pendingPromiseFinished[finalType] : true) {
            ConfigurationService.pendingPromiseFinished[finalType] = false;
            ConfigurationService.pendingPromise[finalType] = (finalType == ConfigurationTypes.ALL) ? this.configurationService.find() : this.configurationService.get(finalType);
            ConfigurationService.pendingPromise[finalType]
                .then(val => {
                    setTimeout(() => {
                        ConfigurationService.pendingPromiseFinished[finalType] = true;
                    }, 2000);
                })
                .catch(err => {
                    console.error(err);
                    setTimeout(() => {
                        ConfigurationService.pendingPromiseFinished[finalType] = true;
                    }, 2000);
                });
        }
        return ConfigurationService.pendingPromise[finalType];
    }

    public getPermissions(): Promise<any> {
        return this.getConfig(ConfigurationTypes.PERMISSIONS);
    }

    public getValidators(): Promise<any> {
        return this.getConfig(ConfigurationTypes.VALIDATORS);
    }
}
