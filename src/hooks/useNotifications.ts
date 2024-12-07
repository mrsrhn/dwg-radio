import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import useConfig from './useConfig';
import AJV from 'ajv';
import { notificationResponseSchema } from '../notificationSchema';
import { isNotificationValid } from '../utils/notifications';

const ajv = new AJV();
const validate = ajv.compile(notificationResponseSchema);
const storage = new MMKV();

export interface Notification {
    id: number;
    title: string;
    message: string;
    icon: string;
    color?: string;
    link?: {
        title: string;
        url: string;
    };
    minAppVersion: {
        ios: string;
        android: string;
    };
    maxAppVersion: {
        ios: string;
        android: string;
    };
}

interface NotificationResponse {
    notifications: Notification[];
}

export const useNotifications = () => {
    const { configBase } = useConfig();

    const [notification, setNotification] = useState<Notification | undefined>();

    useEffect(() => {
        const checkForNotifications = async () => {
            try {
                const response = await fetch(configBase.urlNotifications);
                const data: NotificationResponse = await response.json();

                // Validate the response data
                const valid = validate(data);

                if (!valid) {
                    console.error('Invalid response data:', validate.errors);
                    return; // Exit if validation fails
                }

                // Check if we have this notification id in storage
                const shownNotifications = storage.getString('shown-notifications');
                const shownNotificationIds = shownNotifications ? JSON.parse(shownNotifications) : [];

                console.log('Already shown notification IDs:', shownNotificationIds);

                // Find first unshown notification
                const unshownNotification = data.notifications.find(
                    (notification) => !shownNotificationIds.includes(notification.id)
                );

                if (!unshownNotification) {
                    console.log('No unshown notifications found');
                    return;
                }

                if (!isNotificationValid(unshownNotification)) {
                    console.log('Notification is not valid');
                    return;
                }


                console.log('Found valid unshown notification:', unshownNotification);
                setNotification(unshownNotification);


                // Store the message id as shown
                storage.set(
                    'shown-notifications',
                    JSON.stringify([...shownNotificationIds, unshownNotification.id])
                );
                console.log('Added new notification ID to shown notifications');

            } catch (error) {
                console.log('Failed to fetch remote notifications:', error);
            }
        };

        checkForNotifications();
    }, []);

    return notification;
};