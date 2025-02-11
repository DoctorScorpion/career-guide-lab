
import { serve } from "https://deno.fresh.dev/std@v1/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  skills: string[];
  location: string;
  jobType: string;
  timeRange: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const searchParams: SearchParams = await req.json();
    console.log('Received search params:', searchParams);

    // Create random sample jobs for demonstration
    const mockJobs = Array.from({ length: 5 }, (_, i) => {
      const skills = searchParams.skills;
      const title = `${skills[0]} Developer`;
      const companies = ['חברת הייטק א׳', 'חברת הייטק ב׳', 'סטארטאפ ג׳', 'חברת פיתוח ד׳', 'חברת תוכנה ה׳'];
      
      // Construct Google search URL with dorks
      const searchTerms = [
        ...skills,
        searchParams.location,
        searchParams.jobType,
        'משרה',
        'דרושים'
      ].filter(Boolean);
      
      // Add time filter based on timeRange
      let timeFilter = '';
      switch (searchParams.timeRange) {
        case 'last-day':
          timeFilter = '&tbs=qdr:d';
          break;
        case 'last-week':
          timeFilter = '&tbs=qdr:w';
          break;
        case 'last-month':
          timeFilter = '&tbs=qdr:m';
          break;
        default:
          timeFilter = '';
      }

      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms.join(' '))}${timeFilter}`;

      return {
        id: crypto.randomUUID(),
        title,
        company: companies[i],
        location: searchParams.location || 'תל אביב',
        description: `אנחנו מחפשים ${title} ${searchParams.jobType ? `ל${searchParams.jobType}` : 'למשרה מלאה'} ${searchParams.location ? `ב${searchParams.location}` : ''}`,
        requirements: skills,
        job_type: searchParams.jobType || 'משרה מלאה',
        skills: skills,
        match_score: Math.floor(Math.random() * 30) + 70,
        source_url: googleSearchUrl
      };
    });

    // Store jobs in Supabase
    const { data: jobs, error } = await supabaseClient
      .from('jobs')
      .upsert(mockJobs)
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ jobs }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
