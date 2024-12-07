import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import useConfig from './useConfig';
import AJV from 'ajv';
import { notificationResponseSchema } from '../notificationSchema';

const ajv = new AJV();
const storage = new MMKV();

interface Notification {
    id: number;
    message: string;
}

interface NotificationResponse {
    messages: Notification[];
}

export const useNotifications = () => {
    const { configBase } = useConfig();

    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkForNotifications = async () => {
            try {
                const response = await fetch(configBase.urlNotifications);
                const data: NotificationResponse = await response.json();

                // Validate the response data
                const validate = ajv.compile(notificationResponseSchema);
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
                const unshownNotification = data.messages.find(
                    (msg) => !shownNotificationIds.includes(msg.id)
                );

                if (unshownNotification) {
                    console.log('Found unshown notification:', unshownNotification);
                    setMessage(unshownNotification.message);
                    setModalVisible(true);

                    // Store the message id as shown
                    storage.set(
                        'shown-notifications',
                        JSON.stringify([...shownNotificationIds, unshownNotification.id])
                    );
                    console.log('Added new notification ID to shown notifications');
                } else {
                    console.log('All notifications have been shown already');
                }
            } catch (error) {
                console.log('Failed to fetch remote notifications:', error);
            }
        };

        checkForNotifications();
    }, []);

    return [modalVisible, setModalVisible, message] as const;
};
