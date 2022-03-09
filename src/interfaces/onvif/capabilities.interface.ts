/**
 * @description an interface for ONVIF Capabalities 
 * @link http://www.onvif.org/onvif/ver10/device/wsdl/devicemgmt.wsdl 
 * @method GetCapabilities 
 * @see http://www.onvif.org/ver10/device/wsdl/GetCapabilities 
*/


export interface SupportedVersions {
        Major: Number,
        Minor: Number
}

export interface Analytics {
    XAddr: URL
    RuleSupport: Boolean
    AnalyticsModuleSupport: Boolean
}


export interface Device {
    XAddr: URL
    Network: {
        IPFilter: Boolean,
        ZeroConfiguration: Boolean,
        IPVersion6: Boolean,
        DynDNS: Boolean,
        Extension: {
            Dot11Configuration: Boolean,
            Extension: any
        }
    }
    System: {
        DiscoveryResolve: Boolean,
        DiscoveryBye: Boolean,
        RemoteDiscovery: Boolean,
        SystemBackup: Boolean,
        SystemLogging: Boolean,
        FirmwareUpgrade: Boolean,
        SupportedVersions:  SupportedVersions | Array<SupportedVersions>,
        Extension: {
            HttpFirmwareUpgrade: Boolean,
            HttpSystemBackup: Boolean,
            HttpSystemLogging: Boolean,
            HttpSupportInformation: Boolean,
            Extension: any
        }
    },
    IO: {
        InputConnectors: Number,
        RelayOutputs: Number,
        Extension: {
            Auxiliary: Boolean,
            AuxiliaryCommands: any,
            Extension: any
        }
    },
    Security: {
        "TLS1.1": Boolean,
        "TLS1.2": Boolean,
        OnboardKeyGeneration: Boolean,
        AccessPolicyConfig: Boolean,
        "X.509Token": Boolean,
        SAMLToken: Boolean,
        KerberosToken: Boolean,
        RELToken: Boolean,
        Extension: {
            "TLS1.0": Boolean,
            Extension: {
                Dot1X: Boolean,
                SupportedEAPMethod: Number,
                RemoteUserHandling: Boolean
            }
        }
    }
    Extension: any
}

export interface Events {
    XAddr: URL,
    WSSubscriptionPolicySupport: Boolean,
    WSPullPointSupport: Boolean,
    WSPausableSubscriptionManagerInterfaceSupport: Boolean
}

export interface Imaging {
    XAddr: URL
}
export interface Media {
    XAddr: URL,
    StreamingCapabilities: {
        RTPMulticast: Boolean,
        RTP_TCP: Boolean,
        RTP_RTSP_TCP: Boolean,
        Extension: any
    },
    Extension: {
        ProfileCapabilities: {
            MaximumNumberOfProfiles: Number
        }
    }
}

export interface PTZ {
    XAddr: URL
}
export interface Extension {
    DeviceIO?: {
        XAddr: URL,
        VideoSources: Number,
        VideoOutputs: Number,
        AudioSources: Number,
        AudioOutputs: Number,
        RelayOutputs: Number
    },
    Display?: {
        XAddr: URL,
        FixedLayout: Boolean
    },
    Recording?: {
        XAddr: URL,
        ReceiverSource: Boolean,
        MediaProfileSource: Boolean,
        DynamicRecordings: Boolean,
        DynamicTracks: Boolean,
        MaxStringLength: Number
    },
    Search?: {
        XAddr: URL,
        MetadataSearch: Boolean
    },
    Replay?: {
        XAddr: URL
    },
    Receiver?: {
        XAddr: URL,
        RTP_Multicast: Boolean,
        RTP_TCP: Boolean,
        RTP_RTSP_TCP: Boolean,
        SupportedReceivers: Number,
        MaximumRTSPURILength: Number
    },
    AnalyticsDevice?: {
        XAddr: URL,
        RuleSupport?: Boolean
    },
    Extensions: any
}

interface Capabalities {
    Analytics?: Analytics,
    Device?: Device,
    Events?: Events,
    Imaging?: Imaging,
    Media?: Media,
    PTZ?: PTZ,
    Extension?: Extension
}

export default Capabalities