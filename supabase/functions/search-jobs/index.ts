
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

// רשימת User Agents לרוטציה
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
];

// פונקציית עזר להשהייה
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// פונקציה לקבלת User Agent אקראי
const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // השהייה אקראית בין 1-3 שניות
      await delay(1000 + Math.random() * 2000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      // השהייה ארוכה יותר בין ניסיונות
      await delay(2000 * (i + 1));
    }
  }
  
  throw lastError;
}

async function fetchJobDetails(url: string, supabaseClient: any): Promise<JobDetails | null> {
  try {
    // בדיקה האם המשרה כבר קיימת ב-Cache
    const { data: cachedJob } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('linkedin_url', url)
      .single();

    if (cachedJob && 
        cachedJob.created_at && 
        (new Date().getTime() - new Date(cachedJob.created_at).getTime() < 24 * 60 * 60 * 1000)) {
      console.log('Using cached job data for:', url);
      return {
        title: cachedJob.title,
        company: cachedJob.company,
        location: cachedJob.location,
        description: cachedJob.description,
        requirements: cachedJob.requirements,
        url: cachedJob.linkedin_url
      };
    }

    console.log('Fetching fresh job details from:', url);
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse HTML');
      return null;
    }

    // שיפור חילוץ המידע עם סלקטורים מדויקים יותר
    const selectors = {
      title: ['h1', '.job-title', '.position-title', '.job-position'],
      company: ['.company-name', '.employer-name', '.organization-name'],
      location: ['.job-location', '.location', '.workplace-type'],
      description: ['.job-description', '.description', '.job-details'],
    };

    const findElement = (selectors: string[]) => {
      for (const selector of selectors) {
        const element = doc.querySelector(selector);
        if (element?.textContent) {
          return element.textContent.trim();
        }
      }
      return '';
    };

    const title = findElement(selectors.title);
    const company = findElement(selectors.company);
    const location = findElement(selectors.location);
    const description = findElement(selectors.description);
    
    // שיפור חילוץ הדרישות
    const requirements = description
      .split(/[\n\r]+/)
      .filter(line => {
        const trimmedLine = line.trim();
        return trimmedLine.startsWith('•') || 
               trimmedLine.toLowerCase().includes('requirement') ||
               trimmedLine.toLowerCase().includes('דרישות') ||
               trimmedLine.toLowerCase().includes('חובה') ||
               trimmedLine.toLowerCase().includes('יתרון');
      })
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
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse Google search results');
      return [];
    }

    const jobUrls = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href?.includes('linkedin.com/jobs/view/'))
      .map(href => href?.split('&')[0])
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

    const jobUrls = await searchLinkedInJobs(searchParams);
    console.log(`Found ${jobUrls.length} job URLs`);

    const jobPromises = jobUrls.slice(0, 15).map(async (url) => {
      const details = await fetchJobDetails(url, supabaseClient);
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
