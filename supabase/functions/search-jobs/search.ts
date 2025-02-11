
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

  // בניית שאילתת החיפוש המותאמת
  const skillsQuery = searchParams.skills.length > 0 
    ? searchParams.skills.map(skill => `"${skill}"`).join(' AND ')
    : '"Cloud" AND "Security"';  // ערכי ברירת מחדל המעודכנים
    
  const locationQuery = searchParams.location 
    ? `"${searchParams.location}"` 
    : '"Central Israel"';  // ברירת מחדל למיקום
    
  const dateFilter = getDateFilter();
  
  // בניית השאילתה לפי הפורמט המבוקש:
  // site:linkedin.com/jobs inurl:view "Cloud" AND "Security" AND "Central Israel" after:2024-03-01
  const searchQuery = `site:linkedin.com/jobs inurl:view ${skillsQuery} AND ${locationQuery} after:${dateFilter}`;
  console.log('Building search query:', searchQuery);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100&filter=0`;
  
  try {
    console.log('Searching Google with URL:', searchUrl);
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    
    // לוג מורחב לדיבוג
    console.log('Search URL:', searchUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response HTML (first 1000 chars):', html.substring(0, 1000));
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.log('Failed to parse Google search results');
      return [];
    }

    const jobUrls: string[] = [];
    const links = doc.querySelectorAll('a');
    
    console.log('Found links:', links.length);
    
    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      console.log(`Link ${index}:`, href);

      if (href.startsWith('/url?q=')) {
        const cleanUrl = href.split('/url?q=')[1]?.split('&')[0];
        if (cleanUrl?.includes('linkedin.com/jobs/view/')) {
          try {
            const url = new URL(decodeURIComponent(cleanUrl));
            if (url.hostname.endsWith('linkedin.com')) {
              jobUrls.push(url.toString());
              console.log('Added job URL:', url.toString());
            }
          } catch (e) {
            console.error('Error parsing URL:', cleanUrl, e);
          }
        }
      }
      else if (href.includes('linkedin.com/jobs/view/')) {
        jobUrls.push(href);
        console.log('Added direct job URL:', href);
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
