import { Platform } from "react-native";
import { Notification } from "../hooks/useNotifications";
import * as Application from 'expo-application';

export const isNotificationValid = (data: Notification) => {
    return appVersionIsValid(data) && matchesCurrentEnvironment(data);
}

export const appVersionIsValid = (data: Notification) => {
    const minAppVersion = data.minAppVersion[Platform.OS as 'ios' | 'android'];
    const maxAppVersion = data.maxAppVersion[Platform.OS as 'ios' | 'android'];
    if (!minAppVersion || !maxAppVersion) {
        return false;
    }
    const appVersion = Application.nativeApplicationVersion;
    if (!appVersion) {
        return false;
    }
    return appVersion >= minAppVersion && appVersion <= maxAppVersion;
}

export const matchesCurrentEnvironment = (data: Notification) => {
    return ((__DEV__ && !data.production) || (!__DEV__ && data.production));
}
