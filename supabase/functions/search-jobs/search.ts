
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
    ? searchParams.skills.map(skill => `"${skill}"`).join(' OR ')  // שינוי מ-AND ל-OR להגדלת תוצאות
    : '"Cloud" OR "Security"';  // ערכי ברירת מחדל
    
  const locationQuery = searchParams.location 
    ? `"${searchParams.location}"` 
    : '"תל אביב"';  // ברירת מחדל למיקום
    
  const dateFilter = getDateFilter();
  
  // שימוש במילות מפתח נוספות לשיפור תוצאות החיפוש
  const searchQuery = `site:linkedin.com/jobs inurl:view (${skillsQuery}) ${locationQuery} after:${dateFilter} careers job posting`;
  console.log('Building search query:', searchQuery);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100&filter=0`;
  
  try {
    console.log('Searching Google with URL:', searchUrl);
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    
    // לוג מורחב לדיבוג
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response HTML length:', html.length);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse Google search results');
      return [];
    }

    const jobUrls: string[] = [];
    const links = doc.querySelectorAll('a');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // חיפוש קישורים ישירים ללינקדאין
      if (href.includes('linkedin.com/jobs/view/')) {
        try {
          const url = new URL(href);
          jobUrls.push(url.toString());
          console.log('Added direct LinkedIn URL:', url.toString());
        } catch (e) {
          console.error('Error parsing LinkedIn URL:', href, e);
        }
      }
      // חיפוש קישורים מגוגל שמפנים ללינקדאין
      else if (href.startsWith('/url?')) {
        const urlParams = new URLSearchParams(href.substring(5));
        const directUrl = urlParams.get('q');
        if (directUrl?.includes('linkedin.com/jobs/view/')) {
          try {
            const url = new URL(directUrl);
            jobUrls.push(url.toString());
            console.log('Added Google redirect URL:', url.toString());
          } catch (e) {
            console.error('Error parsing Google redirect URL:', directUrl, e);
          }
        }
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
