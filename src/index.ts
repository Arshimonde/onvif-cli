#! /usr/bin/env node
import PromptService from "./services/prompt.service"
import validator from 'validator';
import { OnvifDevice } from "node-onvif-ts";
import { logError, logJSON, logLoading, logSuccess, logTable } from "./helpers/logger";
import CLIService from "./services/cli.service";
import IDeviceInfo from "./interfaces/cli/deviceInfo.interface";
import Capabalities from "./interfaces/onvif/capabilities.interface";
import { Scopes } from "./interfaces/onvif/scopes.interface";
import OnvifServiceCLI from "./services/onvif.service";


let deviceInfo: IDeviceInfo;
let device: OnvifDevice;

console.log("Welcome to the interactive ONVIF CLI");
console.log("Before we get started, please provide the ONVIF device credentials");


async function cli() {
    try {
        let answer;    
        let onvifService: OnvifServiceCLI;

        if(!deviceInfo){
            deviceInfo = await CLIService.getDeviceInfo();
            // Create & Init an OnvifDevice object
            device = await CLIService.initOnvifDevice(deviceInfo);
        }

        onvifService = new OnvifServiceCLI(device);
        
        // Ask the user for an action
        answer = await PromptService.list(
            "Please choose an action",
            "action",
            [
                "device-information",
                "get-capabilites",
                "get-device-profiles",
                "change-device",
                "exit"
            ]
        );

        // Execute a logic depending on the chosen action
        switch (answer["action"]) {
            case "device-information":
                console.log("the following table shows device details:");
                logTable(device.getInformation())
                break;
            case "get-capabilites":
                const capabilites = await onvifService.getCapabilities();
                const field = await CLIService.selectCapabilities();
                const selectedField = OnvifServiceCLI.getCapabalityField(capabilites, field);
                logJSON(selectedField)
                break;
            case "get-device-profiles": {
                const profiles = await onvifService.getProfiles();
                logTable(profiles);
                break;
            }
            case "change-device": {
                deviceInfo = await CLIService.getDeviceInfo();
                device = await CLIService.initOnvifDevice(deviceInfo);
                break;
            }
            case "exit": {
                console.log("Bye! thanks for using ONVIF CLI");
                process.exit()
            }
            default:
                break;
        }

    } catch (error) {       
        logError(error);
    } finally {
        // loop cli
        cli();
    }
}


cli()