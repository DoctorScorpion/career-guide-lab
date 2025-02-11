
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { SearchParams, Job } from './types.ts';
import { searchLinkedInJobs } from './search.ts';
import { fetchJobDetails } from './jobDetails.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const searchParams: SearchParams = await req.json();
    console.log('Received search params:', searchParams);

    console.log('Searching existing jobs in database...');
    const searchQuery = searchParams.skills.join(' ') + ' ' + searchParams.location + ' ' + searchParams.jobType;
    
    const { data: existingJobs, error: searchError } = await supabaseClient.rpc(
      'calculate_job_match_score',
      {
        search_query: searchQuery,
        search_skills: searchParams.skills,
        search_location: searchParams.location,
        search_type: searchParams.jobType
      }
    ).select('*')
    .order('match_score', { ascending: false })
    .limit(10);

    if (searchError) {
      console.error('Error searching existing jobs:', searchError);
    }

    const jobUrls = await searchLinkedInJobs(searchParams);
    console.log(`Found ${jobUrls.length} new job URLs`);

    const newJobsPromises = jobUrls.slice(0, 15).map(async (url) => {
      const details = await fetchJobDetails(url, supabaseClient);
      if (!details) return null;

      const job: Job = {
        id: crypto.randomUUID(),
        title: details.title,
        company: details.company,
        location: details.location || searchParams.location || 'תל אביב',
        description: details.description,
        requirements: details.requirements,
        job_type: searchParams.jobType || 'משרה מלאה',
        skills: searchParams.skills,
        match_score: await supabaseClient.rpc('calculate_job_match_score', {
          search_query: searchQuery,
          job_title: details.title,
          job_description: details.description,
          job_requirements: details.requirements,
          job_skills: searchParams.skills,
          search_skills: searchParams.skills,
          search_location: searchParams.location,
          search_type: searchParams.jobType
        }),
        source_url: url,
        linkedin_url: url
      };

      try {
        const { data: storedJob, error } = await supabaseClient
          .from('jobs')
          .upsert(job)
          .select()
          .single();

        if (error) {
          console.error('Error storing job:', error);
          return job;
        }

        return storedJob;
      } catch (error) {
        console.error('Error in database operation:', error);
        return job;
      }
    });

    const newJobs = (await Promise.all(newJobsPromises))
      .filter(Boolean)
      .sort((a, b) => (b?.match_score || 0) - (a?.match_score || 0));

    const allJobs = [...(existingJobs || []), ...newJobs]
      .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
      .slice(0, 15);

    return new Response(
      JSON.stringify({ jobs: allJobs }),
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
