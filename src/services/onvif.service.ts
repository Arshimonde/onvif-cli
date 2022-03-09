import { OnvifDevice } from "node-onvif-ts";
import { OnvifProfile } from "../interfaces/onvif/onvifProfile.interface";
import Capabalities from "../interfaces/onvif/capabilities.interface";
import { Scopes } from "../interfaces/onvif/scopes.interface";
import { CapabalitiesFields } from "../enum/capabalities.enum";
import { SnapshotUri } from "../interfaces/onvif/snapshot.interface";

class OnvifServiceCLI {
    device: OnvifDevice;

    constructor(device: OnvifDevice){
        this.device = device;
    }

    public async getCapabilities(): Promise<Capabalities> {
        try {
            const capsResponse = await this.device.services.device?.getCapabilities();
            const data = capsResponse?.data;
            const capabilites: Capabalities = data["GetCapabilitiesResponse"]["Capabilities"];
            return capabilites;
        } catch (error) {
            throw error;
        }

    }

    public async getProfiles(): Promise<Array<OnvifProfile>> {
        try {
            const scopesResponse = await this.device.services.device?.getScopes()
            const data = scopesResponse?.data;
            const scopes: Scopes | Array<Scopes> = data["GetScopesResponse"]["Scopes"];
            let profiles: Array<OnvifProfile> = [] ;

            if(Array.isArray(scopes)){
                const rawProfiles = scopes.filter((s: Scopes)=>{
                    return s.ScopeItem.indexOf("Profile") !== -1;
                })

                profiles = rawProfiles.map((s: Scopes)=>{
                    return this.extractProfile(s)
                })
            }else{
                profiles = [this.extractProfile(scopes)]
            }

            return profiles;
        } catch (error) {
            throw error;
        }
    }



    public static getCapabalityField(capabalities: Capabalities, field?: CapabalitiesFields){
        switch (field) {
            case CapabalitiesFields.All:   
                return capabalities;

            case CapabalitiesFields.Analytics:
                return capabalities.Analytics

            case CapabalitiesFields.Device:
                return capabalities.Device

            case CapabalitiesFields.Events:
                return capabalities.Events

            case CapabalitiesFields.Imaging:
                return capabalities.Imaging

            case CapabalitiesFields.Media:
                return capabalities.Media

            case CapabalitiesFields.PTZ:
                return capabalities.PTZ

            case CapabalitiesFields.Extension:
                return capabalities.Extension
            default:
                return capabalities
        }
    }

    private extractProfile(s:Scopes): OnvifProfile{
        const startIndex = s.ScopeItem.lastIndexOf("/") + 1;
        return {
            profile: s.ScopeItem.slice(startIndex)
        }
    }

}

export default OnvifServiceCLI;