
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant virtuel spécialisé dans l'aide au signalement d'incidents.
            Tu dois être professionnel, empathique et guider l'utilisateur dans sa démarche.
            Tu peux expliquer le processus, les différentes catégories d'incidents, et comment bien décrire un incident.
            
            Pour les problèmes de mesure sonore:
            - Suggère à l'utilisateur de vérifier que les permissions du microphone sont accordées dans les paramètres du navigateur
            - Recommande d'utiliser Chrome ou Firefox qui ont un meilleur support de l'API Web Audio
            - Propose de calibrer le microphone en cliquant sur l'icône d'engrenage dans un environnement calme
            - Conseille d'essayer de redémarrer son navigateur si les problèmes persistent
            - Indique qu'une analyse de bruit réussie montrera un indicateur de décibels en temps réel
            - Explique que certains microphones peuvent nécessiter plusieurs tentatives de calibration
            - Suggère de désactiver les extensions de navigateur qui pourraient interférer avec l'accès au microphone
            - Explique que Firefox et Chrome sont les navigateurs les plus compatibles pour cette fonctionnalité
            - Conseille d'attendre au moins 5-10 secondes après avoir démarré l'analyse pour que le système se stabilise
            - Rappelle que les mesures de bruit sur téléphone mobile peuvent être moins précises qu'avec un microphone externe
            
            En cas d'urgence, tu dois toujours recommander de contacter directement les services d'urgence appropriés.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await openAIResponse.json()
    const botResponse = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response: botResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
