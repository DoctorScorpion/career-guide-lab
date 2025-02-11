
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { SearchParams } from './types.ts';
import { fetchWithRetry } from './fetch.ts';

export async function searchLinkedInJobs(searchParams: SearchParams): Promise<string[]> {
  const getDateFilter = () => {
    const today = new Date();
    switch (searchParams.timeRange) {
      case '24h':
        today.setDate(today.getDate() - 1);
        break;
      case 'week':
        today.setDate(today.getDate() - 7);
        break;
      case 'three-months':
        today.setDate(today.getDate() - 90);
        break;
      case 'last-month':
      default:
        today.setDate(today.getDate() - 30);
        break;
    }
    return today.toISOString().split('T')[0];
  };

  const skillsQuery = searchParams.skills.map(skill => `"${skill}"`).join(' AND ');
  const locationQuery = searchParams.location ? `"${searchParams.location}"` : '';
  const dateFilter = getDateFilter();
  
  const searchQuery = `site:linkedin.com/jobs/view ${skillsQuery} ${locationQuery} after:${dateFilter}`;
  console.log('Building search query:', searchQuery);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100&filter=0`;
  
  try {
    console.log('Searching Google with URL:', searchUrl);
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    console.log('Received search results HTML:', html.substring(0, 500));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse Google search results');
      return [];
    }

    const jobUrls: string[] = [];
    const links = doc.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('/url?q=')) {
        const cleanUrl = href.split('/url?q=')[1]?.split('&')[0];
        if (cleanUrl?.includes('linkedin.com/jobs/view/')) {
          try {
            const url = new URL(decodeURIComponent(cleanUrl));
            if (url.hostname.endsWith('linkedin.com')) {
              jobUrls.push(url.toString());
            }
          } catch (e) {
            console.error('Error parsing URL:', cleanUrl, e);
          }
        }
      }
      else if (href.includes('linkedin.com/jobs/view/')) {
        jobUrls.push(href);
      }
    });

    const uniqueJobUrls = Array.from(new Set(jobUrls));
    console.log(`Found ${uniqueJobUrls.length} unique job URLs:`, uniqueJobUrls);
    return uniqueJobUrls;
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
}
