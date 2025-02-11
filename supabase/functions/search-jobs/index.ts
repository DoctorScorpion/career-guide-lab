
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      } 
    });
  }

  try {
    // בדיקת תקינות ה-request
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const searchParams: SearchParams = await req.json();
    console.log('Received search params:', searchParams);

    // חיפוש משרות חדשות בלינקדאין
    const jobUrls = await searchLinkedInJobs(searchParams);
    console.log(`Found ${jobUrls.length} new job URLs:`, jobUrls);

    if (!jobUrls.length) {
      return new Response(
        JSON.stringify({ jobs: [] }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const newJobsPromises = jobUrls.slice(0, 15).map(async (url) => {
      try {
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
          match_score: 0,
          source_url: url,
          linkedin_url: url
        };

        try {
          const { data: matchScore } = await supabaseClient.rpc('calculate_job_match_score', {
            job_description: details.description,
            job_requirements: details.requirements,
            job_skills: searchParams.skills,
            search_skills: searchParams.skills,
            search_location: searchParams.location,
            search_type: searchParams.jobType,
            job_title: details.title,
            search_query: searchParams.skills.join(' ')
          });

          job.match_score = matchScore || 0;

          const { data: storedJob, error: storeError } = await supabaseClient
            .from('jobs')
            .upsert(job)
            .select()
            .single();

          if (storeError) {
            console.error('Error storing job:', storeError);
            return job;
          }

          return storedJob;
        } catch (error) {
          console.error('Error in job processing:', error);
          return job;
        }
      } catch (error) {
        console.error('Error processing job URL:', url, error);
        return null;
      }
    });

    const jobs = (await Promise.all(newJobsPromises))
      .filter(Boolean)
      .sort((a, b) => (b?.match_score || 0) - (a?.match_score || 0))
      .slice(0, 15);

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
    console.error('Error in search-jobs function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
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
