
import { getRandomUserAgent } from './userAgents.ts';

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await delay(1000 + Math.random() * 2000);  // הוספת השהייה אקראית
      
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
          'Cookie': ''  // נקה את העוגיות
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      await delay(2000 * (i + 1));  // הגדלת ההשהייה בכל ניסיון
    }
  }
  
  throw lastError;
}
