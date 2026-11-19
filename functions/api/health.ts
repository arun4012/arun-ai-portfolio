// Cloudflare Pages Function: /api/health
// Simple health check endpoint

export const onRequest: PagesFunction = async (context) => {
  return new Response(
    JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
