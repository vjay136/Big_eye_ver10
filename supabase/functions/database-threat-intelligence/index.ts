// The archived implementation generated random threat verdicts.
import { corsHeaders } from '../_shared/corsHeaders.ts';

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  return new Response(JSON.stringify({
    error: {
      code: 'INTELLIGENCE_NOT_CONFIGURED',
      message: 'This module requires a verified intelligence data source. Configure a provider before using it.'
    }
  }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
