
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

  // שיפור שאילתת החיפוש
  const skillsQuery = searchParams.skills.length > 0 
    ? searchParams.skills.join(' ') // הסרת המרכאות לחיפוש טבעי יותר
    : 'Cloud Security';
    
  const locationQuery = searchParams.location || 'תל אביב';
  const dateFilter = getDateFilter();
  
  // שימוש בפורמט חיפוש פשוט יותר
  const searchQuery = `${skillsQuery} ${locationQuery} site:linkedin.com/jobs`;
  console.log('Building search query:', searchQuery);

  const encodedQuery = encodeURIComponent(searchQuery.trim());
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}&num=100&tbs=qdr:m`;
  
  try {
    console.log('Searching Google with URL:', searchUrl);
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    
    console.log('Response status:', response.status);
    console.log('Response HTML length:', html.length);
    
    if (html.includes('detected unusual traffic') || html.includes('Please show you\'re not a robot')) {
      console.error('Google bot detection triggered');
      return [];
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse Google search results');
      return [];
    }

    const jobUrls: Set<string> = new Set();
    
    // חיפוש בכל האלמנטים שיכולים להכיל קישורים
    ['a[href]', 'cite', '.r a', '.g h3 a'].forEach(selector => {
      doc.querySelectorAll(selector).forEach((element) => {
        let url = '';
        if (element.tagName.toLowerCase() === 'a') {
          url = element.getAttribute('href') || '';
        } else {
          url = element.textContent || '';
        }

        if (url.includes('linkedin.com/jobs/view/')) {
          try {
            // ניקוי ה-URL
            url = url.startsWith('/url?') ? new URLSearchParams(url.substring(5)).get('q') || '' : url;
            if (url && url.startsWith('http')) {
              const cleanUrl = new URL(url).toString();
              jobUrls.add(cleanUrl);
              console.log('Added job URL:', cleanUrl);
            }
          } catch (e) {
            console.error('Error parsing URL:', url, e);
          }
        }
      });
    });

    const uniqueJobUrls = Array.from(jobUrls);
    console.log(`Found ${uniqueJobUrls.length} unique job URLs:`, uniqueJobUrls);
    return uniqueJobUrls;

  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
}
