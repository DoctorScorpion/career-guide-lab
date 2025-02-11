
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { JobDetails } from './types.ts';
import { fetchWithRetry } from './fetch.ts';

export async function fetchJobDetails(url: string, supabaseClient: any): Promise<JobDetails | null> {
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
    console.log('Received HTML:', html.substring(0, 500));
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
