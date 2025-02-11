
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

interface JobDetails {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  url: string;
}

async function fetchJobDetails(url: string): Promise<JobDetails | null> {
  try {
    console.log('Fetching job details from:', url);
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse HTML');
      return null;
    }

    // Extract job details from LinkedIn page
    const title = doc.querySelector('h1')?.textContent?.trim() || '';
    const company = doc.querySelector('.company-name')?.textContent?.trim() || '';
    const location = doc.querySelector('.job-location')?.textContent?.trim() || '';
    const description = doc.querySelector('.job-description')?.textContent?.trim() || '';
    
    // Extract requirements from description
    const requirements = description
      .split('\n')
      .filter(line => line.includes('•') || line.toLowerCase().includes('requirement'))
      .map(req => req.trim())
      .filter(Boolean);

    return {
      title,
      company,
      location,
      description,
      requirements,
      url
    };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
}

async function searchLinkedInJobs(searchParams: SearchParams): Promise<string[]> {
  const searchTerms = [
    'site:linkedin.com/jobs/view/',
    ...searchParams.skills.map(skill => `"${skill}"`),
    searchParams.location && `"${searchParams.location}"`,
    searchParams.jobType,
  ].filter(Boolean);

  const timeFilter = {
    'last-day': '&tbs=qdr:d',
    'last-week': '&tbs=qdr:w',
    'last-month': '&tbs=qdr:m',
  }[searchParams.timeRange] || '';

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms.join(' '))}${timeFilter}`;
  
  try {
    console.log('Searching Google with URL:', searchUrl);
    const response = await fetch(searchUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse Google search results');
      return [];
    }

    // Extract LinkedIn job URLs from Google search results
    const jobUrls = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href?.includes('linkedin.com/jobs/view/'))
      .map(href => href?.split('&')[0]) // Remove Google parameters
      .filter(Boolean) as string[];

    console.log('Found job URLs:', jobUrls);
    return jobUrls;
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
}

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

    // Search for job URLs
    const jobUrls = await searchLinkedInJobs(searchParams);
    console.log(`Found ${jobUrls.length} job URLs`);

    // Fetch details for each job
    const jobPromises = jobUrls.slice(0, 15).map(async (url) => {
      const details = await fetchJobDetails(url);
      if (!details) return null;

      return {
        id: crypto.randomUUID(),
        title: details.title,
        company: details.company,
        location: details.location || searchParams.location || 'תל אביב',
        description: details.description,
        requirements: details.requirements,
        job_type: searchParams.jobType || 'משרה מלאה',
        skills: searchParams.skills,
        match_score: Math.floor(Math.random() * 30) + 70,
        source_url: url,
        linkedin_url: url
      };
    });

    const jobs = (await Promise.all(jobPromises)).filter(Boolean);

    // Store jobs in Supabase
    const { data: storedJobs, error } = await supabaseClient
      .from('jobs')
      .upsert(jobs)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ jobs: storedJobs }),
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
