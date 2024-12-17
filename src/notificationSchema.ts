export const notificationResponseSchema = {
    type: 'object',
    properties: {
        notifications: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    icon: { type: 'string' },
                    color: { type: 'string' },
                    production: { type: 'boolean' },
                    message: { type: 'string' },
                    link: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string' },
                        },
                        required: ['title', 'url'],
                    },
                    minAppVersion: {
                        type: 'object',
                        properties: {
                            ios: { type: 'string' },
                            android: { type: 'string' },
                        },
                        required: ['ios', 'android'],
                    },
                    maxAppVersion: {
                        type: 'object',
                        properties: {
                            ios: { type: 'string' },
                            android: { type: 'string' },
                        },
                        required: ['ios', 'android'],
                    },
                },
                required: ['id', 'title', 'message', 'icon', 'minAppVersion', 'maxAppVersion'],
            },
        },
    },
    required: ['notifications'],
};