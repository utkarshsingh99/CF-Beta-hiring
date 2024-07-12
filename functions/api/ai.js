async function handleCORS(request) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return headers;
}

export async function sanitizeAICategory(category) {
    return category.toLowerCase();
}

export async function onRequestPost({ request, env }) {
    const corsHeaders = handleCORS(request);

    const { text } = await request.json();
    const prompt = `Classify the given notification text into one of these categories: finance, weather, health, or technology. The text will clearly belong to one of these categories. Respond with only the category name in lowercase.\n\nNotification text: "${text}"`;

    const input = { prompt }

  const answer = await env.AI.run('@cf/meta/llama-3-8b-instruct', input);

  return Response.json({category: answer.response});

    const aiResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/workers/scripts/YOUR_SCRIPT_NAME/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.AI_API_TOKEN}`
        },
        body: JSON.stringify({ prompt })
    });

    const result = await aiResponse.json();
    const category = sanitizeAICategory(result.choices[0].text.trim());

    return new Response(JSON.stringify({ category }), { status: 200, headers: corsHeaders });
}
