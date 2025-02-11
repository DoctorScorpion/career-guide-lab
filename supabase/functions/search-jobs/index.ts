
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const mockJobs = Array.from({ length: 15 }, (_, i) => {
      const skills = searchParams.skills;
      const title = `${skills[0]} Developer Position`;  // More generic title
      const companies = ['חברת הייטק א׳', 'חברת הייטק ב׳', 'סטארטאפ ג׳', 'חברת פיתוח ד׳', 'חברת תוכנה ה׳'];
      
      // Construct Google search URL with dorks to search only on LinkedIn
      const searchTerms = [
        'site:linkedin.com/jobs',  // Search only in LinkedIn jobs
        'inurl:view',              // Make sure we get direct job links
        ...skills.map(skill => `"${skill}"`), // Add all skills as exact match terms
        searchParams.location && `"${searchParams.location}"`,
        searchParams.jobType,
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

      // Create direct Google search URL for specific job
      const specificJobSearchTerms = [
        'site:linkedin.com/jobs/view/',  // Only show job view pages
        `"${title}"`,                    // Exact match for job title
        `"${companies[i % companies.length]}"`, // Exact match for company name
        ...skills.map(skill => `"${skill}"`),   // Exact match for skills
        searchParams.location && `"${searchParams.location}"`,
        searchParams.jobType && `"${searchParams.jobType}"`,
      ].filter(Boolean);

      const encodedSearch = encodeURIComponent(specificJobSearchTerms.join(' '));
      const googleSearchUrl = `https://www.google.com/search?q=${encodedSearch}${timeFilter}`;
      
      // Create LinkedIn search URL as fallback
      const linkedinJobUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedSearch}&location=${encodeURIComponent(searchParams.location || 'Israel')}`;

      return {
        id: crypto.randomUUID(),
        title,
        company: companies[i % companies.length],
        location: searchParams.location || 'תל אביב',
        description: `משרת ${title} ${searchParams.jobType ? `ב${searchParams.jobType}` : 'במשרה מלאה'} ${searchParams.location ? `ב${searchParams.location}` : ''}\nדרישות: ${skills.join(', ')}`,
        requirements: skills,
        job_type: searchParams.jobType || 'משרה מלאה',
        skills: skills,
        match_score: Math.floor(Math.random() * 30) + 70,
        source_url: googleSearchUrl,
        linkedin_url: linkedinJobUrl
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
