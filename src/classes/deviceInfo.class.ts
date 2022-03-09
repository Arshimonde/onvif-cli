import IDeviceInfo from "../interfaces/cli/deviceInfo.interface";

class DeviceInfo implements IDeviceInfo{
    ip: string;
    username: string;
    password: string;
    
    constructor(ip:string, username: string, password: string){
        this.ip = ip;
        this.username = username;
        this.password = password;
    }
}

export default DeviceInfo;