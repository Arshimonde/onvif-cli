import DeviceInfo from "../classes/deviceInfo.class";
import IDeviceInfo from "../interfaces/cli/deviceInfo.interface";
import PromptService from "./prompt.service";
import validator from 'validator';
import { OnvifDevice } from "node-onvif-ts";
import { logLoading } from "../helpers/logger";
import { logError } from "../helpers/logger";
import { CapabalitiesFields } from "../enum/capabalities.enum";
import chalk from "chalk";
import { exec } from "child_process";

class CLIService {

    public static async getDeviceInfo(): Promise<IDeviceInfo> {
        try {
            let answer;
            let deviceInfo: IDeviceInfo;
            let deviceIP;
            let deviceUser;
            let devicePassword;

            // ask for ip
            answer = await PromptService.input(
                "Enter device IP address",
                "ip"
            );

            if(!validator.isIP(answer["ip"])){
                throw new Error("IP is invalid");
            }else{
                deviceIP = answer["ip"];
            }


            // ask for user
            answer = await PromptService.input(
                "Enter ONVIF username",
                "user"
            );

            deviceUser = answer["user"]

            // ask for password
            answer = await PromptService.password(
                "Enter ONVIF password",
                "password"
            );

            devicePassword = answer["password"]
            deviceInfo = new DeviceInfo(deviceIP, deviceUser, devicePassword);

            return deviceInfo;
        } catch (error) {
            throw error
        }
    }

    public static async initOnvifDevice (deviceInfo: IDeviceInfo): Promise<OnvifDevice>{
        const spinner = logLoading("Initializing device...")
        try {
            const device = new OnvifDevice({
                address: deviceInfo.ip,
                user: deviceInfo.username,
                pass: deviceInfo.password
            });
            // Initialize the OnvifDevice object
            await device.init();
            spinner.succeed("Device initialized\n")
            return device;
        } catch (error) {
            spinner.fail("Device not initialized\n");
            logError(error);
            process.exit();
        }
      
    }

    public static async selectCapabilities(): Promise<CapabalitiesFields>{
        const answer = await PromptService.list(
            "Please choose a capabilities field",
            "action",
            [
                "All",
                "Analytics",
                "Device",
                "Events",
                "Imaging",
                "Media",
                "PTZ",
                "Extension"
            ]
        );
        switch (answer["action"]) {
            case "All":   
            return CapabalitiesFields.All
            case "Analytics":
                return CapabalitiesFields.Analytics
            case "Device":
                return CapabalitiesFields.Device
            case "Events":
                return CapabalitiesFields.Events
            case "Imaging":
                return CapabalitiesFields.Imaging
            case "Media":
                return CapabalitiesFields.Media
            case "PTZ":
                return CapabalitiesFields.PTZ
            case "Extension":
                return CapabalitiesFields.Extension
            default:
                return CapabalitiesFields.All
        }
    }
    public static async askToPlayRTSPUri(Uri: string): Promise<boolean>{
        console.log(chalk.bgMagenta(chalk.white("If you have FFMPEG installed globaly, you can see preview of the stream")));
        const answer = await PromptService.confirm("Do you want to preview the stream", "confirm");
        if(answer["confirm"]){
            exec("ffplay '" + Uri + "' -loglevel panic", (error, stdout, stderr) => {
                if (error) {
                  console.error(`error: ${error.message}`);
                  return;
                }
              
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  return;
                }
            })
            
            return true;
        }else {
            return false;
        }
    }
}

export default CLIService