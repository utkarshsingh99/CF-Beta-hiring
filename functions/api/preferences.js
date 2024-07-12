async function handleCORS(request) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return headers;
}


export async function onRequestGet({ request }) {
    const corsHeaders = handleCORS(request);

    const preferences = {
        displayDuration: 5000,
        preferredTypes: ["alert", "info"]
    };

    const headers = new Headers(corsHeaders);
    headers.set('Set-Cookie', `preferences=${JSON.stringify(preferences)}; Max-Age=259200; Path=/api/notifications/cookie`);

    return new Response(JSON.stringify(preferences), { status: 200, headers });
}
