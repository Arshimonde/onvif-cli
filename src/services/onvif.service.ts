import { OnvifDevice } from "node-onvif-ts-extended";
import { OnvifProfile } from "../interfaces/onvif/onvifProfile.interface";
import Capabalities from "../interfaces/onvif/capabilities.interface";
import { Scopes } from "../interfaces/onvif/scopes.interface";
import { CapabalitiesFields } from "../enum/capabalities.enum";
import flattenObject from "../helpers/flattenObject";



interface ReplayUriList {
    name: string,
    uri: string
}
class OnvifServiceCLI {
    device: OnvifDevice;

    constructor(device: OnvifDevice) {
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

    public async getOnvifProfiles(): Promise<Array<OnvifProfile>> {
        try {
            const scopesResponse = await this.device.services.device?.getScopes()
            const data = scopesResponse?.data;
            const scopes: Scopes | Array<Scopes> = data["GetScopesResponse"]["Scopes"];
            let profiles: Array<OnvifProfile> = [];

            if (Array.isArray(scopes)) {
                const rawProfiles = scopes.filter((s: Scopes) => {
                    return s.ScopeItem.indexOf("Profile") !== -1;
                })

                profiles = rawProfiles.map((s: Scopes) => {
                    return this.extractProfile(s)
                })
            } else {
                profiles = [this.extractProfile(scopes)]
            }

            return profiles;
        } catch (error) {
            throw error;
        }
    }

    public async getStreamingUri(): Promise<string> {
        try {
            let response = await this.device.services.media?.getProfiles();
            let data = response?.data;
            const profiles = data["GetProfilesResponse"]["Profiles"];

            if (profiles.length) {
                const uris = await Promise.all(profiles.map(async (profile: any) => {
                    const profileToken = profile["$"]["token"];
                    // get streaming uri using profile token
                    response = await this.device.services.media?.getStreamUri({
                        ProfileToken: profileToken,
                        Protocol: "RTSP"
                    });
                    data = response?.data;
                    const streamingUri = data["GetStreamUriResponse"]["MediaUri"]["Uri"];
                    return streamingUri;
                }))

                console.table(uris);

                if (uris.length)
                    return uris[0];
                else
                    return "";

            } else {
                return "";
            }


        } catch (error) {
            throw error;
        }
    }

    // Search for replay URI

    public async getReplayUriList(): Promise<Array<ReplayUriList>> {
        try {

            if (!this.device.services["search"] || !this.device.services["replay"]) {
                throw new Error("This device does not support Search or Replay or both capabilities")
            }

            let list: Array<ReplayUriList> = []

            // Request the available recordings
            let onvifResult = await this.device.services.search.findRecordings({
                Scope: {},
                KeepAliveTime: 5
            })

            if (onvifResult) {
                // GET RECORDINGS  SEARCH RESULTS
                const SearchToken = onvifResult["data"]["FindRecordingsResponse"]["SearchToken"]
                onvifResult = await this.device.services.search.getRecordingSearchResults({
                    SearchToken
                });
                let recordings = onvifResult["data"]["GetRecordingSearchResultsResponse"]["ResultList"]["RecordingInformation"]

                // GET RECORDINGS TOKENs
                recordings = recordings.map((record: any, i: Number) => {
                    return {
                        recordingToken: record["RecordingToken"],
                        name: record["Source"]["Name"]
                    }
                })
                

                // GET RECORDINGS RTSP URIs
                list = await Promise.all(recordings.map(async (record: {recordingToken: string, name: string}, i: Number)=>{
                    const result = await this.device.services?.replay?.getReplayUri({
                        'StreamSetup': {
                            'Stream': 'RTP-Unicast',
                            'Transport': {
                                'Protocol': 'RTSP',
                            },
                        },
                        'RecordingToken': record.recordingToken,
                    });
                    if(result){
                        const replayUri = result["data"]["GetReplayUriResponse"]["Uri"];
                        return {
                            name: record.name,
                            uri: replayUri
                        }
                    }
                }))
            }            
            return list;
        } catch (error) {
            throw error
        }
    }


    public static getCapabilityField(capabalities: Capabalities, field?: CapabalitiesFields) {
        switch (field) {
            case CapabalitiesFields.All:
                return flattenObject(capabalities)

            case CapabalitiesFields.Analytics:
                return flattenObject(capabalities.Analytics)

            case CapabalitiesFields.Device:
                return flattenObject(capabalities.Device)
            case CapabalitiesFields.Events:
                return flattenObject(capabalities.Events)

            case CapabalitiesFields.Imaging:
                return flattenObject(capabalities.Imaging)

            case CapabalitiesFields.Media:
                return flattenObject(capabalities.Media)

            case CapabalitiesFields.PTZ:
                return flattenObject(capabalities.PTZ)

            case CapabalitiesFields.Extension:
                return flattenObject(capabalities.Extension)
            default:
                return flattenObject(capabalities)
        }
    }


    // SETUP RTSP URL
    public static setupRtspUrl(url: string, user: string, pass: string): string {
        let uri = url;
        let uriPart1, uriPart2;

        if (url.indexOf("rtsp://") != -1) {
            uriPart1 = uri.substring(0, uri.indexOf("//") + 2);
            uriPart2 = uri.substring(uri.indexOf("//") + 2);
        } else {
            uriPart1 = "rtsp://";
            uriPart2 = url.replace("//", "/"); // if has // replace them by /
        }

        uri = uriPart1 + user + ":" + pass + "@" + uriPart2;

        return uri;
    }


    private extractProfile(s: Scopes): OnvifProfile {
        const startIndex = s.ScopeItem.lastIndexOf("/") + 1;
        return {
            profile: s.ScopeItem.slice(startIndex)
        }
    }

}

export default OnvifServiceCLI;