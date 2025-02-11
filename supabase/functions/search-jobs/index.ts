
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

    // Initialize LinkedIn API configuration
    const LINKEDIN_API_KEY = Deno.env.get('LINKEDIN_API_KEY');
    if (!LINKEDIN_API_KEY) {
      throw new Error('LinkedIn API key not configured');
    }

    // Construct LinkedIn API request
    const baseUrl = 'https://api.linkedin.com/v2/jobs/search';
    const skills = searchParams.skills.join(' OR ');
    const location = searchParams.location;
    
    // Perform LinkedIn API request
    const response = await fetch(`${baseUrl}?keywords=${encodeURIComponent(skills)}&location=${encodeURIComponent(location)}`, {
      headers: {
        'Authorization': `Bearer ${LINKEDIN_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const linkedinJobs = await response.json();
    console.log('LinkedIn API response:', linkedinJobs);

    // Transform and store jobs in Supabase
    const { data: jobs, error } = await supabaseClient
      .from('jobs')
      .upsert(linkedinJobs.elements.map((job: any) => ({
        title: job.title,
        company: job.company.name,
        location: job.location,
        description: job.description,
        requirements: searchParams.skills,
        job_type: searchParams.jobType,
        linkedin_url: job.referenceUrl,
        source_url: job.referenceUrl,
        skills: searchParams.skills,
        match_score: Math.floor(Math.random() * 30) + 70 // Temporary scoring logic
      })))
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
