import { deviceWidth } from "../constants";
import { deviceType } from "../constants/deviceWidth";

export const getDeviceType = (width: number): string => {
  if (width > deviceWidth["desktob"]) {
    return deviceType.desktob;
  }
  if (deviceWidth["tablet"] > width) {
    return deviceType.mobile;
  }

  return deviceType.tablet;
};
