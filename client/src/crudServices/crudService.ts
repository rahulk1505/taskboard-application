// src/services/crudService.ts

export const crudService = {
  
  fetch: async <T = any>(baseUrl: string, queryParams?: string): Promise<T> => {
    const apiUrl = "https://taskboard-application-k-rahuls-projects.vercel.app" + baseUrl;
    const url = queryParams ? `${apiUrl}?${queryParams}` : apiUrl;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  create: async <T = any>(baseUrl: string, payload: any): Promise<T> => {
    const apiUrl = "https://taskboard-application-k-rahuls-projects.vercel.app" + baseUrl;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  update: async <T = any>(baseUrl: string, payload: any): Promise<T> => {
    const apiUrl = "https://taskboard-application-k-rahuls-projects.vercel.app" + baseUrl;
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  delete: async <T = any>(baseUrl: string, payload: any): Promise<T> => {
    const apiUrl = "https://taskboard-application-k-rahuls-projects.vercel.app" + baseUrl;
    const res = await fetch(apiUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
