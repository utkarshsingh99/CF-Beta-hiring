import { v4 as uuidv4 } from 'uuid';

async function handleCORS(request) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return headers;
}

async function authenticateRequest(request) {
    // Implement your authentication logic here.
    return true; // For now, we'll just return true.
}

export async function onRequestGet({ request, env }) {
    const corsHeaders = handleCORS(request);

    // if (!await authenticateRequest(request)) {
    //     return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    // }
    
    let notifications;
    try {
        notifications = await request.json();
    } catch (err) {
        return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    if (!Array.isArray(notifications)) {
        notifications = [notifications];
    }

    const responses = notifications.map(notification => {
        const id = uuidv4();
        const timestamp = Date.now();
        const notificationWithMeta = {
            notification,
            id,
            timestamp
        };
        env.NOTIFICATIONS.put(id, JSON.stringify(notificationWithMeta));
        return notificationWithMeta;
    });

    // Return the notification response as Array .
    return new Response(JSON.stringify(responses), { status: 201, headers: corsHeaders });
}
