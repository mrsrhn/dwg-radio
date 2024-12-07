export const notificationResponseSchema = {
    type: 'object',
    properties: {
        messages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    message: { type: 'string' },
                },
                required: ['id', 'message'],
            },
        },
    },
    required: ['messages'],
};