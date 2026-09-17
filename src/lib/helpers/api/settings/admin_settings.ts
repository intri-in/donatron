import { SETTINGS_DEFAULTS } from "#/defines/settings";

export async function getMaxNumberOfOrganisationForRole(role: string){
    switch(role){
        case "admin":
            return SETTINGS_DEFAULTS.SETTING_ADMIN_MAX_ORG_FOR_ADMIN.default
        case "manager":
            return SETTINGS_DEFAULTS.SETTING_ADMIN_MAX_ORG_FOR_MANAGER.default
        default: 
            return 5

    }
}