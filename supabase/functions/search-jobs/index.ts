
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

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
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
      await delay(2000 * (i + 1));
    }
  }
  
  throw lastError;
}

async function fetchJobDetails(url: string, supabaseClient: any): Promise<JobDetails | null> {
  try {
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
    if (!title) {
      console.error('No title found, page might be blocked');
      const urlParts = url.split('/');
      const basicTitle = urlParts[urlParts.length - 1]
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      return {
        title: basicTitle,
        company: "חברה לא ידועה",
        location: "ישראל",
        description: "מידע מפורט על המשרה זמין בלינקדאין. לחץ על הקישור למטה כדי לצפות במשרה המלאה.",
        requirements: [],
        url
      };
    }

    const company = findElement(selectors.company);
    const location = findElement(selectors.location);
    const description = findElement(selectors.description);
    
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
    return {
      title: "משרה בלינקדאין",
      company: "חברה לא ידועה",
      location: "ישראל",
      description: "לצפייה בפרטי המשרה המלאים, אנא לחץ על הקישור למטה.",
      requirements: [],
      url
    };
  }
}

async function searchLinkedInJobs(searchParams: SearchParams): Promise<string[]> {
  // חישוב תאריך לפי טווח הזמן שנבחר
  const getDateFilter = () => {
    const today = new Date();
    switch (searchParams.timeRange) {
      case 'last-day':
        today.setDate(today.getDate() - 1);
        break;
      case 'last-week':
        today.setDate(today.getDate() - 7);
        break;
      case 'last-month':
        today.setDate(today.getDate() - 30);
        break;
      default:
        today.setDate(today.getDate() - 30); // ברירת מחדל - חודש אחרון
    }
    return `after:${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // בניית שאילתת החיפוש המשופרת
  const searchQuery = [
    'site:linkedin.com/jobs',
    'inurl:view',
    ...searchParams.skills.map(skill => `"${skill}"`),
    searchParams.location ? `"${searchParams.location}"` : '',
    getDateFilter()
  ].filter(Boolean).join(' ');

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100`; // מבקש 100 תוצאות
  
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

    // שיפור איסוף הקישורים עם יותר סלקטורים
    const jobUrls = Array.from(doc.querySelectorAll('a'))
      .map(a => {
        const href = a.getAttribute('href');
        if (!href) return null;
        
        // ניקוי ה-URL והוצאת הקישור הנקי
        const match = href.match(/https:\/\/[^\/]*linkedin\.com\/jobs\/view\/[^&]*/);
        return match ? match[0] : null;
      })
      .filter((url): url is string => {
        if (!url) return false;
        // וידוא שזה אכן קישור למשרה בלינקדאין
        return url.includes('linkedin.com/jobs/view/');
      });

    // הסרת כפילויות
    const uniqueJobUrls = Array.from(new Set(jobUrls));
    
    console.log(`Found ${uniqueJobUrls.length} unique job URLs`);
    return uniqueJobUrls;
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

    // חיפוש משרות קיימות במאגר
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

    // חיפוש משרות חדשות דרך לינקדאין
    const jobUrls = await searchLinkedInJobs(searchParams);
    console.log(`Found ${jobUrls.length} new job URLs`);

    const newJobsPromises = jobUrls.slice(0, 15).map(async (url) => {
      const details = await fetchJobDetails(url, supabaseClient);
      if (!details) return null;

      const job = {
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

    // שילוב התוצאות
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
