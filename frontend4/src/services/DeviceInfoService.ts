import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export interface DeviceInfoData {
  device_model: string;
  device_os: string;
  device_os_version: string;
  app_version: string;
}

/**
 * Service for collecting device information
 * Used for tracking user sessions and login history
 */
export class DeviceInfoService {
  /**
   * Collect device information
   * Returns device model, OS, version, and app version
   */
  static async getDeviceInfo(): Promise<DeviceInfoData> {
    const [model, version, appVersion] = await Promise.all([
      DeviceInfo.getModel(),
      DeviceInfo.getSystemVersion(),
      DeviceInfo.getVersion(),
    ]);

    return {
      device_model: model,
      device_os: Platform.OS,
      device_os_version: version,
      app_version: appVersion,
    };
  }
}
